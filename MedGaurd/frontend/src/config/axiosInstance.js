import axios from "axios";
import { API_ENDPOINTS, axiosConfig, getErrorMessage, getAuthHeader } from "./apiConfig";

// Create axios instance
const apiClient = axios.create(axiosConfig);

// Request interceptor - Add token to all requests
apiClient.interceptors.request.use(
  (config) => {
    const authHeader = getAuthHeader();
    if (authHeader.Authorization) {
      config.headers.Authorization = authHeader.Authorization;
    }
    return config;
  },
  (error) => {
    console.error("Request Error:", error.message);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors uniformly
apiClient.interceptors.response.use(
  (response) => {
    // Check if response has success flag
    if (response.data && response.data.success === false) {
      const error = new Error(response.data.error || "Request failed");
      error.response = response;
      return Promise.reject(error);
    }
    return response;
  },
  (error) => {
    // Handle 401 errors - redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    console.error("API Error:", getErrorMessage(error));
    return Promise.reject(error);
  }
);

export { apiClient, API_ENDPOINTS };
export default apiClient;
