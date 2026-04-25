import { useEffect, useState } from "react";
import { getAllAnnouncementsRequest } from "./announcementsService";

const cardStyle = {
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  padding: "20px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
  marginBottom: "16px",
};

const badgeColors = {
  low: "#16a34a",
  medium: "#f59e0b",
  high: "#dc2626",
};

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const result = await getAllAnnouncementsRequest({
          isActive: true,
        });

        setAnnouncements(result);
      } catch (error) {
        setErrorMessage(
          error?.response?.data?.message ||
            "Failed to load announcements. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  if (loading) {
    return (
      <div style={cardStyle}>
        <h2 style={{ marginTop: 0 }}>Announcements</h2>
        <p>Loading announcements...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div style={cardStyle}>
        <h2 style={{ marginTop: 0 }}>Announcements</h2>
        <p style={{ color: "#dc2626" }}>{errorMessage}</p>
      </div>
    );
  }

  return (
    <div>
      <div style={cardStyle}>
        <h2 style={{ marginTop: 0, color: "#0f172a" }}>Announcements</h2>
        <p style={{ color: "#475569", marginBottom: 0 }}>
          Latest active announcements from the admin.
        </p>
      </div>

      {announcements.length === 0 ? (
        <div style={cardStyle}>
          <p style={{ margin: 0 }}>No announcements available right now.</p>
        </div>
      ) : (
        announcements.map((announcement) => (
          <div key={announcement._id} style={cardStyle}>
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
                  {announcement.title}
                </h3>

                <p style={{ margin: 0, color: "#475569", lineHeight: "1.8" }}>
                  {announcement.message}
                </p>
              </div>

              <span
                style={{
                  backgroundColor: badgeColors[announcement.priority] || "#64748b",
                  color: "#ffffff",
                  padding: "6px 10px",
                  borderRadius: "999px",
                  fontSize: "14px",
                  fontWeight: "bold",
                  textTransform: "capitalize",
                }}
              >
                {announcement.priority}
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
                <strong>Scope:</strong> {announcement.scope}
              </span>

              <span>
                <strong>Created:</strong>{" "}
                {new Date(announcement.createdAt).toLocaleString()}
              </span>

              {announcement.createdBy?.fullName ? (
                <span>
                  <strong>By:</strong> {announcement.createdBy.fullName}
                </span>
              ) : null}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AnnouncementsPage;