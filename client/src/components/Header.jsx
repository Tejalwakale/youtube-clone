// Import React state
import { useState } from "react";

// Import Link for navigation
import { Link } from "react-router-dom";

// Header component
const Header = ({
  onMenuClick,
  onSearch,
  user,
  onLogout,
}) => {
  // Store search text
  const [searchText, setSearchText] = useState("");

  // Handle search input changes
  const handleSearchChange = (event) => {
    // Get the entered search value
    const value = event.target.value;

    // Update local search state
    setSearchText(value);

    // Send search value to Home component through App
    onSearch(value);
  };

  return (
    <header className="header">

      {/* Left side of header */}
      <div className="header-left">

        {/* Hamburger menu button */}
        <button
          className="menu-button"
          onClick={onMenuClick}
          aria-label="Toggle sidebar"
        >
          ☰
        </button>

        {/* YouTube logo */}
        <Link to="/" className="logo">
          ▶ YouTube
        </Link>

      </div>

      {/* Search bar */}
      <div className="search-container">

        <input
          type="text"
          placeholder="Search"
          value={searchText}
          onChange={handleSearchChange}
        />

        <button
          type="button"
          className="search-button"
        >
          🔍
        </button>

      </div>

      {/* Right side of header */}
      <div className="header-right">

        {user ? (
          <>
            {/* Display logged-in user's name */}
            <span className="username">
              {user.username}
            </span>

            {/* Logout button */}
            <button
              className="logout-button"
              onClick={onLogout}
            >
              Logout
            </button>
          </>
        ) : (
          /* Display Sign In when nobody is logged in */
          <Link
            to="/login"
            className="sign-in-button"
          >
            Sign In
          </Link>
        )}

      </div>

    </header>
  );
};

// Export Header component
export default Header;