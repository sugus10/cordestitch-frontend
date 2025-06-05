import axios from "axios";
import {
  getTokenFromLocalStorage,
  addTokenToLocalStorage,
  scheduleNextAccessToken,
} from "../app/token-manager";
import { store } from "@/components/redux/store";
import { logout } from "@/components/redux/auth/authSlice";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://dev.cordestitch.com";

const http = axios.create({
  baseURL: BASE_URL,
  headers: { 
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

function onTokenRefreshed(newToken: string) {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
}

async function fetchNewAccessToken() {
  if (isRefreshing) {
    return new Promise<string>((resolve) => {
      subscribeTokenRefresh(resolve);
    });
  }

  isRefreshing = true;

  try {
    const response = await http.get("/api/jwt/refreshToken", {
      withCredentials: true,
    });
    const newAccessToken = response.data.accessToken;

    if (newAccessToken) {
      addTokenToLocalStorage(newAccessToken);
      scheduleNextAccessToken(newAccessToken);
      onTokenRefreshed(newAccessToken);

      http.defaults.headers.common["Authorization"] =
        `Bearer ` + newAccessToken;
      return newAccessToken;
    } else {
      throw new Error("No access token returned from refresh token endpoint.");
    }
  } catch (error) {
    console.error("Failed to refresh token:", error);
    store.dispatch(logout());
    localStorage.removeItem("token");
    throw error;
  } finally {
    isRefreshing = false;
  }
}

http.interceptors.request.use(
  (config) => {
    const token = getTokenFromLocalStorage();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    } else {
      delete config.headers["Authorization"];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await fetchNewAccessToken();
        if (newAccessToken) {
          originalRequest.headers["Authorization"] = `Bearer ` + newAccessToken;
          return http(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed. Redirecting to login.");
        store.dispatch(logout());
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("token");
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default http;