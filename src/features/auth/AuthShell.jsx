import { Link } from "react-router-dom";

const AuthShell = ({
  title,
 subtitle,
  footerText,
  footerLinkText,
  footerLinkTo,
  children,
}) => {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #e2e8f0 0%, #f8fafc 40%, #dbeafe 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1280px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
          gap: "28px",
          alignItems: "stretch",
        }}
      >
        {/* Left Section */}
        <div
          style={{
            background:
              "linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #2563eb 100%)",
            color: "#ffffff",
            borderRadius: "32px",
            padding: "42px",
            boxShadow: "0 20px 50px rgba(15, 23, 42, 0.18)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minHeight: "640px", // يثبت حجم الكارت الأزرق
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              gap: "24px",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "12px 24px",
                borderRadius: "999px",
                backgroundColor: "rgba(255,255,255,0.14)",
                fontWeight: "700",
                fontSize: "18px",
              }}
            >
              Campus Bus Tracker
            </div>

            <p
              style={{
                margin: 0,
                color: "#dbeafe",
                fontSize: "22px",
                lineHeight: "1.9",
                maxWidth: "520px",
              }}
            >
              Sign in / register to manage announcements, routes, stops,
              schedules, favorites, planning, and role-based access through one
              organized system.
            </p>

            <div
              style={{
                width: "100%",
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(140px, 1fr))",
                gap: "18px",
                marginTop: "10px",
              }}
            >
              {[
                /*
                "Role-Based Access",
                "Trip Planning",
                "Favorite Stops",
                "Operation Logs",
                */
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    backgroundColor: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "20px",
                    padding: "24px 18px",
                    color: "#ffffff",
                    fontWeight: "700",
                    lineHeight: "1.6",
                    textAlign: "center",
                    fontSize: "18px",
                    minHeight: "92px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxSizing: "border-box",
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "32px",
            padding: "42px",
            boxShadow: "0 20px 50px rgba(15, 23, 42, 0.12)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minHeight: "640px", 
            boxSizing: "border-box",
          }}
        >
          <div style={{ maxWidth: "560px", width: "100%", margin: "0 auto" }}>
            <h2
              style={{
                marginTop: 0,
                marginBottom: "14px",
                fontSize: "54px",
                color: "#0f172a",
                textAlign: "center",
                lineHeight: "1.2",
              }}
            >
              {title}
            </h2>

            <p
              style={{
                marginTop: 0,
                marginBottom: "34px",
                color: "#475569",
                lineHeight: "1.9",
                fontSize: "16px",
                textAlign: "center",
              }}
            >
              {subtitle}
            </p>

            {children}

            <p
              style={{
                marginTop: "26px",
                marginBottom: 0,
                color: "#475569",
                textAlign: "center",
                lineHeight: "1.8",
                fontSize: "16px",
              }}
            >
              {footerText}{" "}
              <Link
                to={footerLinkTo}
                style={{
                  color: "#2563eb",
                  textDecoration: "none",
                  fontWeight: "700",
                }}
              >
                {footerLinkText}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthShell;