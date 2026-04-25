import { useEffect, useState } from "react";
import { getAllStopsRequest } from "./stopsService";
import {
  addFavoriteRequest,
  getMyFavoritesRequest,
} from "../favorites/favoritesService";
import { getUser } from "../../core/auth/tokenStorage";

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

const StopsPage = () => {
  const user = getUser();

  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [addingFavoriteStopId, setAddingFavoriteStopId] = useState(null);
  const [favoriteStopIds, setFavoriteStopIds] = useState([]);
  const [stopFeedback, setStopFeedback] = useState({});

  const canAddToFavorites = user?.role === "rider";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const stopsResult = await getAllStopsRequest({
          isActive: true,
        });

        setStops(stopsResult);

        if (canAddToFavorites) {
          const favoritesResult = await getMyFavoritesRequest();
          const stopIds = favoritesResult
            .map((favorite) => favorite?.stop?._id)
            .filter(Boolean);

          setFavoriteStopIds(stopIds);
        }
      } catch (error) {
        setErrorMessage(
          error?.response?.data?.message ||
            "Failed to load stops. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [canAddToFavorites]);

  const handleAddToFavorites = async (stopId) => {
    try {
      setErrorMessage("");
      setAddingFavoriteStopId(stopId);

      setStopFeedback((prev) => ({
        ...prev,
        [stopId]: null,
      }));

      await addFavoriteRequest({
        stop: stopId,
      });

      setFavoriteStopIds((prev) =>
        prev.includes(stopId) ? prev : [...prev, stopId]
      );

      setStopFeedback((prev) => ({
        ...prev,
        [stopId]: {
          type: "success",
          message: "Added to favorites successfully.",
        },
      }));
    } catch (error) {
      setStopFeedback((prev) => ({
        ...prev,
        [stopId]: {
          type: "error",
          message:
            error?.response?.data?.message ||
            "This stop is already in favorites or could not be added.",
        },
      }));
    } finally {
      setAddingFavoriteStopId(null);
    }
  };

  const isStopFavorite = (stopId) => favoriteStopIds.includes(stopId);

  if (loading) {
    return (
      <div style={cardStyle}>
        <h2 style={{ marginTop: 0 }}>Stops</h2>
        <p>Loading stops...</p>
      </div>
    );
  }

  if (errorMessage && stops.length === 0) {
    return (
      <div style={cardStyle}>
        <h2 style={{ marginTop: 0 }}>Stops</h2>
        <p style={{ color: "#dc2626" }}>{errorMessage}</p>
      </div>
    );
  }

  return (
    <div>
      <div style={cardStyle}>
        <h2 style={{ marginTop: 0, color: "#0f172a" }}>Stops</h2>
        <p style={{ color: "#475569", marginBottom: 0 }}>
          Available bus stops in the system.
        </p>
      </div>

      {errorMessage ? (
        <div style={cardStyle}>
          <p style={{ margin: 0, color: "#dc2626" }}>{errorMessage}</p>
        </div>
      ) : null}

      {stops.length === 0 ? (
        <div style={cardStyle}>
          <p style={{ margin: 0 }}>No stops available right now.</p>
        </div>
      ) : (
        stops.map((stop) => {
          const feedback = stopFeedback[stop._id];
          const alreadyFavorite = isStopFavorite(stop._id);
          const isAdding = addingFavoriteStopId === stop._id;

          return (
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
                    <p
                      style={{
                        margin: 0,
                        color: "#475569",
                        lineHeight: "1.8",
                      }}
                    >
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

                {stop.createdAt ? (
                  <span>
                    <strong>Created:</strong>{" "}
                    {new Date(stop.createdAt).toLocaleString()}
                  </span>
                ) : null}
              </div>

              {canAddToFavorites ? (
                <div
                  style={{
                    marginTop: "16px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: "10px",
                  }}
                >
                  <button
                    onClick={() => handleAddToFavorites(stop._id)}
                    disabled={isAdding || alreadyFavorite}
                    style={{
                      padding: "10px 14px",
                      border: "none",
                      borderRadius: "10px",
                      backgroundColor: alreadyFavorite ? "#16a34a" : "#2563eb",
                      color: "#ffffff",
                      cursor: isAdding || alreadyFavorite ? "not-allowed" : "pointer",
                      opacity: isAdding || alreadyFavorite ? 0.85 : 1,
                    }}
                  >
                    {isAdding
                      ? "Adding..."
                      : alreadyFavorite
                      ? "Already in Favorites"
                      : "Add to Favorites"}
                  </button>

                  {feedback ? (
                    <p
                      style={{
                        margin: 0,
                        color:
                          feedback.type === "success" ? "#16a34a" : "#dc2626",
                        fontWeight: "500",
                      }}
                    >
                      {feedback.message}
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>
          );
        })
      )}
    </div>
  );
};

export default StopsPage;