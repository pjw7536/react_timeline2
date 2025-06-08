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
    allow_origins=["*"],  # 또는 정확한 주소만: ["http://192.168.219.111:5173"]
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
        SELECT DISTINCT sdwt_id AS id
        FROM sdwt_eqp
        WHERE line_id = :lineId
        ORDER BY sdwt_id
    """)
    result = await db.execute(query, {"lineId": lineId})
    sdwts = result.fetchall()
    return [{"id": row.id, "lineId": lineId, "name": f"SDWT {row.id}"} for row in sdwts]


@app.get("/equipments")
async def get_equipments(
    lineId: str = Query(...),
    sdwtId: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    base_query = """
        SELECT DISTINCT eqp_id AS id, line_id, sdwt_id
        FROM sdwt_eqp
        WHERE line_id = :lineId
    """
    params = {"lineId": lineId}

    if sdwtId:
        base_query += " AND sdwt_id = :sdwtId"
        params["sdwtId"] = sdwtId

    base_query += " ORDER BY eqp_id"

    query = text(base_query)
    result = await db.execute(query, params)
    eqps = result.fetchall()

    return [
        {
            "id": row.id,
            "lineId": row.line_id,
            "sdwtId": row.sdwt_id,
            "name": f"EQP {row.id}"
        }
        for row in eqps
    ]



@app.get("/logs", response_model=List[LogWithDuration])
async def get_logs(
    lineId: str = Query(...),
    sdwtId: Optional[str] = Query(None),
    eqpId: str = Query(...),
    db: AsyncSession = Depends(get_db),
):
    query = text(f"""
        SELECT 
            CONCAT('EQP-', id) AS id, line_id, sdwt_id, eqp_id,
            'EQP' AS logType, status_type AS eventType,
            event_time, end_time, operator, comment, NULL AS url
        FROM eqp_status_hist
        WHERE line_id = :line AND eqp_id = :eqp { "AND sdwt_id = :sdwt" if sdwtId else "" }

        UNION

        SELECT 
            CONCAT('TIP-', id), line_id, sdwt_id, eqp_id,
            'TIP', tip_type,
            event_time, end_time, operator, comment, 
            CONCAT('https://tip.example.com/issue/', id) AS url
        FROM gpm_tip_hist
        WHERE line_id = :line AND eqp_id = :eqp { "AND sdwt_id = :sdwt" if sdwtId else "" }

        UNION

        SELECT 
            CONCAT('RACB-', id), line_id, sdwt_id, eqp_id,
            'RACB', 'RACB',
            event_time, end_time, operator, comment, 
            CONCAT('https://racb.example.com/alarm/', id) AS url
        FROM racb_list
        WHERE line_id = :line AND eqp_id = :eqp { "AND sdwt_id = :sdwt" if sdwtId else "" }

        UNION

        SELECT 
            CONCAT('CTTTM-', id), line_id, sdwt_id, eqp_id,
            'CTTTM', ctttm_type,
            event_time, end_time, operator, comment, 
            NULL AS url
        FROM ctttm_log_hist
        WHERE line_id = :line AND eqp_id = :eqp { "AND sdwt_id = :sdwt" if sdwtId else "" }

        UNION

        SELECT 
            CONCAT('JIRA-', id), line_id, sdwt_id, eqp_id,
            'JIRA', issue_status,
            event_time, end_time, operator, comment, 
            CONCAT('https://jira.example.com/browse/', issue_key) AS url
        FROM jira_issue_hist
        WHERE line_id = :line AND eqp_id = :eqp { "AND sdwt_id = :sdwt" if sdwtId else "" }
        
        ORDER BY event_time DESC
    """)

    params = {"line": lineId, "eqp": eqpId}
    if sdwtId:
        params["sdwt"] = sdwtId

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
        "version": "1.1.0",
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