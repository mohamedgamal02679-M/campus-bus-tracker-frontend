import { Navigate, Outlet } from "react-router-dom";
import { getToken } from "./tokenStorage";

const RequireAuth = () => {
  const token = getToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default RequireAuth;