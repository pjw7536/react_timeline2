import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem("jwt");

  if (!token) {
    // 로그인 후 돌아올 경로 저장
    sessionStorage.setItem("redirectAfterLogin", location.pathname);
    // AutoLoginGate가 SSO로 리다이렉트하도록 홈으로 이동
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
