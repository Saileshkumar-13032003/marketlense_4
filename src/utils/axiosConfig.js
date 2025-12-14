// frontend/src/axiosConfig.js
import axios from "axios";

const setupAxiosInterceptors = () => {
  // 1. Get the token from persistent storage (localStorage)
  const token = localStorage.getItem("token");

  // 2. If a token exists, set the Authorization header default for all future Axios requests
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    // 3. If no token, ensure the header is clean (important for public routes)
    delete axios.defaults.headers.common["Authorization"];
  }
};

// Execute the setup immediately when this file is imported
setupAxiosInterceptors();

// Export the function to update the header manually (e.g., during logout)
export { setupAxiosInterceptors };
