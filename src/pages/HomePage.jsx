import { Link } from "react-router-dom";
import { getUser } from "../core/auth/tokenStorage";

const sectionCardStyle = {
  backgroundColor: "#ffffff",
  borderRadius: "20px",
  padding: "28px",
  boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
  marginBottom: "20px",
};

const buttonStyle = {
  display: "inline-block",
  padding: "10px 18px",
  borderRadius: "10px",
  backgroundColor: "#0f172a",
  color: "#ffffff",
  textDecoration: "none",
  fontWeight: "600",
  fontSize: "14px",
};

const getRoleLabel = (role) => {
  if (role === "admin") return "Administrator";
  if (role === "rider") return "Rider";
  return "Guest";
};

const HomePage = () => {
  const user = getUser();
  const role = user?.role || "guest";

  const heroDescription =
    role === "admin"
      ? "Manage announcements, routes, stops, schedules, and operation logs through one organized dashboard."
      : role === "rider"
      ? "Plan trips, browse routes, view stops and schedules, and save your favorite stops through one clear interface."
      : "Plan trips, browse routes, view stops and schedules, and stay updated with shuttle announcements through one clear interface.";

  const services =
    role === "admin"
      ? [
          {
            title: "Announcements",
            description:
              "Use this service to create, update, and manage shuttle announcements that appear to users across the system.",
            path: "/admin/announcements",
          },
          {
            title: "Routes",
            description:
              "Use this service to manage the transport routes, including route names, codes, start points, end points, and duration details.",
            path: "/admin/routes",
          },
          {
            title: "Stops",
            description:
              "Use this service to manage stop records, assign them to routes, and keep location and order data organized.",
            path: "/admin/stops",
          },
          {
            title: "Schedules",
            description:
              "Use this service to create and maintain departure schedules, directions, active days, and timing details for each route.",
            path: "/admin/schedules",
          },
          {
            title: "Operation Logs",
            description:
              "Use this service to review tracked system activity, monitor important actions, and inspect the audit trail of operations.",
            path: "/admin/logs",
          },
        ]
      : role === "rider"
      ? [
          {
            title: "Announcements",
            description:
              "Check the latest updates and notices published by the administrator about shuttle services and schedule changes.",
            path: "/announcements",
          },
          {
            title: "Routes",
            description:
              "Browse the available transport routes and understand how each route moves between locations.",
            path: "/routes",
          },
          {
            title: "Stops",
            description:
              "View stop details, see their order on each route, and add useful stops to your favorites list.",
            path: "/stops",
          },
          {
            title: "Schedules",
            description:
              "Check the available timing information for trips, including days, departure times, and arrival times.",
            path: "/schedules",
          },
          {
            title: "Favorites",
            description:
              "Keep your most used stops in one place so you can reach them faster whenever you need them.",
            path: "/favorites",
          },
          {
            title: "Planning",
            description:
              "Choose a starting stop and a destination stop to find the best direct trip available in the system.",
            path: "/planning/trip",
          },
        ]
      : [
          {
            title: "Announcements",
            description:
              "View public announcements and service notices before signing in.",
            path: "/announcements",
          },
          {
            title: "Routes",
            description:
              "Explore the available transport routes and understand the main movement paths in the system.",
            path: "/routes",
          },
          {
            title: "Stops",
            description:
              "Browse public stop information and see the stop structure linked to routes.",
            path: "/stops",
          },
          {
            title: "Schedules",
            description:
              "Review public trip timings and transport schedule information.",
            path: "/schedules",
          },
          {
            title: "Login",
            description:
              "Sign in to access role-based services and your personalized system view.",
            path: "/login",
          },
          {
            title: "Register",
            description:
              "Create a rider account to unlock favorites and trip planning features.",
            path: "/register",
          },
        ];

  return (
    <div>
      <div
        style={{
          ...sectionCardStyle,
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #2563eb 100%)",
          color: "#ffffff",
          textAlign: "center",
          padding: "64px 32px",
        }}
      >
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              marginBottom: "20px",
              fontSize: "46px",
              lineHeight: "1.2",
              color: "#ffffff",
            }}
          >
            Welcome to Campus Bus Tracker
          </h2>

          <p
            style={{
              margin: 0,
              fontSize: "21px",
              lineHeight: "1.9",
              color: "#dbeafe",
            }}
          >
            {heroDescription}
          </p>
        </div>
      </div>

      <div style={sectionCardStyle}>
        <h3
  style={{
    marginTop: 0,
    marginBottom: "10px",
    color: "#0f172a",
    fontSize: "32px",
    textAlign: "left",
  }}
>
  Available Services
</h3>

        <p
  style={{
    color: "#475569",
    marginTop: 0,
    marginBottom: "26px",
    textAlign: "left",
    lineHeight: "1.9",
    fontSize: "17px",
  }}
>
          You are currently using the system as{" "}
          <strong>{user?.fullName || "Visitor"}</strong> with access level{" "}
          <strong>{getRoleLabel(role)}</strong>. Below are the services available
          in your current view and what each one does.
        </p>

        <div>
          {services.map((service, index) => (
            <div
              key={service.title}
              style={{
                padding: "22px 0",
                borderBottom:
                  index === services.length - 1
                    ? "none"
                    : "1px solid #e2e8f0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "20px",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ flex: 1, minWidth: "260px" }}>
                  <h4
                    style={{
                      marginTop: 0,
                      marginBottom: "10px",
                      color: "#0f172a",
                      fontSize: "24px",
                    }}
                  >
                    {service.title}
                  </h4>

                  <p
                    style={{
                      margin: 0,
                      color: "#475569",
                      lineHeight: "1.95",
                      fontSize: "17px",
                    }}
                  >
                    {service.description}
                  </p>
                </div>

                <div>
                  <Link to={service.path} style={buttonStyle}>
                    Open Service
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;