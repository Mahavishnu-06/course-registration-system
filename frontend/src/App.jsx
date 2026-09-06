import { useState } from "react";
import "./App.css";
import API_URL from "./api";
import StudentDashboard from "./StudentDashboard";
import AdminDashboard from "./AdminDashboard";
import AdminCourses from "./AdminCourses";
import AdminStudents from "./AdminStudents";
import AdminRegistrations from "./AdminRegistrations";
import Register from "./Register";
import VerifyOtp from "./VerifyOtp";

function App() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const currentPath = window.location.pathname;

  // ==============================
  // STUDENT DASHBOARD
  // ==============================

  if (currentPath === "/student-dashboard") {
    return <StudentDashboard />;
  }

  // ==============================
  // ADMIN DASHBOARD
  // ==============================

  if (currentPath === "/admin-dashboard") {
    return <AdminDashboard />;
  }

  // ==============================
  // ADMIN COURSE MANAGEMENT
  // ==============================

  if (currentPath === "/admin-courses") {
    return <AdminCourses />;
  }

  // ==============================
  // ADMIN STUDENT MANAGEMENT
  // ==============================

  if (currentPath === "/admin-students") {
    return <AdminStudents />;
  }

  // ==============================
  // ADMIN COURSE REGISTRATIONS
  // ==============================

  if (currentPath === "/admin-registrations") {
    return <AdminRegistrations />;
  }

  // ==============================
  // REGISTRATION
  // ==============================

  if (currentPath === "/register") {
    return <Register />;
  }

  // ==============================
  // OTP VERIFICATION
  // ==============================

  if (currentPath === "/verify-otp") {
    return <VerifyOtp />;
  }

  // ==============================
  // LOGIN
  // ==============================

  const handleLogin = async (event) => {

    event.preventDefault();

    setError("");
    setLoading(true);

    try {

      const response = await fetch(
          `${API_URL}/auth/login`,
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              email: email,
              password: password,
            }),
          }
      );

      if (!response.ok) {

        const errorMessage = await response.text();

        throw new Error(
            errorMessage || "Login failed"
        );
      }

      const data = await response.json();

      // ==============================
      // SAVE LOGIN INFORMATION
      // ==============================

      localStorage.setItem(
          "token",
          data.token
      );

      localStorage.setItem(
          "role",
          data.role
      );

      // ==============================
      // REDIRECT BASED ON ROLE
      // ==============================

      if (data.role === "STUDENT") {

        window.location.href =
            "/student-dashboard";

      } else if (data.role === "ADMIN") {

        window.location.href =
            "/admin-dashboard";

      } else {

        throw new Error(
            "Unknown user role"
        );
      }

    } catch (error) {

      console.error(
          "Login error:",
          error
      );

      setError(
          error.message || "Login failed. Please try again."
      );

    } finally {

      setLoading(false);

    }
  };

  // ==============================
  // LOGIN PAGE
  // ==============================

  return (
      <div className="login-page">

        <div className="login-card">

          {/* ==============================
            BRAND / HEADER
        ============================== */}

          <div className="login-brand">

            <div className="login-logo">
              CR
            </div>

            <div>
              <h1>
                Course Registration
              </h1>

              <p>
                Student &amp; Academic Management System
              </p>
            </div>

          </div>

          {/* ==============================
            LOGIN TITLE
        ============================== */}

          <div className="login-heading">

            <h2>
              Welcome Back
            </h2>

            <p>
              Sign in to access your account
            </p>

          </div>

          {/* ==============================
            ERROR MESSAGE
        ============================== */}

          {error && (
              <div className="login-error">
                {error}
              </div>
          )}

          {/* ==============================
            LOGIN FORM
        ============================== */}

          <form onSubmit={handleLogin}>

            {/* ==============================
              EMAIL
          ============================== */}

            <div className="form-group">

              <label htmlFor="email">
                Email Address
              </label>

              <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(event) =>
                      setEmail(event.target.value)
                  }
                  required
                  disabled={loading}
              />

            </div>

            {/* ==============================
              PASSWORD
          ============================== */}

            <div className="form-group">

              <label htmlFor="password">
                Password
              </label>

              <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) =>
                      setPassword(event.target.value)
                  }
                  required
                  disabled={loading}
              />

            </div>

            {/* ==============================
              LOGIN BUTTON
          ============================== */}

            <button
                type="submit"
                className="login-button"
                disabled={loading}
            >

              {loading ? (
                  <>
                    <span className="login-spinner"></span>
                    Signing in...
                  </>
              ) : (
                  "Sign In"
              )}

            </button>

          </form>

          {/* ==============================
            REGISTER
        ============================== */}

          <div className="register-section">

            <p>
              Don't have an account?
            </p>

            <button
                type="button"
                className="register-button"
                onClick={() =>
                    (window.location.href = "/register")
                }
                disabled={loading}
            >
              Create a new account
            </button>

          </div>

          {/* ==============================
            FOOTER
        ============================== */}

          <div className="login-footer">
            <p>
              Secure Course Registration System
            </p>
          </div>

        </div>

      </div>
  );
}

export default App;