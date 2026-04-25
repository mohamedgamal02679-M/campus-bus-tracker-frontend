import { Link, Outlet, useNavigate } from "react-router-dom";
import { clearAuthStorage, getUser } from "../core/auth/tokenStorage";
import AppFooter from "../core/components/AppFooter";

const getRoleKey = (user) => {
  if (user?.role === "admin") return "admin";
  return "rider";
};

const navItems = [
  {
    label: "Home",
    paths: {
      rider: "/",
      admin: "/",
    },
    roles: ["rider", "admin"],
  },
  {
    label: "Announcements",
    paths: {
      rider: "/announcements",
      admin: "/admin/announcements",
    },
    roles: ["rider", "admin"],
  },
  {
    label: "Routes",
    paths: {
      rider: "/routes",
      admin: "/admin/routes",
    },
    roles: ["rider", "admin"],
  },
  {
    label: "Stops",
    paths: {
      rider: "/stops",
      admin: "/admin/stops",
    },
    roles: ["rider", "admin"],
  },
  {
    label: "Schedules",
    paths: {
      rider: "/schedules",
      admin: "/admin/schedules",
    },
    roles: ["rider", "admin"],
  },
  {
    label: "Favorites",
    paths: {
      rider: "/favorites",
    },
    roles: ["rider"],
  },
  {
    label: "Planning",
    paths: {
      rider: "/planning/trip",
    },
    roles: ["rider"],
  },
  {
    label: "Operation Logs",
    paths: {
      admin: "/admin/logs",
    },
    roles: ["admin"],
  },
];

const AppLayout = () => {
  const navigate = useNavigate();
  const user = getUser();
  const roleKey = getRoleKey(user);

  const handleLogout = () => {
    clearAuthStorage();
    navigate("/login");
  };

  const visibleNavItems = navItems.filter((item) =>
    item.roles.includes(roleKey)
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f7fb",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <header
        style={{
          backgroundColor: "#0f172a",
          color: "#ffffff",
          padding: "16px 24px",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "24px",
            color: "#ffffff",
            textAlign: "center",
          }}
        >
          Campus Bus Tracker
        </h1>

        <div
          style={{
            marginTop: "12px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <nav style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            {visibleNavItems.map((item) => (
              <Link
                key={item.label}
                to={item.paths[roleKey]}
                style={{ color: "#ffffff", textDecoration: "none" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span>{user.fullName}</span>

              <button
                onClick={handleLogout}
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "#ef4444",
                  color: "#ffffff",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </header>

      <main
        style={{
          padding: "24px",
          flex: 1,
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          boxSizing: "border-box",
        }}
      >
        <Outlet />
      </main>

      <AppFooter />
    </div>
  );
};

export default AppLayout;