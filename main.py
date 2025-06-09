# main.py
from fastapi import FastAPI, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from deps import get_db
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class LogWithDuration(BaseModel):
    id: str
    lineId: str
    sdwtId: Optional[str]
    eqpId: str
    logType: str
    eventType: str
    eventTime: datetime
    endTime: Optional[datetime]
    operator: Optional[str]
    comment: Optional[str]
    url: Optional[str] = None
    duration: Optional[float]


@app.get("/lines")
async def get_lines(db: AsyncSession = Depends(get_db)):
    query = text("""
        SELECT DISTINCT line_id AS id
        FROM sdwt_eqp
        ORDER BY line_id
    """)
    result = await db.execute(query)
    lines = result.fetchall()
    return [{"id": row.id, "name": f"Line {row.id}"} for row in lines]


@app.get("/sdwts")
async def get_sdwts(lineId: str = Query(...), db: AsyncSession = Depends(get_db)):
    query = text("""
        SELECT DISTINCT sdwt_prod AS id
        FROM sdwt_eqp
        WHERE line_id = :lineId
        ORDER BY sdwt_prod
    """)
    result = await db.execute(query, {"lineId": lineId})
    sdwts = result.fetchall()
    return [{"id": row.id, "lineId": lineId, "name": row.id} for row in sdwts]


@app.get("/prc-groups")
async def get_prc_groups(
    lineId: str = Query(...),
    sdwtId: str = Query(...),
    db: AsyncSession = Depends(get_db)
):
    query = text("""
        SELECT DISTINCT prc_group AS id
        FROM sdwt_eqp
        WHERE line_id = :lineId AND sdwt_prod = :sdwtId
        ORDER BY prc_group
    """)
    result = await db.execute(query, {"lineId": lineId, "sdwtId": sdwtId})
    groups = result.fetchall()
    return [{"id": row.id, "name": row.id} for row in groups]


@app.get("/equipments")
async def get_equipments(
    lineId: str = Query(...),
    sdwtId: Optional[str] = Query(None),
    prcGroup: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    base_query = """
        SELECT DISTINCT eqp_cb AS id, line_id, sdwt_prod, prc_group
        FROM sdwt_eqp
        WHERE line_id = :lineId
    """
    params = {"lineId": lineId}

    if sdwtId:
        base_query += " AND sdwt_prod = :sdwtId"
        params["sdwtId"] = sdwtId

    if prcGroup:
        base_query += " AND prc_group = :prcGroup"
        params["prcGroup"] = prcGroup

    base_query += " ORDER BY eqp_cb"

    query = text(base_query)
    result = await db.execute(query, params)
    eqps = result.fetchall()

    return [
        {
            "id": row.id,
            "lineId": row.line_id,
            "sdwtId": row.sdwt_prod,
            "prcGroup": row.prc_group,
            "name": row.id
        }
        for row in eqps
    ]

@app.get("/equipment-info/{eqpId}")
async def get_equipment_info(
    eqpId: str,
    lineId: str = Query(...),
    db: AsyncSession = Depends(get_db)
):
    """특정 EQP의 전체 정보(SDWT, PRC Group 포함)를 조회"""
    query = text("""
        SELECT DISTINCT 
            eqp_cb AS id,
            line_id,
            sdwt_prod,
            prc_group
        FROM sdwt_eqp
        WHERE eqp_cb = :eqpId AND line_id = :lineId
        LIMIT 1
    """)
    
    result = await db.execute(query, {"eqpId": eqpId, "lineId": lineId})
    row = result.fetchone()
    
    if not row:
        raise HTTPException(
            status_code=404,
            detail=f"Equipment {eqpId} not found in line {lineId}"
        )
    
    return {
        "id": row.id,
        "lineId": row.line_id,
        "sdwtId": row.sdwt_prod,
        "prcGroup": row.prc_group
    }
    
@app.get("/logs", response_model=List[LogWithDuration])
async def get_logs(
    lineId: str = Query(...),
    eqpId: str = Query(...),
    db: AsyncSession = Depends(get_db),
):
    # 컬럼명 변경: eqp_id → eqp_cb, sdwt_id → sdwt_prod
    query = text("""
        SELECT 
            CONCAT('EQP-', id) AS id, 
            line_id, 
            sdwt_prod AS sdwt_id, 
            eqp_cb AS eqp_id,
            'EQP' AS logType, 
            status_type AS eventType,
            event_time, 
            end_time, 
            operator, 
            comment, 
            NULL AS url
        FROM eqp_status_hist
        WHERE line_id = :line AND eqp_cb = :eqp

        UNION ALL

        SELECT 
            CONCAT('TIP-', id) AS id,
            line_id, 
            sdwt_prod AS sdwt_id, 
            eqp_cb AS eqp_id,
            'TIP' AS logType, 
            tip_type AS eventType,
            event_time, 
            end_time, 
            operator, 
            comment, 
            CONCAT('https://tip.example.com/issue/', id) AS url
        FROM gpm_tip_hist
        WHERE line_id = :line AND eqp_cb = :eqp

        UNION ALL

        SELECT 
            CONCAT('RACB-', id) AS id,
            line_id, 
            sdwt_prod AS sdwt_id, 
            eqp_cb AS eqp_id,
            'RACB' AS logType, 
            'RACB' AS eventType,
            event_time, 
            end_time, 
            operator, 
            comment, 
            CONCAT('https://racb.example.com/alarm/', id) AS url
        FROM racb_list
        WHERE line_id = :line AND eqp_cb = :eqp

        UNION ALL

        SELECT 
            CONCAT('CTTTM-', id) AS id,
            line_id, 
            sdwt_prod AS sdwt_id, 
            eqp_cb AS eqp_id,
            'CTTTM' AS logType, 
            ctttm_type AS eventType,
            event_time, 
            end_time, 
            operator, 
            comment, 
            NULL AS url
        FROM ctttm_log_hist
        WHERE line_id = :line AND eqp_cb = :eqp

        UNION ALL

        SELECT 
            CONCAT('JIRA-', id) AS id,
            line_id, 
            sdwt_prod AS sdwt_id, 
            eqp_cb AS eqp_id,
            'JIRA' AS logType, 
            issue_status AS eventType,
            event_time, 
            end_time, 
            operator, 
            comment, 
            CONCAT('https://jira.example.com/browse/', issue_key) AS url
        FROM jira_issue_hist
        WHERE line_id = :line AND eqp_cb = :eqp
        
        ORDER BY event_time DESC
    """)

    params = {"line": lineId, "eqp": eqpId}

    result = await db.execute(query, params)
    rows = result.fetchall()

    return [
        LogWithDuration(
            id=row.id,
            lineId=row.line_id,
            sdwtId=row.sdwt_id,
            eqpId=row.eqp_id,
            logType=row.logType,
            eventType=row.eventType,
            eventTime=row.event_time,
            endTime=row.end_time,
            operator=row.operator,
            comment=row.comment,
            url=row.url,
            duration=(row.end_time - row.event_time).total_seconds()
            if row.end_time else None,
        )
        for row in rows
    ]


@app.get("/")
async def root():
    return {
        "message": "EQP Timeline API",
        "version": "1.2.0",
    }


@app.get("/health")
async def health_check(db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(text("SELECT 1"))
        result.fetchone()
        
        eqp_count = await db.execute(text("SELECT COUNT(*) as cnt FROM sdwt_eqp"))
        count = eqp_count.fetchone().cnt
        
        return {
            "status": "healthy",
            "database": "connected",
            "eqp_count": count,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail={
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        })