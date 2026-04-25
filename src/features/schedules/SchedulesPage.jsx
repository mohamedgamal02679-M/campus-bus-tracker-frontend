import { useEffect, useState } from "react";
import { getAllSchedulesRequest } from "./schedulesService";

const cardStyle = {
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  padding: "20px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
  marginBottom: "16px",
};

const badgeStyle = (value) => ({
  backgroundColor: value ? "#16a34a" : "#64748b",
  color: "#ffffff",
  padding: "6px 10px",
  borderRadius: "999px",
  fontSize: "14px",
  fontWeight: "bold",
});

const formatDay = (dayOfWeek = "") => {
  if (!dayOfWeek) return "";
  return dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);
};

const SchedulesPage = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const result = await getAllSchedulesRequest({
          isActive: true,
        });

        setSchedules(result);
      } catch (error) {
        setErrorMessage(
          error?.response?.data?.message ||
            "Failed to load schedules. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  if (loading) {
    return (
      <div style={cardStyle}>
        <h2 style={{ marginTop: 0 }}>Schedules</h2>
        <p>Loading schedules...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div style={cardStyle}>
        <h2 style={{ marginTop: 0 }}>Schedules</h2>
        <p style={{ color: "#dc2626" }}>{errorMessage}</p>
      </div>
    );
  }

  return (
    <div>
      <div style={cardStyle}>
        <h2 style={{ marginTop: 0, color: "#0f172a" }}>Schedules</h2>
        <p style={{ color: "#475569", marginBottom: 0 }}>
          Available bus schedules in the system.
        </p>
      </div>

      {schedules.length === 0 ? (
        <div style={cardStyle}>
          <p style={{ margin: 0 }}>No schedules available right now.</p>
        </div>
      ) : (
        schedules.map((schedule) => (
          <div key={schedule._id} style={cardStyle}>
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
                <h3 style={{ marginTop: 0, marginBottom: "8px", color: "#0f172a" }}>
                  {schedule.route?.name || "Unknown Route"}
                  {schedule.route?.code ? ` (${schedule.route.code})` : ""}
                </h3>

                <p style={{ margin: 0, color: "#475569", lineHeight: "1.8" }}>
                  <strong>Stop:</strong> {schedule.stop?.name || "Unknown Stop"}
                  {schedule.stop?.order ? ` - Order ${schedule.stop.order}` : ""}
                </p>

                <p style={{ margin: 0, color: "#475569", lineHeight: "1.8" }}>
                  <strong>Day:</strong> {formatDay(schedule.dayOfWeek)}
                </p>

                <p style={{ margin: 0, color: "#475569", lineHeight: "1.8" }}>
                  <strong>Departure:</strong> {schedule.departureTime}
                </p>

                <p style={{ margin: 0, color: "#475569", lineHeight: "1.8" }}>
                  <strong>Arrival:</strong>{" "}
                  {schedule.arrivalTime ? schedule.arrivalTime : "Not specified"}
                </p>

                <p style={{ margin: 0, color: "#475569", lineHeight: "1.8" }}>
                  <strong>Direction:</strong> {schedule.direction}
                </p>

                <p style={{ margin: 0, color: "#475569", lineHeight: "1.8" }}>
                  <strong>Schedule Type:</strong> {schedule.scheduleType}
                </p>

                <p style={{ margin: 0, color: "#475569", lineHeight: "1.8" }}>
                  <strong>Season Label:</strong> {schedule.seasonLabel}
                </p>

                {schedule.notes ? (
                  <p
                    style={{
                      marginTop: "12px",
                      marginBottom: 0,
                      color: "#475569",
                      lineHeight: "1.8",
                    }}
                  >
                    <strong>Notes:</strong> {schedule.notes}
                  </p>
                ) : null}
              </div>

              <span style={badgeStyle(schedule.isActive)}>
                {schedule.isActive ? "Active" : "Inactive"}
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
              {schedule.createdBy?.fullName ? (
                <span>
                  <strong>Created by:</strong> {schedule.createdBy.fullName}
                </span>
              ) : null}

              {schedule.createdAt ? (
                <span>
                  <strong>Created:</strong>{" "}
                  {new Date(schedule.createdAt).toLocaleString()}
                </span>
              ) : null}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default SchedulesPage;