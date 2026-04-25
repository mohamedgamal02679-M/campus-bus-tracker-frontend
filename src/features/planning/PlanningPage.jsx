import { useEffect, useMemo, useState } from "react";
import { getAllStopsRequest } from "../stops/stopsService";
import { planTripRequest } from "./planningService";

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

const formatDay = (dayOfWeek = "") => {
  if (!dayOfWeek) return "";
  return dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);
};

const PlanningPage = () => {
  const [stops, setStops] = useState([]);
  const [formData, setFormData] = useState({
    fromStop: "",
    toStop: "",
    dayOfWeek: "sunday",
    currentTime: "",
    direction: "",
    scheduleType: "regular",
    seasonLabel: "default",
  });
  const [result, setResult] = useState(null);
  const [loadingStops, setLoadingStops] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchStops = async () => {
      try {
        setLoadingStops(true);
        setErrorMessage("");

        const result = await getAllStopsRequest({
          isActive: true,
        });

        setStops(result);
      } catch (error) {
        setErrorMessage(
          error?.response?.data?.message ||
            "Failed to load stops. Please try again."
        );
      } finally {
        setLoadingStops(false);
      }
    };

    fetchStops();
  }, []);

  const selectedFromStop = useMemo(() => {
    return stops.find((stop) => stop._id === formData.fromStop) || null;
  }, [stops, formData.fromStop]);

  const filteredToStops = useMemo(() => {
    if (!selectedFromStop?.route?._id) {
      return [];
    }

    return stops.filter(
      (stop) =>
        stop._id !== formData.fromStop &&
        stop.route?._id === selectedFromStop.route?._id
    );
  }, [stops, selectedFromStop, formData.fromStop]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => {
      if (name === "fromStop") {
        return {
          ...prev,
          fromStop: value,
          toStop: "",
        };
      }

      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setErrorMessage("");
      setResult(null);

      const payload = {
        fromStop: formData.fromStop,
        toStop: formData.toStop,
        dayOfWeek: formData.dayOfWeek,
        currentTime: formData.currentTime || undefined,
        direction: formData.direction || undefined,
        scheduleType: formData.scheduleType || "regular",
        seasonLabel: formData.seasonLabel || "default",
      };

      const response = await planTripRequest(payload);
      setResult(response);
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
          "Failed to plan trip. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingStops) {
    return (
      <div style={cardStyle}>
        <h2 style={{ marginTop: 0 }}>Plan Trip</h2>
        <p>Loading stops...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={cardStyle}>
        <h2 style={{ marginTop: 0, color: "#0f172a" }}>Plan Trip</h2>
        <p style={{ color: "#475569", marginBottom: 0 }}>
          Choose your starting stop and destination stop to find the best direct
          trip.
        </p>
      </div>

      <div style={cardStyle}>
        <h3 style={{ marginTop: 0, color: "#0f172a" }}>Trip Search</h3>

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
              <label style={labelStyle}>From Stop</label>
              <select
                name="fromStop"
                value={formData.fromStop}
                onChange={handleChange}
                style={inputStyle}
                required
              >
                <option value="">Select starting stop</option>
                {stops.map((stop) => (
                  <option key={stop._id} value={stop._id}>
                    {stop.name}
                    {stop.route?.name ? ` - ${stop.route.name}` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>To Stop</label>
              <select
                name="toStop"
                value={formData.toStop}
                onChange={handleChange}
                style={inputStyle}
                required
                disabled={!formData.fromStop}
              >
                <option value="">Select destination stop</option>
                {filteredToStops.map((stop) => (
                  <option key={stop._id} value={stop._id}>
                    {stop.name}
                    {stop.order ? ` - Order ${stop.order}` : ""}
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
              <label style={labelStyle}>Current Time (Optional)</label>
              <input
                type="time"
                name="currentTime"
                value={formData.currentTime}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Direction (Optional)</label>
              <select
                name="direction"
                value={formData.direction}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="">Auto detect</option>
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
                style={inputStyle}
                placeholder="default"
              />
            </div>
          </div>

          {selectedFromStop?.route?.name ? (
            <p style={{ color: "#475569", marginTop: 0 }}>
              Selected route: <strong>{selectedFromStop.route.name}</strong>
              {selectedFromStop.route?.code
                ? ` (${selectedFromStop.route.code})`
                : ""}
            </p>
          ) : null}

          {errorMessage ? (
            <p style={{ color: "#dc2626", marginBottom: "16px" }}>
              {errorMessage}
            </p>
          ) : null}

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
            {submitting ? "Planning..." : "Plan Trip"}
          </button>
        </form>
      </div>

      {result ? (
        <>
          <div style={cardStyle}>
            <h3 style={{ marginTop: 0, color: "#0f172a" }}>Planning Result</h3>
            <p style={{ margin: 0, color: "#475569", lineHeight: "1.8" }}>
              <strong>Route:</strong> {result.route?.name}
              {result.route?.code ? ` (${result.route.code})` : ""}
            </p>
            <p style={{ margin: 0, color: "#475569", lineHeight: "1.8" }}>
              <strong>From:</strong> {result.fromStop?.name}
            </p>
            <p style={{ margin: 0, color: "#475569", lineHeight: "1.8" }}>
              <strong>To:</strong> {result.toStop?.name}
            </p>
            <p style={{ margin: 0, color: "#475569", lineHeight: "1.8" }}>
              <strong>Day:</strong> {formatDay(result.dayOfWeek)}
            </p>
            <p style={{ margin: 0, color: "#475569", lineHeight: "1.8" }}>
              <strong>Direction:</strong> {result.direction}
            </p>
            <p style={{ margin: 0, color: "#475569", lineHeight: "1.8" }}>
              <strong>Schedule Type:</strong> {result.scheduleType}
            </p>
            <p style={{ margin: 0, color: "#475569", lineHeight: "1.8" }}>
              <strong>Total Trips:</strong> {result.totalTrips}
            </p>
          </div>

          {result.trips?.length ? (
            result.trips.map((trip, index) => (
              <div key={`${trip.fromScheduleId}-${trip.toScheduleId}`} style={cardStyle}>
                <h3 style={{ marginTop: 0, color: "#0f172a" }}>
                  Trip {index + 1}
                </h3>

                <p style={{ margin: 0, color: "#475569", lineHeight: "1.8" }}>
                  <strong>Route:</strong> {trip.route?.name}
                  {trip.route?.code ? ` (${trip.route.code})` : ""}
                </p>

                <p style={{ margin: 0, color: "#475569", lineHeight: "1.8" }}>
                  <strong>From Stop:</strong> {trip.fromStop?.name}
                </p>

                <p style={{ margin: 0, color: "#475569", lineHeight: "1.8" }}>
                  <strong>To Stop:</strong> {trip.toStop?.name}
                </p>

                <p style={{ margin: 0, color: "#475569", lineHeight: "1.8" }}>
                  <strong>Departure:</strong> {trip.departureTime}
                </p>

                <p style={{ margin: 0, color: "#475569", lineHeight: "1.8" }}>
                  <strong>Arrival:</strong> {trip.arrivalTime}
                </p>

                <p style={{ margin: 0, color: "#475569", lineHeight: "1.8" }}>
                  <strong>Estimated Travel Minutes:</strong>{" "}
                  {trip.estimatedTravelMinutes ?? "N/A"}
                </p>
              </div>
            ))
          ) : (
            <div style={cardStyle}>
              <p style={{ margin: 0 }}>
                No matching direct trips were found for the selected criteria.
              </p>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
};

export default PlanningPage;