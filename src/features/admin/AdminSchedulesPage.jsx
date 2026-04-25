import { useEffect, useMemo, useState } from "react";
import {
  createScheduleRequest,
  deleteScheduleRequest,
  getAllSchedulesRequest,
  updateScheduleRequest,
} from "../schedules/schedulesService";
import { getAllRoutesRequest } from "../routes/routesService";
import { getAllStopsRequest } from "../stops/stopsService";

const initialFormData = {
  route: "",
  stop: "",
  dayOfWeek: "sunday",
  departureTime: "",
  arrivalTime: "",
  direction: "outbound",
  scheduleType: "regular",
  seasonLabel: "default",
  effectiveFrom: "",
  effectiveTo: "",
  notes: "",
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

const AdminSchedulesPage = () => {
  const [schedules, setSchedules] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [stops, setStops] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [editingScheduleId, setEditingScheduleId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [pageMessage, setPageMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const isEditing = useMemo(
    () => Boolean(editingScheduleId),
    [editingScheduleId]
  );

  const filteredStops = useMemo(() => {
    if (!formData.route) {
      return stops;
    }

    return stops.filter((stop) => stop.route?._id === formData.route);
  }, [stops, formData.route]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const [schedulesResult, routesResult, stopsResult] = await Promise.all([
        getAllSchedulesRequest(),
        getAllRoutesRequest(),
        getAllStopsRequest(),
      ]);

      setSchedules(schedulesResult);
      setRoutes(routesResult);
      setStops(stopsResult);
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
          "Failed to load schedules data. Please try again."
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
    setEditingScheduleId(null);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((prev) => {
      const updatedValue = type === "checkbox" ? checked : value;

      if (name === "route") {
        return {
          ...prev,
          route: updatedValue,
          stop: "",
        };
      }

      return {
        ...prev,
        [name]: updatedValue,
      };
    });
  };

  const handleEdit = (schedule) => {
    setPageMessage("");
    setErrorMessage("");
    setEditingScheduleId(schedule._id);

    setFormData({
      route: schedule.route?._id || "",
      stop: schedule.stop?._id || "",
      dayOfWeek: schedule.dayOfWeek || "sunday",
      departureTime: schedule.departureTime || "",
      arrivalTime: schedule.arrivalTime || "",
      direction: schedule.direction || "outbound",
      scheduleType: schedule.scheduleType || "regular",
      seasonLabel: schedule.seasonLabel || "default",
      effectiveFrom: schedule.effectiveFrom
        ? new Date(schedule.effectiveFrom).toISOString().slice(0, 10)
        : "",
      effectiveTo: schedule.effectiveTo
        ? new Date(schedule.effectiveTo).toISOString().slice(0, 10)
        : "",
      notes: schedule.notes || "",
      isActive:
        schedule.isActive !== undefined ? schedule.isActive : true,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (scheduleId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this schedule?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setPageMessage("");
      setErrorMessage("");

      await deleteScheduleRequest(scheduleId);

      setSchedules((prev) =>
        prev.filter((schedule) => schedule._id !== scheduleId)
      );

      if (editingScheduleId === scheduleId) {
        resetForm();
      }

      setPageMessage("Schedule deleted successfully.");
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
          "Failed to delete schedule. Please try again."
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
        arrivalTime: formData.arrivalTime || "",
        seasonLabel: formData.seasonLabel || "default",
        effectiveFrom: formData.effectiveFrom || null,
        effectiveTo: formData.effectiveTo || null,
      };

      if (isEditing) {
        await updateScheduleRequest(editingScheduleId, payload);
        setPageMessage("Schedule updated successfully.");
      } else {
        await createScheduleRequest(payload);
        setPageMessage("Schedule created successfully.");
      }

      resetForm();
      await fetchData();
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
          "Failed to save schedule. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div style={cardStyle}>
        <h2 style={{ marginTop: 0, color: "#0f172a" }}>Admin Schedules</h2>
        <p style={{ color: "#475569", marginBottom: 0 }}>
          Create, update, and delete schedules from the admin panel.
        </p>
      </div>

      <div style={cardStyle}>
        <h3 style={{ marginTop: 0, color: "#0f172a" }}>
          {isEditing ? "Edit Schedule" : "Create New Schedule"}
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
              <label style={labelStyle}>Stop</label>
              <select
                name="stop"
                value={formData.stop}
                onChange={handleChange}
                style={inputStyle}
                required
              >
                <option value="">Select stop</option>
                {filteredStops.map((stop) => (
                  <option key={stop._id} value={stop._id}>
                    {stop.name} - Order {stop.order}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Day Of Week</label>
              <select
                name="dayOfWeek"
                value={formData.dayOfWeek}
                onChange={handleChange}
                style={inputStyle}
                required
              >
                <option value="sunday">Sunday</option>
                <option value="monday">Monday</option>
                <option value="tuesday">Tuesday</option>
                <option value="wednesday">Wednesday</option>
                <option value="thursday">Thursday</option>
                <option value="friday">Friday</option>
                <option value="saturday">Saturday</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Departure Time</label>
              <input
                type="time"
                name="departureTime"
                value={formData.departureTime}
                onChange={handleChange}
                style={inputStyle}
                required
              />
            </div>

            <div>
              <label style={labelStyle}>Arrival Time</label>
              <input
                type="time"
                name="arrivalTime"
                value={formData.arrivalTime}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Direction</label>
              <select
                name="direction"
                value={formData.direction}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="outbound">Outbound</option>
                <option value="return">Return</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Schedule Type</label>
              <select
                name="scheduleType"
                value={formData.scheduleType}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="regular">Regular</option>
                <option value="seasonal">Seasonal</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Season Label</label>
              <input
                type="text"
                name="seasonLabel"
                value={formData.seasonLabel}
                onChange={handleChange}
                placeholder="default"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Effective From</label>
              <input
                type="date"
                name="effectiveFrom"
                value={formData.effectiveFrom}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Effective To</label>
              <input
                type="date"
                name="effectiveTo"
                value={formData.effectiveTo}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={labelStyle}>Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Enter notes"
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
              Active schedule
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
                ? "Update Schedule"
                : "Create Schedule"}
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
        <h3 style={{ marginTop: 0, color: "#0f172a" }}>All Schedules</h3>
        <p style={{ color: "#475569", marginBottom: 0 }}>
          Manage all existing schedules below.
        </p>
      </div>

      {loading ? (
        <div style={cardStyle}>
          <p style={{ margin: 0 }}>Loading schedules...</p>
        </div>
      ) : schedules.length === 0 ? (
        <div style={cardStyle}>
          <p style={{ margin: 0 }}>No schedules found.</p>
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

            <div
              style={{
                marginTop: "16px",
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => handleEdit(schedule)}
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
                onClick={() => handleDelete(schedule._id)}
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

export default AdminSchedulesPage;