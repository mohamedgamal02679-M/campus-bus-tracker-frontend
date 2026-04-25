import { useEffect, useState } from "react";
import { getMyFavoritesRequest, removeFavoriteRequest } from "./favoritesService";

const cardStyle = {
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  padding: "20px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
  marginBottom: "16px",
};

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [pageMessage, setPageMessage] = useState("");

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const result = await getMyFavoritesRequest();
      setFavorites(result);
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
          "Failed to load favorites. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemove = async (favoriteId) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this stop from favorites?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setPageMessage("");
      setErrorMessage("");

      await removeFavoriteRequest(favoriteId);

      setFavorites((prev) =>
        prev.filter((favorite) => favorite._id !== favoriteId)
      );

      setPageMessage("Favorite removed successfully.");
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
          "Failed to remove favorite. Please try again."
      );
    }
  };

  if (loading) {
    return (
      <div style={cardStyle}>
        <h2 style={{ marginTop: 0 }}>Favorites</h2>
        <p>Loading favorites...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={cardStyle}>
        <h2 style={{ marginTop: 0, color: "#0f172a" }}>My Favorite Stops</h2>
        <p style={{ color: "#475569", marginBottom: 0 }}>
          Quickly access your saved bus stops.
        </p>
      </div>

      {pageMessage ? (
        <div style={cardStyle}>
          <p style={{ margin: 0, color: "#16a34a" }}>{pageMessage}</p>
        </div>
      ) : null}

      {errorMessage ? (
        <div style={cardStyle}>
          <p style={{ margin: 0, color: "#dc2626" }}>{errorMessage}</p>
        </div>
      ) : null}

      {favorites.length === 0 ? (
        <div style={cardStyle}>
          <p style={{ margin: 0 }}>You have no favorite stops yet.</p>
        </div>
      ) : (
        favorites.map((favorite) => (
          <div key={favorite._id} style={cardStyle}>
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
                  {favorite.stop?.name || "Unknown Stop"}
                </h3>

                {favorite.stop?.code ? (
                  <p style={{ margin: 0, color: "#475569", lineHeight: "1.8" }}>
                    <strong>Stop Code:</strong> {favorite.stop.code}
                  </p>
                ) : null}

                {favorite.route?.name ? (
                  <p style={{ margin: 0, color: "#475569", lineHeight: "1.8" }}>
                    <strong>Route:</strong> {favorite.route.name}
                    {favorite.route?.code ? ` (${favorite.route.code})` : ""}
                  </p>
                ) : null}

                {favorite.stop?.locationName ? (
                  <p style={{ margin: 0, color: "#475569", lineHeight: "1.8" }}>
                    <strong>Location:</strong> {favorite.stop.locationName}
                  </p>
                ) : null}

                {favorite.stop?.address ? (
                  <p style={{ margin: 0, color: "#475569", lineHeight: "1.8" }}>
                    <strong>Address:</strong> {favorite.stop.address}
                  </p>
                ) : null}

                {favorite.notes ? (
                  <p
                    style={{
                      marginTop: "12px",
                      marginBottom: 0,
                      color: "#475569",
                      lineHeight: "1.8",
                    }}
                  >
                    <strong>Notes:</strong> {favorite.notes}
                  </p>
                ) : null}
              </div>

              <button
                onClick={() => handleRemove(favorite._id)}
                style={{
                  padding: "10px 14px",
                  border: "none",
                  borderRadius: "10px",
                  backgroundColor: "#dc2626",
                  color: "#ffffff",
                  cursor: "pointer",
                }}
              >
                Remove
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
              {favorite.createdAt ? (
                <span>
                  <strong>Added:</strong>{" "}
                  {new Date(favorite.createdAt).toLocaleString()}
                </span>
              ) : null}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default FavoritesPage;