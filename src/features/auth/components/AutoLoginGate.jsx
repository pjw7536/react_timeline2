// src/features/auth/components/AutoLoginGate.jsx
import { useAuth } from "../contexts/AuthContext";
import { LoadingSpinner } from "@shared/components";

const AutoLoginGate = ({ children }) => {
  const { isAuthenticated, isLoading, login } = useAuth();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <LoadingSpinner />
        <p className="mt-4 text-slate-600 dark:text-slate-400">
          로그인 확인 중입니다...
        </p>
      </div>
    );
  }

  // 인증되지 않은 경우 SSO 로그인으로 리다이렉트
  if (!isAuthenticated) {
    login();
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <LoadingSpinner />
        <p className="mt-4 text-slate-600 dark:text-slate-400">
          로그인 페이지로 이동 중...
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

export default AutoLoginGate;
