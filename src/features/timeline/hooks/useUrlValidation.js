// src/features/timeline/hooks/useUrlValidation.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useLines,
  useSDWT,
  useEquipments,
} from "@/features/drilldown/hooks/useLineQueries";

export function useUrlValidation(
  params,
  lineId,
  sdwtId,
  setLine,
  setSdwt,
  setEqp
) {
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [isUrlInitialized, setIsUrlInitialized] = useState(false);

  const navigate = useNavigate();
  const { data: lines = [] } = useLines();
  const { data: sdwts = [] } = useSDWT(params.lineId || lineId);
  const { data: eqps = [] } = useEquipments(
    params.lineId || lineId,
    params.sdwtId || sdwtId
  );

  useEffect(() => {
    const validateAndSetParams = async () => {
      if (params.lineId && params.sdwtId && params.eqpId) {
        setIsValidating(true);
        setValidationError(null);
        setIsUrlInitialized(true);

        setLine(params.lineId);
        setSdwt(params.sdwtId);
        setEqp(params.eqpId);

        try {
          let retryCount = 0;
          const maxRetries = 10;

          while (retryCount < maxRetries) {
            if (lines.length > 0) {
              const validLine = lines.find((l) => l.id === params.lineId);
              if (!validLine) {
                throw new Error(
                  `라인 ID "${params.lineId}"를 찾을 수 없습니다.`
                );
              }

              if (sdwts.length > 0) {
                const validSdwt = sdwts.find((s) => s.id === params.sdwtId);
                if (!validSdwt) {
                  throw new Error(
                    `SDWT ID "${params.sdwtId}"를 찾을 수 없습니다.`
                  );
                }

                if (eqps.length > 0) {
                  const validEqp = eqps.find((e) => e.id === params.eqpId);
                  if (!validEqp) {
                    throw new Error(
                      `EQP ID "${params.eqpId}"를 찾을 수 없습니다.`
                    );
                  }

                  setIsValidating(false);
                  return;
                }
              }
            }

            await new Promise((resolve) => setTimeout(resolve, 300));
            retryCount++;
          }

          setIsValidating(false);
        } catch (error) {
          setValidationError(error.message);
          setLine("");
          setSdwt("");
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
    params.sdwtId,
    params.eqpId,
    lines,
    sdwts,
    eqps,
    isUrlInitialized,
    navigate,
    setLine,
    setSdwt,
    setEqp,
  ]);

  return { isValidating, validationError, isUrlInitialized };
}
