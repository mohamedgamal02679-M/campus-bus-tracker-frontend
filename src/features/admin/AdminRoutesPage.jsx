import { useEffect, useMemo, useState } from "react";
import {
  createRouteRequest,
  deleteRouteRequest,
  getAllRoutesRequest,
  updateRouteRequest,
} from "../routes/routesService";

const initialFormData = {
  name: "",
  code: "",
  startLocationName: "",
  endLocationName: "",
  description: "",
  estimatedDurationMinutes: 15,
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

const statusBadgeStyle = (isActive) => ({
  backgroundColor: isActive ? "#16a34a" : "#64748b",
  color: "#ffffff",
  padding: "6px 10px",
  borderRadius: "999px",
  fontSize: "14px",
  fontWeight: "bold",
});

const AdminRoutesPage = () => {
  const [routes, setRoutes] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [editingRouteId, setEditingRouteId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [pageMessage, setPageMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const isEditing = useMemo(() => Boolean(editingRouteId), [editingRouteId]);

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const result = await getAllRoutesRequest();
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

  useEffect(() => {
    fetchRoutes();
  }, []);

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingRouteId(null);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "estimatedDurationMinutes"
          ? value
          : value,
    }));
  };

  const handleEdit = (route) => {
    setPageMessage("");
    setErrorMessage("");
    setEditingRouteId(route._id);

    setFormData({
      name: route.name || "",
      code: route.code || "",
      startLocationName: route.startLocationName || "",
      endLocationName: route.endLocationName || "",
      description: route.description || "",
      estimatedDurationMinutes: route.estimatedDurationMinutes || 15,
      isActive: route.isActive !== undefined ? route.isActive : true,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (routeId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this route?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setPageMessage("");
      setErrorMessage("");

      await deleteRouteRequest(routeId);

      setRoutes((prev) => prev.filter((route) => route._id !== routeId));

      if (editingRouteId === routeId) {
        resetForm();
      }

      setPageMessage("Route deleted successfully.");
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
          "Failed to delete route. Please try again."
      );
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setPageMessage("");
      setErrorMessage("");

      const payload = {
        ...formData,
        estimatedDurationMinutes: Number(formData.estimatedDurationMinutes),
      };

      if (isEditing) {
        await updateRouteRequest(editingRouteId, payload);
        setPageMessage("Route updated successfully.");
      } else {
        await createRouteRequest(payload);
        setPageMessage("Route created successfully.");
      }

      resetForm();
      await fetchRoutes();
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
          "Failed to save route. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div style={cardStyle}>
        <h2 style={{ marginTop: 0, color: "#0f172a" }}>Admin Routes</h2>
        <p style={{ color: "#475569", marginBottom: 0 }}>
          Create, update, and delete routes from the admin panel.
        </p>
      </div>

      <div style={cardStyle}>
        <h3 style={{ marginTop: 0, color: "#0f172a" }}>
          {isEditing ? "Edit Route" : "Create New Route"}
        </h3>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "16px",
              marginBottom: "16px",
            }}
          >
            <div>
              <label style={labelStyle}>Route Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter route name"
                style={inputStyle}
                required
              />
            </div>

            <div>
              <label style={labelStyle}>Route Code</label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="Enter route code"
                style={inputStyle}
                required
              />
            </div>

            <div>
              <label style={labelStyle}>Start Location</label>
              <input
                type="text"
                name="startLocationName"
                value={formData.startLocationName}
                onChange={handleChange}
                placeholder="Enter start location"
                style={inputStyle}
                required
              />
            </div>

            <div>
              <label style={labelStyle}>End Location</label>
              <input
                type="text"
                name="endLocationName"
                value={formData.endLocationName}
                onChange={handleChange}
                placeholder="Enter end location"
                style={inputStyle}
                required
              />
            </div>

            <div>
              <label style={labelStyle}>Estimated Duration (Minutes)</label>
              <input
                type="number"
                name="estimatedDurationMinutes"
                value={formData.estimatedDurationMinutes}
                onChange={handleChange}
                min="1"
                style={inputStyle}
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={labelStyle}>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter route description"
              rows="4"
              style={{ ...inputStyle, resize: "vertical" }}
            />
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
              Active route
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
                ? "Update Route"
                : "Create Route"}
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
        <h3 style={{ marginTop: 0, color: "#0f172a" }}>All Routes</h3>
        <p style={{ color: "#475569", marginBottom: 0 }}>
          Manage all existing routes below.
        </p>
      </div>

      {loading ? (
        <div style={cardStyle}>
          <p style={{ margin: 0 }}>Loading routes...</p>
        </div>
      ) : routes.length === 0 ? (
        <div style={cardStyle}>
          <p style={{ margin: 0 }}>No routes found.</p>
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
                  <h3 style={{ margin: 0, color: "#0f172a" }}>{route.name}</h3>

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

            <div
              style={{
                marginTop: "16px",
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => handleEdit(route)}
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
                onClick={() => handleDelete(route._id)}
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

export default AdminRoutesPage;