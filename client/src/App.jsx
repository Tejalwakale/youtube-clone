// Import React state
import { useState } from "react";

// Import routing components
import { Routes, Route } from "react-router-dom";

// Import layout components
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

// Import application pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VideoPlayer from "./pages/VideoPlayer";
import Channel from "./pages/Channel";
import CreateChannel from "./pages/CreateChannel";

// Main application component
const App = () => {
  // Store whether the sidebar is open
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Store search text from the header
  const [searchText, setSearchText] = useState("");

  // Get the previously logged-in user from localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    // Convert saved JSON string back into an object
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Toggle the sidebar
  const handleMenuClick = () => {
    setSidebarOpen((previousState) => !previousState);
  };

  // Handle successful login
  const handleLogin = (loggedInUser) => {
    // Store the user in React state
    setUser(loggedInUser);
  };

  // Handle logout
  const handleLogout = () => {
    // Remove JWT token
    localStorage.removeItem("token");

    // Remove saved user
    localStorage.removeItem("user");

    // Clear the user from React state
    setUser(null);
  };

  return (
    <>
      {/* Display header */}
      <Header
        onMenuClick={handleMenuClick}
        onSearch={setSearchText}
        user={user}
        onLogout={handleLogout}
      />

      {/* Display sidebar */}
      <Sidebar isOpen={sidebarOpen} />

      {/* Main content area */}
      <div
        className={
          sidebarOpen
            ? "content with-sidebar"
            : "content"
        }
      >
        {/* Application routes */}
        <Routes>

          {/* Home page */}
          <Route
            path="/"
            element={
              <Home searchText={searchText} />
            }
          />

          {/* Login page */}
          <Route
            path="/login"
            element={
              <Login onLogin={handleLogin} />
            }
          />

          {/* Register page */}
          <Route
            path="/register"
            element={
              <Register />
            }
          />

          {/* Video player page */}
          <Route
            path="/video/:id"
            element={
              <VideoPlayer />
            }
          />

          {/* Channel page */}
          <Route
            path="/channel/:id"
            element={
              <Channel />
            }
          />

          {/* Create channel page */}
          <Route
            path="/create-channel"
            element={<CreateChannel />}
          />

        </Routes>
      </div>
    </>
  );
};

// Export App component
export default App;