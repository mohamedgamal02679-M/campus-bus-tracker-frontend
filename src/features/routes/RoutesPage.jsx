import { useEffect, useState } from "react";
import { getAllRoutesRequest } from "./routesService";

const cardStyle = {
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  padding: "20px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
  marginBottom: "16px",
};

const statusBadgeStyle = (isActive) => ({
  backgroundColor: isActive ? "#16a34a" : "#64748b",
  color: "#ffffff",
  padding: "6px 10px",
  borderRadius: "999px",
  fontSize: "14px",
  fontWeight: "bold",
});

const RoutesPage = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const result = await getAllRoutesRequest({
          isActive: true,
        });

        setRoutes(result);
      } catch (error) {
        setErrorMessage(
          error?.response?.data?.message ||
            "Failed to load routes. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  if (loading) {
    return (
      <div style={cardStyle}>
        <h2 style={{ marginTop: 0 }}>Routes</h2>
        <p>Loading routes...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div style={cardStyle}>
        <h2 style={{ marginTop: 0 }}>Routes</h2>
        <p style={{ color: "#dc2626" }}>{errorMessage}</p>
      </div>
    );
  }

  return (
    <div>
      <div style={cardStyle}>
        <h2 style={{ marginTop: 0, color: "#0f172a" }}>Routes</h2>
        <p style={{ color: "#475569", marginBottom: 0 }}>
          Available bus routes in the system.
        </p>
      </div>

      {routes.length === 0 ? (
        <div style={cardStyle}>
          <p style={{ margin: 0 }}>No routes available right now.</p>
        </div>
      ) : (
        routes.map((route) => (
          <div key={route._id} style={cardStyle}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    flexWrap: "wrap",
                    marginBottom: "8px",
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      color: "#0f172a",
                    }}
                  >
                    {route.name}
                  </h3>

                  <span
                    style={{
                      backgroundColor: "#e2e8f0",
                      color: "#0f172a",
                      padding: "6px 10px",
                      borderRadius: "999px",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    {route.code}
                  </span>
                </div>

                <p style={{ margin: 0, color: "#475569", lineHeight: "1.8" }}>
                  <strong>From:</strong> {route.startLocationName}
                </p>

                <p style={{ margin: 0, color: "#475569", lineHeight: "1.8" }}>
                  <strong>To:</strong> {route.endLocationName}
                </p>

                {route.description ? (
                  <p
                    style={{
                      marginTop: "12px",
                      marginBottom: 0,
                      color: "#475569",
                      lineHeight: "1.8",
                    }}
                  >
                    {route.description}
                  </p>
                ) : null}
              </div>

              <span style={statusBadgeStyle(route.isActive)}>
                {route.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            <div
              style={{
                marginTop: "16px",
                display: "flex",
                gap: "16px",
                flexWrap: "wrap",
                color: "#64748b",
                fontSize: "14px",
              }}
            >
              <span>
                <strong>Duration:</strong> {route.estimatedDurationMinutes} min
              </span>

              {route.createdBy?.fullName ? (
                <span>
                  <strong>Created by:</strong> {route.createdBy.fullName}
                </span>
              ) : null}

              {route.createdAt ? (
                <span>
                  <strong>Created:</strong>{" "}
                  {new Date(route.createdAt).toLocaleString()}
                </span>
              ) : null}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default RoutesPage;