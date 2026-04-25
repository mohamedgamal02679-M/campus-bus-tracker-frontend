import { Link } from "react-router-dom";
import { getUser } from "../auth/tokenStorage";

const footerSectionTitleStyle = {
  marginTop: 0,
  marginBottom: "12px",
  fontSize: "16px",
  color: "#ffffff",
};

const footerLinkStyle = {
  color: "#cbd5e1",
  textDecoration: "none",
  lineHeight: "1.9",
  display: "block",
};

const AppFooter = () => {
  const user = getUser();
  const role = user?.role || "public";

  const roleLinks =
    role === "admin"
      ? [
          { label: "Announcements", to: "/admin/announcements" },
          { label: "Routes", to: "/admin/routes" },
          { label: "Stops", to: "/admin/stops" },
          { label: "Schedules", to: "/admin/schedules" },
          { label: "Operation Logs", to: "/admin/logs" },
        ]
      : role === "rider"
      ? [
          { label: "Announcements", to: "/announcements" },
          { label: "Routes", to: "/routes" },
          { label: "Stops", to: "/stops" },
          { label: "Schedules", to: "/schedules" },
          { label: "Favorites", to: "/favorites" },
          { label: "Planning", to: "/planning/trip" },
        ]
      : [
          { label: "Login", to: "/login" },
          { label: "Register", to: "/register" },
        ];

  return (
    <footer
      style={{
        backgroundColor: "#0f172a",
        color: "#ffffff",
        marginTop: "40px",
        padding: "32px 24px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "24px",
        }}
      >
        <div>
          <h3 style={{ marginTop: 0, marginBottom: "12px", fontSize: "22px" }}>
            Campus Bus Tracker
          </h3>

          <p
            style={{
              margin: 0,
              color: "#cbd5e1",
              lineHeight: "1.9",
            }}
          >
            A role-based web application for managing announcements, routes,
            stops, schedules, rider favorites, trip planning, and operational
            monitoring.
          </p>
        </div>

        <div>
          <h4 style={footerSectionTitleStyle}>Quick Links</h4>

          {roleLinks.map((item) => (
            <Link key={item.label} to={item.to} style={footerLinkStyle}>
              {item.label}
            </Link>
          ))}
        </div>

        <div>
          <h4 style={footerSectionTitleStyle}>Access Level</h4>

          <p style={{ margin: "0 0 8px", color: "#cbd5e1", lineHeight: "1.9" }}>
            Current view:{" "}
            <strong style={{ color: "#ffffff" }}>
              {role === "admin"
                ? "Administrator"
                : role === "rider"
                ? "Rider"
                : "Authentication Required"}
            </strong>
          </p>

          <p style={{ margin: 0, color: "#cbd5e1", lineHeight: "1.9" }}>
            {role === "admin"
              ? "You can manage system records and review operation logs."
              : role === "rider"
              ? "You can browse transport data, save favorite stops, and plan trips."
              : "Please log in or register to access the system."}
          </p>
        </div>
      </div>

      <div
        style={{
          maxWidth: "1200px",
          margin: "24px auto 0",
          paddingTop: "16px",
          borderTop: "1px solid rgba(255,255,255,0.12)",
          textAlign: "center",
          color: "#94a3b8",
          fontSize: "14px",
        }}
      >
        <span>© 2026 Campus Bus Tracker. All rights reserved.</span>
      </div>
    </footer>
  );
};

export default AppFooter;