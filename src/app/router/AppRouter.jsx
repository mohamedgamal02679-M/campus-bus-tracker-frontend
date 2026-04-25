import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "../../layouts/AppLayout";
import LoginPage from "../../features/auth/LoginPage";
import RegisterPage from "../../features/auth/RegisterPage";
import AnnouncementsPage from "../../features/announcements/AnnouncementsPage";
import AdminAnnouncementsPage from "../../features/admin/AdminAnnouncementsPage";
import RoutesPage from "../../features/routes/RoutesPage";
import StopsPage from "../../features/stops/StopsPage";
import SchedulesPage from "../../features/schedules/SchedulesPage";
import FavoritesPage from "../../features/favorites/FavoritesPage";
import PlanningPage from "../../features/planning/PlanningPage";
import AdminRoutesPage from "../../features/admin/AdminRoutesPage";
import AdminStopsPage from "../../features/admin/AdminStopsPage";
import AdminSchedulesPage from "../../features/admin/AdminSchedulesPage";
import OperationLogsPage from "../../features/admin/OperationLogsPage";
import HomePage from "../../pages/HomePage";
import RequireAuth from "../../core/auth/RequireAuth";
import RequireAdmin from "../../core/auth/RequireAdmin";
import PublicOnlyRoute from "../../core/auth/PublicOnlyRoute";
import { getToken } from "../../core/auth/tokenStorage";

const AppRouter = () => {
  const isLoggedIn = Boolean(getToken());

  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<RequireAuth />}>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="announcements" element={<AnnouncementsPage />} />
          <Route path="routes" element={<RoutesPage />} />
          <Route path="stops" element={<StopsPage />} />
          <Route path="schedules" element={<SchedulesPage />} />
          <Route path="favorites" element={<FavoritesPage />} />
          <Route path="planning/trip" element={<PlanningPage />} />

          <Route element={<RequireAdmin />}>
            <Route
              path="admin/announcements"
              element={<AdminAnnouncementsPage />}
            />
            <Route path="admin/routes" element={<AdminRoutesPage />} />
            <Route path="admin/stops" element={<AdminStopsPage />} />
            <Route path="admin/schedules" element={<AdminSchedulesPage />} />
            <Route path="admin/logs" element={<OperationLogsPage />} />
          </Route>
        </Route>
      </Route>

      <Route
        path="*"
        element={<Navigate to={isLoggedIn ? "/" : "/login"} replace />}
      />
    </Routes>
  );
};

export default AppRouter;