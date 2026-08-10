const defaultApiBaseUrl: string = import.meta.env.DEV
  ? "http://localhost:3000"
  : window.location.origin;

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || defaultApiBaseUrl;
export const PREDICT_API_URL =
  import.meta.env.VITE_PREDICT_API_URL || `${API_BASE_URL}/predict`;
