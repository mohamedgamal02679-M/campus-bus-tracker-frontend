import { useEffect, useState } from "react";
import {
  getAllOperationLogsRequest,
  getOperationLogByIdRequest,
} from "./operationLogsService";

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

const badgeStyle = (value) => {
  const normalized = String(value || "").toLowerCase();

  let backgroundColor = "#64748b";

  if (normalized === "success") {
    backgroundColor = "#16a34a";
  } else if (normalized === "failed") {
    backgroundColor = "#dc2626";
  } else if (normalized === "admin") {
    backgroundColor = "#2563eb";
  } else if (normalized === "rider") {
    backgroundColor = "#7c3aed";
  }

  return {
    backgroundColor,
    color: "#ffffff",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "14px",
    fontWeight: "bold",
    textTransform: "capitalize",
  };
};

const initialFilters = {
  actorRole: "",
  action: "",
  entityType: "",
  status: "",
};

const OperationLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [selectedLog, setSelectedLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchLogs = async (params = {}) => {
    try {
      setLoading(true);
      setErrorMessage("");

      const result = await getAllOperationLogsRequest(params);
      setLogs(result);
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
          "Failed to load operation logs. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleFilterChange = (event) => {
    setFilters((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleApplyFilters = async (event) => {
    event.preventDefault();

    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value)
    );

    setSelectedLog(null);
    await fetchLogs(cleanFilters);
  };

  const handleResetFilters = async () => {
    setFilters(initialFilters);
    setSelectedLog(null);
    await fetchLogs();
  };

  const handleViewDetails = async (logId) => {
    try {
      setLoadingDetails(true);
      setErrorMessage("");

      const result = await getOperationLogByIdRequest(logId);
      setSelectedLog(result);
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
          "Failed to load log details. Please try again."
      );
    } finally {
      setLoadingDetails(false);
    }
  };

  return (
    <div>
      <div style={cardStyle}>
        <h2 style={{ marginTop: 0, color: "#0f172a" }}>Operation Logs</h2>
        <p style={{ color: "#475569", marginBottom: 0 }}>
          View and filter historical system operation logs.
        </p>
      </div>

      <div style={cardStyle}>
        <h3 style={{ marginTop: 0, color: "#0f172a" }}>Filters</h3>

        <form onSubmit={handleApplyFilters}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "16px",
              marginBottom: "16px",
            }}
          >
            <div>
              <label style={labelStyle}>Actor Role</label>
              <select
                name="actorRole"
                value={filters.actorRole}
                onChange={handleFilterChange}
                style={inputStyle}
              >
                <option value="">All</option>
                <option value="admin">Admin</option>
                <option value="rider">Rider</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Action</label>
              <input
                type="text"
                name="action"
                value={filters.action}
                onChange={handleFilterChange}
                placeholder="create / update / delete / login ..."
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Entity Type</label>
              <input
                type="text"
                name="entityType"
                value={filters.entityType}
                onChange={handleFilterChange}
                placeholder="route / stop / schedule / auth ..."
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Status</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                style={inputStyle}
              >
                <option value="">All</option>
                <option value="success">Success</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button
              type="submit"
              style={{
                padding: "12px 16px",
                border: "none",
                borderRadius: "10px",
                backgroundColor: "#0f172a",
                color: "#ffffff",
                cursor: "pointer",
              }}
            >
              Apply Filters
            </button>

            <button
              type="button"
              onClick={handleResetFilters}
              style={{
                padding: "12px 16px",
                border: "1px solid #cbd5e1",
                borderRadius: "10px",
                backgroundColor: "#ffffff",
                color: "#0f172a",
                cursor: "pointer",
              }}
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {errorMessage ? (
        <div style={cardStyle}>
          <p style={{ margin: 0, color: "#dc2626" }}>{errorMessage}</p>
        </div>
      ) : null}

      {selectedLog ? (
        <div style={cardStyle}>
          <h3 style={{ marginTop: 0, color: "#0f172a" }}>Selected Log Details</h3>

          <p style={{ margin: 0, color: "#475569", lineHeight: "1.8" }}>
            <strong>Actor:</strong>{" "}
            {selectedLog.actor?.fullName || "System / Unknown"}
          </p>

          <p style={{ margin: 0, color: "#475569", lineHeight: "1.8" }}>
            <strong>Email:</strong> {selectedLog.actor?.email || "N/A"}
          </p>

          <p style={{ margin: 0, color: "#475569", lineHeight: "1.8" }}>
            <strong>Actor Role:</strong> {selectedLog.actorRole || "N/A"}
          </p>

          <p style={{ margin: 0, color: "#475569", lineHeight: "1.8" }}>
            <strong>Action:</strong> {selectedLog.action}
          </p>

          <p style={{ margin: 0, color: "#475569", lineHeight: "1.8" }}>
            <strong>Entity Type:</strong> {selectedLog.entityType}
          </p>

          <p style={{ margin: 0, color: "#475569", lineHeight: "1.8" }}>
            <strong>Entity ID:</strong> {selectedLog.entityId || "N/A"}
          </p>

          <p style={{ margin: 0, color: "#475569", lineHeight: "1.8" }}>
            <strong>Status:</strong> {selectedLog.status}
          </p>

          <p style={{ margin: 0, color: "#475569", lineHeight: "1.8" }}>
            <strong>IP Address:</strong> {selectedLog.ipAddress || "N/A"}
          </p>

          <p style={{ margin: 0, color: "#475569", lineHeight: "1.8" }}>
            <strong>User Agent:</strong> {selectedLog.userAgent || "N/A"}
          </p>

          <p
            style={{
              marginTop: "12px",
              marginBottom: 0,
              color: "#475569",
              lineHeight: "1.8",
            }}
          >
            <strong>Details:</strong> {selectedLog.details || "No details"}
          </p>
        </div>
      ) : null}

      <div style={cardStyle}>
        <h3 style={{ marginTop: 0, color: "#0f172a" }}>All Logs</h3>
        <p style={{ color: "#475569", marginBottom: 0 }}>
          Latest logs appear first.
        </p>
      </div>

      {loading ? (
        <div style={cardStyle}>
          <p style={{ margin: 0 }}>Loading operation logs...</p>
        </div>
      ) : logs.length === 0 ? (
        <div style={cardStyle}>
          <p style={{ margin: 0 }}>No operation logs found.</p>
        </div>
      ) : (
        logs.map((log) => (
          <div key={log._id} style={cardStyle}>
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
                    gap: "10px",
                    flexWrap: "wrap",
                    marginBottom: "10px",
                  }}
                >
                  <span style={badgeStyle(log.status)}>{log.status}</span>
                  {log.actorRole ? (
                    <span style={badgeStyle(log.actorRole)}>{log.actorRole}</span>
                  ) : null}
                </div>

                <h3 style={{ marginTop: 0, marginBottom: "8px", color: "#0f172a" }}>
                  {log.action} - {log.entityType}
                </h3>

                <p style={{ margin: 0, color: "#475569", lineHeight: "1.8" }}>
                  <strong>Actor:</strong>{" "}
                  {log.actor?.fullName || "System / Unknown"}
                </p>

                <p style={{ margin: 0, color: "#475569", lineHeight: "1.8" }}>
                  <strong>Details:</strong> {log.details || "No details"}
                </p>
              </div>

              <button
                onClick={() => handleViewDetails(log._id)}
                disabled={loadingDetails}
                style={{
                  padding: "10px 14px",
                  border: "none",
                  borderRadius: "10px",
                  backgroundColor: "#2563eb",
                  color: "#ffffff",
                  cursor: "pointer",
                }}
              >
                {loadingDetails ? "Loading..." : "View Details"}
              </button>
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
                <strong>Entity ID:</strong> {log.entityId || "N/A"}
              </span>

              {log.createdAt ? (
                <span>
                  <strong>Created:</strong>{" "}
                  {new Date(log.createdAt).toLocaleString()}
                </span>
              ) : null}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OperationLogsPage;