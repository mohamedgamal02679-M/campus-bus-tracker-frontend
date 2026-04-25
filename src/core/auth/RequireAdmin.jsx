import { Navigate, Outlet } from "react-router-dom";
import { getUser } from "./tokenStorage";

const RequireAdmin = () => {
  const user = getUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RequireAdmin;