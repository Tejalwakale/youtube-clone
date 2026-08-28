// Import useState to manage form values
import { useState } from "react";

// Import Link for navigation and useNavigate for redirecting
import { Link, useNavigate } from "react-router-dom";

// Import Axios API instance
import api from "../services/api";

// Login page component
const Login = ({ onLogin }) => {
  // Store the email entered by the user
  const [email, setEmail] = useState("");

  // Store the password entered by the user
  const [password, setPassword] = useState("");

  // Store error messages
  const [error, setError] = useState("");

  // Store loading state
  const [loading, setLoading] = useState(false);

  // Used to redirect the user after successful login
  const navigate = useNavigate();

  // Handle login form submission
  const handleSubmit = async (event) => {
    // Prevent normal browser form submission
    event.preventDefault();

    // Clear old error messages
    setError("");

    // Start loading
    setLoading(true);

    try {
      // Send login credentials to the backend
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      // Get the response data from the backend
      const data = response.data;

      // Save the JWT token in localStorage
      localStorage.setItem("token", data.token);

      // Save user information if the backend provides it
      if (data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      }

      // Inform App.jsx that login was successful
      onLogin(data.user);

      // Redirect to the home page
      navigate("/");
    } catch (error) {
      // Display the backend error message
      setError(
        error.response?.data?.message ||
        "Login failed. Please check your credentials."
      );
    } finally {
      // Stop loading
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* Login card */}
      <div className="auth-card">

        {/* Page heading */}
        <h1>Sign in</h1>

        {/* Page description */}
        <p className="auth-subtitle">
          Sign in to your YouTube Clone account
        </p>

        {/* Display login error */}
        {error && (
          <p className="auth-error">
            {error}
          </p>
        )}

        {/* Login form */}
        <form onSubmit={handleSubmit}>

          {/* Email field */}
          <label>
            Email
          </label>

          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          {/* Password field */}
          <label>
            Password
          </label>

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          {/* Login button */}
          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

        </form>

        {/* Registration link */}
        <p className="auth-link">
          Don't have an account?{" "}
          <Link to="/register">
            Create an account
          </Link>
        </p>

      </div>

    </div>
  );
};

// Export Login component
export default Login;