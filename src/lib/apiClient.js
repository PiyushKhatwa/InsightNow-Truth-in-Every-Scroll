import axios from "axios";

export const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

const apiClient = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10000
});

export default apiClient;
