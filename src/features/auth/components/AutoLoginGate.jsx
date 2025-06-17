// import { useEffect } from "react"; // 개발용: 사용하지 않으므로 주석처리
import { LoadingSpinner } from "@shared/components";

const AutoLoginGate = ({ children }) => {
  // 개발용: 자동 로그인 체크 비활성화
  /*
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
  */

  // 개발용: 항상 로그인된 상태로 처리
  return <>{children}</>;
};

export default AutoLoginGate;
