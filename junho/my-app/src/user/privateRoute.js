import {  Navigate } from "react-router-dom";

export default function PrivateRoute({ currentRole,  children}) {
  if (!currentRole) {
    // 권한 정보가 없으면 로그인 페이지로 리다이렉트
    return <Navigate to="/login" replace />;
  }
  return children;
}
