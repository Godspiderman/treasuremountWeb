"use client";

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080", // Base URL for your API
  timeout: 10000, // Request timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error("Unauthorized access - please log in again.");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
