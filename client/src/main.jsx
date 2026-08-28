// Import React DOM
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Import BrowserRouter for application routing
import { BrowserRouter } from "react-router-dom";

// Import global CSS
import './index.css'

// Import the main App component
import App from './App.jsx'

// Render the React application
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);