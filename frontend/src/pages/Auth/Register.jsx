import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/home", { replace: true });
    }
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/register",
        formData,
      );

      // Store user data with ID immediately after registration
      if (response.data.id) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: response.data.id,
            name: formData.name,
            email: formData.email,
            role: "customer",
          }),
        );
      }

      alert("Registration Successful!");
      navigate("/login", { replace: true });
    } catch (err) {
      const apiMessage = err.response?.data?.message;
      setError(apiMessage || "Registration failed. Please try again later.");
    }
  };

  return (
    <div className="auth-container">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5 col-sm-8">
            <div className="card auth-card p-4">
              <h2 className="text-center auth-title">Create Account</h2>
              {error && (
                <div className="alert alert-danger p-2 small text-center">
                  {error}
                </div>
              )}
              <form onSubmit={handleRegister}>
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="John Doe"
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="name@example.com"
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Minimum 8 characters"
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                </div>
                <button type="submit" className="auth-btn w-100 mt-2">
                  Sign Up
                </button>
              </form>

              <p className="mt-4 text-center mb-0">
                Already have an account?{" "}
                <Link to="/login" replace className="auth-link">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
