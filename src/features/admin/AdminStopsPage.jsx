import { useEffect, useMemo, useState } from "react";
import {
  createStopRequest,
  deleteStopRequest,
  getAllStopsRequest,
  updateStopRequest,
} from "../stops/stopsService";
import { getAllRoutesRequest } from "../routes/routesService";

const initialFormData = {
  name: "",
  code: "",
  route: "",
  order: 1,
  locationName: "",
  address: "",
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

const AdminStopsPage = () => {
  const [stops, setStops] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [editingStopId, setEditingStopId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [pageMessage, setPageMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const isEditing = useMemo(() => Boolean(editingStopId), [editingStopId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const [stopsResult, routesResult] = await Promise.all([
        getAllStopsRequest(),
        getAllRoutesRequest(),
      ]);

      setStops(stopsResult);
      setRoutes(routesResult);
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
          "Failed to load stops data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingStopId(null);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "order"
          ? value
          : value,
    }));
  };

  const handleEdit = (stop) => {
    setPageMessage("");
    setErrorMessage("");
    setEditingStopId(stop._id);

    setFormData({
      name: stop.name || "",
      code: stop.code || "",
      route: stop.route?._id || "",
      order: stop.order || 1,
      locationName: stop.locationName || "",
      address: stop.address || "",
      isActive: stop.isActive !== undefined ? stop.isActive : true,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (stopId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this stop?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setPageMessage("");
      setErrorMessage("");

      await deleteStopRequest(stopId);

      setStops((prev) => prev.filter((stop) => stop._id !== stopId));

      if (editingStopId === stopId) {
        resetForm();
      }

      setPageMessage("Stop deleted successfully.");
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
          "Failed to delete stop. Please try again."
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
        order: Number(formData.order),
      };

      if (isEditing) {
        await updateStopRequest(editingStopId, payload);
        setPageMessage("Stop updated successfully.");
      } else {
        await createStopRequest(payload);
        setPageMessage("Stop created successfully.");
      }

      resetForm();
      await fetchData();
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
          "Failed to save stop. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div style={cardStyle}>
        <h2 style={{ marginTop: 0, color: "#0f172a" }}>Admin Stops</h2>
        <p style={{ color: "#475569", marginBottom: 0 }}>
          Create, update, and delete stops from the admin panel.
        </p>
      </div>

      <div style={cardStyle}>
        <h3 style={{ marginTop: 0, color: "#0f172a" }}>
          {isEditing ? "Edit Stop" : "Create New Stop"}
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
              <label style={labelStyle}>Stop Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter stop name"
                style={inputStyle}
                required
              />
            </div>

            <div>
              <label style={labelStyle}>Stop Code (Optional)</label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="Enter stop code"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Route</label>
              <select
                name="route"
                value={formData.route}
                onChange={handleChange}
                style={inputStyle}
                required
              >
                <option value="">Select route</option>
                {routes.map((route) => (
                  <option key={route._id} value={route._id}>
                    {route.name} ({route.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Order</label>
              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleChange}
                min="1"
                style={inputStyle}
                required
              />
            </div>

            <div>
              <label style={labelStyle}>Location Name</label>
              <input
                type="text"
                name="locationName"
                value={formData.locationName}
                onChange={handleChange}
                placeholder="Enter location name"
                style={inputStyle}
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={labelStyle}>Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter full address"
              rows="4"
              style={{ ...inputStyle, resize: "vertical" }}
              required
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
              Active stop
            </label>
          </div>

          <p style={{ color: "#64748b", marginTop: 0 }}>
            Latitude and longitude are handled automatically by the backend
            using Nominatim.
          </p>

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
                ? "Update Stop"
                : "Create Stop"}
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
        <h3 style={{ marginTop: 0, color: "#0f172a" }}>All Stops</h3>
        <p style={{ color: "#475569", marginBottom: 0 }}>
          Manage all existing stops below.
        </p>
      </div>

      {loading ? (
        <div style={cardStyle}>
          <p style={{ margin: 0 }}>Loading stops...</p>
        </div>
      ) : stops.length === 0 ? (
        <div style={cardStyle}>
          <p style={{ margin: 0 }}>No stops found.</p>
        </div>
      ) : (
        stops.map((stop) => (
          <div key={stop._id} style={cardStyle}>
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
                  <h3 style={{ margin: 0, color: "#0f172a" }}>{stop.name}</h3>

                  {stop.code ? (
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
                      {stop.code}
                    </span>
                  ) : null}
                </div>

                <p style={{ margin: 0, color: "#475569", lineHeight: "1.8" }}>
                  <strong>Location:</strong> {stop.locationName}
                </p>

                <p style={{ margin: 0, color: "#475569", lineHeight: "1.8" }}>
                  <strong>Address:</strong> {stop.address}
                </p>

                <p style={{ margin: 0, color: "#475569", lineHeight: "1.8" }}>
                  <strong>Order:</strong> {stop.order}
                </p>

                {stop.route?.name ? (
                  <p style={{ margin: 0, color: "#475569", lineHeight: "1.8" }}>
                    <strong>Route:</strong> {stop.route.name} ({stop.route.code})
                  </p>
                ) : null}

                {stop.displayAddress ? (
                  <p
                    style={{
                      marginTop: "12px",
                      marginBottom: 0,
                      color: "#475569",
                      lineHeight: "1.8",
                    }}
                  >
                    <strong>Display Address:</strong> {stop.displayAddress}
                  </p>
                ) : null}
              </div>

              <span style={statusBadgeStyle(stop.isActive)}>
                {stop.isActive ? "Active" : "Inactive"}
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
                <strong>Latitude:</strong> {stop.latitude}
              </span>

              <span>
                <strong>Longitude:</strong> {stop.longitude}
              </span>

              {stop.createdBy?.fullName ? (
                <span>
                  <strong>Created by:</strong> {stop.createdBy.fullName}
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
                onClick={() => handleEdit(stop)}
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
                onClick={() => handleDelete(stop._id)}
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

export default AdminStopsPage;