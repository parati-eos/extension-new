// utils/axiosInstance.ts
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
});

// Global Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error?.response?.data?.message || "";
    if (message.includes("Invalid or expired token")) {
      window.location.href = "/"; // 👈 Redirect to root
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
