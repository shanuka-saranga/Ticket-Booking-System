import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");
  const navigate = useNavigate();

  const getPostLoginPath = (role) =>
    String(role || "")
      .trim()
      .toLowerCase() === "admin"
      ? "/admin-dashboard"
      : "/home";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const storedRole = localStorage.getItem("role");
      navigate(getPostLoginPath(storedRole), { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        { email, password },
      );
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem(
          "role",
          String(response.data.role || "customer")
            .trim()
            .toLowerCase(),
        );
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: response.data.id,
            name: response.data.name,
            role: response.data.role,
            email,
          }),
        );
        navigate(getPostLoginPath(response.data.role), { replace: true });
      }
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetError("");
    setResetSuccess("");

    if (newPassword.length < 6) {
      setResetError("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setResetError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/reset-password",
        {
          email: resetEmail,
          newPassword,
        },
      );

      setResetSuccess(response.data.message || "Password reset successful.");
      setResetEmail("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setResetError(
        err?.response?.data?.message ||
          "Unable to reset password. Please try again.",
      );
    }
  };

  return (
    <div className="auth-container">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-4 col-sm-8">
            <div className="card auth-card p-4">
              <h2 className="text-center auth-title">Sign In</h2>
              {error && (
                <div className="alert alert-danger p-2 small text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="auth-btn w-100 mt-2">
                  Login
                </button>
              </form>

              <div className="text-center mt-3">
                <button
                  type="button"
                  className="btn btn-link p-0 forgot-link"
                  onClick={() => {
                    setShowReset((prev) => !prev);
                    setResetError("");
                    setResetSuccess("");
                  }}
                >
                  {showReset ? "Hide Reset Password" : "Forgot Password?"}
                </button>
              </div>

              {showReset && (
                <form
                  className="reset-form mt-3"
                  onSubmit={handleResetPassword}
                >
                  <h6 className="mb-3">Reset Password</h6>

                  {resetError && (
                    <div className="alert alert-danger p-2 small text-center">
                      {resetError}
                    </div>
                  )}

                  {resetSuccess && (
                    <div className="alert alert-success p-2 small text-center">
                      {resetSuccess}
                    </div>
                  )}

                  <div className="mb-2">
                    <label className="form-label">Account Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-2">
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Confirm New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>

                  <button type="submit" className="auth-btn w-100">
                    Reset Password
                  </button>
                </form>
              )}

              <p className="mt-4 text-center mb-0">
                New here?{" "}
                <Link to="/register" replace className="auth-link">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
