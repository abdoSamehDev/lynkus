import axios from "axios";

// Create the Axios instance with baseURL
const api = axios.create({
  baseURL: "https://lynkus-3.onrender.com/api",
});

// Function to set the authentication token
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export default api;
