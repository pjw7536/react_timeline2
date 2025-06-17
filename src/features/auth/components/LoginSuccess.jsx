import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "@shared/components";

const LoginSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      // 토큰을 localStorage에 저장
      localStorage.setItem("jwt", token);

      // 원래 가려던 페이지로 리다이렉트 (없으면 홈으로)
      const redirectPath = sessionStorage.getItem("redirectAfterLogin") || "/";
      sessionStorage.removeItem("redirectAfterLogin");
      navigate(redirectPath);
    } else {
      alert("로그인에 실패했습니다.");
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <LoadingSpinner />
      <p className="mt-4 text-slate-600 dark:text-slate-400">
        로그인 처리 중입니다...
      </p>
    </div>
  );
};

export default LoginSuccess;
