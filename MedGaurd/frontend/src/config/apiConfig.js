// API Configuration
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://medgaurd-4jk8.onrender.com";

// Use backend ML route instead of local Flask
const ML_API_URL =
  import.meta.env.VITE_API_URL ||
  "https://medgaurd-4jk8.onrender.com";

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  SIGNUP: `${API_BASE_URL}/api/signup`,
  LOGIN: `${API_BASE_URL}/api/login`,
  ML_SYMPTOMS: `${ML_API_URL}/api/symptoms`,

  // Profile
  PROFILE: `${API_BASE_URL}/api/profile`,
  UPDATE_PROFILE: `${API_BASE_URL}/api/profile`,

  // Predictions
  PREDICT: `${API_BASE_URL}/api/predict`,
  GET_PREDICTIONS: `${API_BASE_URL}/api/predictions`,
  GET_DASHBOARD_STATS: `${API_BASE_URL}/api/dashboard-stats`,

  // Health & Debug
  HEALTH: `${API_BASE_URL}/api/health`,
  DEBUG_USERS: `${API_BASE_URL}/api/debug/users`,
  DEBUG_PREDICTIONS: `${API_BASE_URL}/api/debug/predictions`,
  DEBUG_CLEAR: `${API_BASE_URL}/api/debug/clear-all`
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR:
    "Network connection failed. Please check your internet connection.",
  SERVER_ERROR: "Server error. Please try again later.",
  UNAUTHORIZED: "Please login to continue.",
  TOKEN_EXPIRED: "Your session has expired. Please login again.",
  INVALID_REQUEST: "Invalid request. Please check your input.",
  NOT_FOUND: "Resource not found.",
  CONFLICT: "This resource already exists.",
  SERVICE_UNAVAILABLE:
    "Service is currently unavailable. Please try again later.",
  ML_API_DOWN:
    "Disease prediction service is offline. Please try again later."
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

// Axios Configuration
export const axiosConfig = {
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  }
};

// Get Authorization Header
export const getAuthHeader = () => {
  const token = localStorage.getItem("token");

  if (!token) return {};

  return {
    Authorization: `Bearer ${token}`
  };
};

// Get Error Message
export const getErrorMessage = (error) => {
  if (!error) return ERROR_MESSAGES.NETWORK_ERROR;

  // Network errors
  if (
    error.message === "Network Error" ||
    error.code === "ECONNABORTED"
  ) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }

  // Server response with custom error
  if (error.response?.data?.error) {
    return error.response.data.error;
  }

  // HTTP Status codes
  switch (error.response?.status) {
    case HTTP_STATUS.BAD_REQUEST:
      return (
        error.response.data?.error ||
        ERROR_MESSAGES.INVALID_REQUEST
      );

    case HTTP_STATUS.UNAUTHORIZED:
      return ERROR_MESSAGES.TOKEN_EXPIRED;

    case HTTP_STATUS.FORBIDDEN:
      return ERROR_MESSAGES.UNAUTHORIZED;

    case HTTP_STATUS.NOT_FOUND:
      return ERROR_MESSAGES.NOT_FOUND;

    case HTTP_STATUS.CONFLICT:
      return ERROR_MESSAGES.CONFLICT;

    case HTTP_STATUS.SERVICE_UNAVAILABLE:
      return ERROR_MESSAGES.ML_API_DOWN;

    case HTTP_STATUS.SERVER_ERROR:
      return ERROR_MESSAGES.SERVER_ERROR;

    default:
      return error.message || ERROR_MESSAGES.SERVER_ERROR;
  }
};

export default {
  API_BASE_URL,
  API_ENDPOINTS,
  ERROR_MESSAGES,
  HTTP_STATUS,
  axiosConfig,
  getAuthHeader,
  getErrorMessage
};