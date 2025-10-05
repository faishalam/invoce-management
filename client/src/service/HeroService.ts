import Axios from "axios";
import Cookies from "js-cookie";

const baseURL = "http://localhost:3001/";

export const HeroServices = Axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache, no-store, must-revalidate", // minta tidak cache
    Pragma: "no-cache",
    Expires: "0",
  },
});

HeroServices.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = Cookies.get("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    // Pastikan header cache tetap ada walau di interceptor (kadang di instance belum cukup)
    config.headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
    config.headers.Pragma = "no-cache";
    config.headers.Expires = "0";

    return config;
  },
  (error) => Promise.reject(error)
);
