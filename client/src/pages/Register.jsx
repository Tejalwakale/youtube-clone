// Import useState to manage form input values
import { useState } from "react";

// Import Link for navigation between pages
import { Link, useNavigate } from "react-router-dom";

// Import our Axios API instance
import api from "../services/api";

// Register page component
const Register = () => {
  // Store the username entered by the user
  const [username, setUsername] = useState("");

  // Store the email entered by the user
  const [email, setEmail] = useState("");

  // Store the password entered by the user
  const [password, setPassword] = useState("");

  // Store error messages
  const [error, setError] = useState("");

  // Store loading state while registering
  const [loading, setLoading] = useState(false);

  // Used to navigate to another page after registration
  const navigate = useNavigate();

  // Handle registration form submission
  const handleSubmit = async (event) => {
    // Prevent the browser from refreshing the page
    event.preventDefault();

    // Clear any previous error
    setError("");

    // Start loading
    setLoading(true);

    try {
      // Send registration details to the backend
      await api.post("/auth/register", {
        username,
        email,
        password,
      });

      // Registration was successful.
      // Redirect the user to the login page.
      navigate("/login");
    } catch (error) {
      // Display the error returned by the backend
      setError(
        error.response?.data?.message ||
        "Registration failed. Please try again."
      );
    } finally {
      // Stop loading
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* Registration card */}
      <div className="auth-card">

        {/* Page heading */}
        <h1>Create your account</h1>

        {/* Page description */}
        <p className="auth-subtitle">
          Join YouTube Clone
        </p>

        {/* Display error if registration fails */}
        {error && (
          <p className="auth-error">
            {error}
          </p>
        )}

        {/* Registration form */}
        <form onSubmit={handleSubmit}>

          {/* Username field */}
          <label>
            Username
          </label>

          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />

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

          {/* Submit button */}
          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Register"}
          </button>

        </form>

        {/* Link to login page */}
        <p className="auth-link">
          Already have an account?{" "}
          <Link to="/login">
            Sign In
          </Link>
        </p>

      </div>

    </div>
  );
};

// Export Register component
export default Register;