import Axios from "axios";
import Cookies from "js-cookie";

const baseURL = "https://ba-management.online/";
// const baseURL = "http://localhost:3001/"; 

export const HeroServices = Axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  },
});

// 🧩 Interceptor Request
HeroServices.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = Cookies.get("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    config.headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
    config.headers.Pragma = "no-cache";
    config.headers.Expires = "0";
    return config;
  },
  (error) => Promise.reject(error)
);

// 🚨 Interceptor Response
HeroServices.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Jika token invalid / expired
      if (typeof window !== "undefined") {
        Cookies.remove("accessToken"); // hapus token
        window.location.href = "/login"; // redirect ke login page
      }
    }

    return Promise.reject(error);
  }
);
