// frontend/src/utils/setAuthToken.js
import axios from "axios";

const setAuthToken = (token) => {
  if (token) {
    // Apply token to every request header
    // This is the header your backend authMiddleware is looking for!
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    // Delete auth header (for logout)
    delete axios.defaults.headers.common["Authorization"];
  }
};

export default setAuthToken;
