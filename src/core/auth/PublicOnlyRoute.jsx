import { Navigate, Outlet } from "react-router-dom";
import { getToken } from "./tokenStorage";

const PublicOnlyRoute = () => {
  const token = getToken();

  if (token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicOnlyRoute;