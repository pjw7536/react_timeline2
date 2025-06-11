// src/features/timeline/hooks/useUrlValidation.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { useLines } from "@/features/drilldown/hooks/useLineQueries"; // 불필요한 의존성 제거
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
  // const { data: lines = [] } = useLines(); // 불필요한 의존성 제거

  useEffect(() => {
    const validateAndSetParams = async () => {
      if (params.lineId && params.eqpId) {
        setIsValidating(true);
        setValidationError(null);
        setIsUrlInitialized(true);

        try {
          const eqpInfo = await timelineApi.fetchEquipmentInfo(
            params.lineId,
            params.eqpId
          );

          // 백엔드에서 이미 유효성 검증이 완료됨
          if (!eqpInfo) {
            setValidationError("유효하지 않은 Line ID 또는 EQP ID입니다.");
            setTimeout(() => navigate("/timeline"), 1500);
            return;
          }

          // 상태 업데이트
          setLine(params.lineId);
          setSdwt(eqpInfo.sdwtId);
          setPrcGroup(eqpInfo.prcGroup);
          setEqp(params.eqpId);
        } catch {
          setValidationError("데이터 검증 중 오류가 발생했습니다.");
          setTimeout(() => navigate("/timeline"), 1500);
        } finally {
          setIsValidating(false);
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
    isUrlInitialized,
    navigate,
    setLine,
    setSdwt,
    setPrcGroup,
    setEqp,
  ]);

  return { isValidating, validationError, isUrlInitialized };
}
