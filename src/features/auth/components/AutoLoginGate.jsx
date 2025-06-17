import { useEffect } from "react";
import { LoadingSpinner } from "@shared/components";

const AutoLoginGate = ({ children }) => {
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      // 토큰이 없으면 SSO 로그인 페이지로 리다이렉트
      const target = `${window.location.origin}/login-success`;
      const ssoUrl = `${
        import.meta.env.VITE_API_BASE_URL
      }/sso?target=${encodeURIComponent(target)}`;
      window.location.href = ssoUrl;
    }
  }, []);

  // 토큰이 있으면 children을 렌더링
  const token = localStorage.getItem("jwt");
  if (token) {
    return <>{children}</>;
  }

  // 토큰이 없으면 로딩 표시
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <LoadingSpinner />
      <p className="mt-4 text-slate-600 dark:text-slate-400">
        로그인 확인 중입니다...
      </p>
    </div>
  );
};

export default AutoLoginGate;
