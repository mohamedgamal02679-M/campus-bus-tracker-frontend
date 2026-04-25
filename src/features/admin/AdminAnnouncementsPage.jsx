import { useEffect, useMemo, useState } from "react";
import {
  createAdminAnnouncementRequest,
  deleteAdminAnnouncementRequest,
  getAdminAnnouncementsRequest,
  updateAdminAnnouncementRequest,
} from "./adminAnnouncementsService";

const initialFormData = {
  title: "",
  message: "",
  priority: "medium",
  scope: "general",
  isActive: true,
};

const cardStyle = {
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  padding: "20px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
  marginBottom: "16px",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  boxSizing: "border-box",
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  color: "#0f172a",
  fontWeight: "600",
};

const badgeColors = {
  low: "#16a34a",
  medium: "#f59e0b",
  high: "#dc2626",
};

const AdminAnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [editingAnnouncementId, setEditingAnnouncementId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [pageMessage, setPageMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const isEditing = useMemo(
    () => Boolean(editingAnnouncementId),
    [editingAnnouncementId]
  );

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const result = await getAdminAnnouncementsRequest();
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

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingAnnouncementId(null);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEdit = (announcement) => {
    setPageMessage("");
    setErrorMessage("");
    setEditingAnnouncementId(announcement._id);

    setFormData({
      title: announcement.title || "",
      message: announcement.message || "",
      priority: announcement.priority || "medium",
      scope: announcement.scope || "general",
      isActive:
        announcement.isActive !== undefined ? announcement.isActive : true,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (announcementId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this announcement?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setPageMessage("");
      setErrorMessage("");

      await deleteAdminAnnouncementRequest(announcementId);

      setAnnouncements((prev) =>
        prev.filter((announcement) => announcement._id !== announcementId)
      );

      if (editingAnnouncementId === announcementId) {
        resetForm();
      }

      setPageMessage("Announcement deleted successfully.");
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
          "Failed to delete announcement. Please try again."
      );
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setPageMessage("");
      setErrorMessage("");

      if (isEditing) {
        await updateAdminAnnouncementRequest(editingAnnouncementId, formData);
        setPageMessage("Announcement updated successfully.");
      } else {
        await createAdminAnnouncementRequest(formData);
        setPageMessage("Announcement created successfully.");
      }

      resetForm();
      await fetchAnnouncements();
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
          "Failed to save announcement. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div style={cardStyle}>
        <h2 style={{ marginTop: 0, color: "#0f172a" }}>
          Admin Announcements
        </h2>
        <p style={{ color: "#475569", marginBottom: 0 }}>
          Create, update, and delete announcements from the admin panel.
        </p>
      </div>

      <div style={cardStyle}>
        <h3 style={{ marginTop: 0, color: "#0f172a" }}>
          {isEditing ? "Edit Announcement" : "Create New Announcement"}
        </h3>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label style={labelStyle}>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter announcement title"
              style={inputStyle}
              required
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={labelStyle}>Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Enter announcement message"
              rows="5"
              style={{ ...inputStyle, resize: "vertical" }}
              required
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "16px",
              marginBottom: "16px",
            }}
          >
            <div>
              <label style={labelStyle}>Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Scope</label>
              <select
                name="scope"
                value={formData.scope}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="general">General</option>
                <option value="route">Route</option>
                <option value="stop">Stop</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                color: "#0f172a",
                fontWeight: "600",
              }}
            >
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />
              Active announcement
            </label>
          </div>

          {pageMessage ? (
            <p style={{ color: "#16a34a", marginBottom: "16px" }}>
              {pageMessage}
            </p>
          ) : null}

          {errorMessage ? (
            <p style={{ color: "#dc2626", marginBottom: "16px" }}>
              {errorMessage}
            </p>
          ) : null}

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: "12px 16px",
                border: "none",
                borderRadius: "10px",
                backgroundColor: "#0f172a",
                color: "#ffffff",
                cursor: "pointer",
              }}
            >
              {submitting
                ? isEditing
                  ? "Updating..."
                  : "Creating..."
                : isEditing
                ? "Update Announcement"
                : "Create Announcement"}
            </button>

            {isEditing ? (
              <button
                type="button"
                onClick={resetForm}
                style={{
                  padding: "12px 16px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "10px",
                  backgroundColor: "#ffffff",
                  color: "#0f172a",
                  cursor: "pointer",
                }}
              >
                Cancel Edit
              </button>
            ) : null}
          </div>
        </form>
      </div>

      <div style={cardStyle}>
        <h3 style={{ marginTop: 0, color: "#0f172a" }}>
          All Announcements
        </h3>
        <p style={{ color: "#475569", marginBottom: 0 }}>
          Manage all existing announcements below.
        </p>
      </div>

      {loading ? (
        <div style={cardStyle}>
          <p style={{ margin: 0 }}>Loading announcements...</p>
        </div>
      ) : announcements.length === 0 ? (
        <div style={cardStyle}>
          <p style={{ margin: 0 }}>No announcements found.</p>
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
                <strong>Status:</strong>{" "}
                {announcement.isActive ? "Active" : "Inactive"}
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

            <div
              style={{
                marginTop: "16px",
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => handleEdit(announcement)}
                style={{
                  padding: "10px 14px",
                  border: "none",
                  borderRadius: "10px",
                  backgroundColor: "#2563eb",
                  color: "#ffffff",
                  cursor: "pointer",
                }}
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(announcement._id)}
                style={{
                  padding: "10px 14px",
                  border: "none",
                  borderRadius: "10px",
                  backgroundColor: "#dc2626",
                  color: "#ffffff",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminAnnouncementsPage;