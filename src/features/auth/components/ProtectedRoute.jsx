// import { Navigate, useLocation } from "react-router-dom"; // 개발용: 사용하지 않으므로 주석처리

const ProtectedRoute = ({ children }) => {
  // const location = useLocation(); // 개발용: 사용하지 않으므로 주석처리

  // 개발용: 토큰 체크 로직 비활성화
  /*
  const token = localStorage.getItem("jwt");

  if (!token) {
    // 로그인 후 돌아올 경로 저장
    sessionStorage.setItem("redirectAfterLogin", location.pathname);
    // AutoLoginGate가 SSO로 리다이렉트하도록 홈으로 이동
    return <Navigate to="/" replace />;
  }
  */

  // 개발용: 항상 로그인된 상태로 처리
  return children;
};

export default ProtectedRoute;
