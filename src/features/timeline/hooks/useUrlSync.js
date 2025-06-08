// src/features/timeline/hooks/useUrlSync.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useUrlSync(
  lineId,
  sdwtId,
  eqpId,
  isValidating,
  isUrlInitialized
) {
  const navigate = useNavigate();

  useEffect(() => {
    if (isValidating || !isUrlInitialized) return;

    const currentPath = window.location.pathname;
    const isParamRoute =
      currentPath.includes("/timeline/") && currentPath.split("/").length > 3;

    if (lineId && sdwtId && eqpId) {
      const newPath = `/timeline/${lineId}/${sdwtId}/${eqpId}`;
      if (currentPath !== newPath) {
        navigate(newPath, { replace: true });
      }
    } else {
      if (isParamRoute) {
        navigate("/timeline", { replace: true });
      }
    }
  }, [lineId, sdwtId, eqpId, navigate, isValidating, isUrlInitialized]);
}
