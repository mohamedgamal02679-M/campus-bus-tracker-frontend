import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginRequest } from "./authService";
import AuthShell from "./AuthShell";

const inputStyle = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "14px",
  border: "1px solid #cbd5e1",
  boxSizing: "border-box",
  fontSize: "15px",
  outline: "none",
  backgroundColor: "#ffffff",
  color: "#0f172a",
  caretColor: "#0f172a",
  WebkitTextFillColor: "#0f172a",
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  color: "#0f172a",
  fontWeight: "600",
};

const LoginPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      await loginRequest(formData);
      navigate("/");
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Login"
      subtitle="Enter your account credentials to access the system dashboard and role-based services."
      footerText="Do not have an account?"
      footerLinkText="Register"
      footerLinkTo="/register"
    >
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "18px" }}>
          <label style={labelStyle}>Email</label>
          <input
  type="email"
  name="email"
  value={formData.email}
  onChange={handleChange}
  placeholder="Enter your email"
  style={inputStyle}
  autoComplete="email"
  required
/>
        </div>

        <div style={{ marginBottom: "18px" }}>
          <label style={labelStyle}>Password</label>
          <input
  type="password"
  name="password"
  value={formData.password}
  onChange={handleChange}
  placeholder="Enter your password"
  style={inputStyle}
  autoComplete="current-password"
  required
/>
        </div>

        {errorMessage ? (
          <div
            style={{
              marginBottom: "18px",
              padding: "12px 14px",
              borderRadius: "14px",
              backgroundColor: "#fef2f2",
              color: "#dc2626",
              border: "1px solid #fecaca",
              lineHeight: "1.7",
            }}
          >
            {errorMessage}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px 16px",
            border: "none",
            borderRadius: "14px",
            backgroundColor: "#0f172a",
            color: "#ffffff",
            fontWeight: "700",
            fontSize: "16px",
            cursor: "pointer",
            boxShadow: "0 10px 24px rgba(15, 23, 42, 0.16)",
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </AuthShell>
  );
};

export default LoginPage;