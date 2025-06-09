// src/features/timeline/hooks/useUrlValidation.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLines } from "@/features/drilldown/hooks/useLineQueries";
import { timelineApi } from "@/features/timeline/api/timelineApi";

export function useUrlValidation(
  params,
  lineId,
  eqpId,
  setLine,
  setSdwt,
  setPrcGroup,
  setEqp
) {
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [isUrlInitialized, setIsUrlInitialized] = useState(false);

  const navigate = useNavigate();
  const { data: lines = [] } = useLines();

  useEffect(() => {
    const validateAndSetParams = async () => {
      if (params.lineId && params.eqpId) {
        setIsValidating(true);
        setValidationError(null);
        setIsUrlInitialized(true);

        try {
          // 라인 검증
          if (lines.length > 0) {
            const validLine = lines.find((l) => l.id === params.lineId);
            if (!validLine) {
              throw new Error(`라인 ID "${params.lineId}"를 찾을 수 없습니다.`);
            }
          }

          // EQP 정보 조회 (SDWT, PRC Group 포함)
          try {
            const eqpInfo = await timelineApi.fetchEquipmentInfo(
              params.eqpId,
              params.lineId
            );

            // 모든 정보 설정
            setLine(params.lineId);
            setSdwt(eqpInfo.sdwtId);
            setPrcGroup(eqpInfo.prcGroup);
            setEqp(params.eqpId);

            setIsValidating(false);
          } catch (error) {
            throw new Error(`EQP ID "${params.eqpId}"를 찾을 수 없습니다.`);
          }
        } catch (error) {
          setValidationError(error.message);
          setLine("");
          setSdwt("");
          setPrcGroup("");
          setEqp("");
          setTimeout(() => {
            navigate("/timeline");
          }, 3000);
        }
      } else {
        setIsUrlInitialized(true);
      }
    };

    if (!isUrlInitialized) {
      validateAndSetParams();
    }
  }, [
    params.lineId,
    params.eqpId,
    lines,
    isUrlInitialized,
    navigate,
    setLine,
    setSdwt,
    setPrcGroup,
    setEqp,
  ]);

  return { isValidating, validationError, isUrlInitialized };
}
