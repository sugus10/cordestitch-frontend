import { jwtDecode } from "jwt-decode";
import http from "./http-common";

let refreshTimeout: NodeJS.Timeout | null = null;

export function scheduleNextAccessToken(token: string) {
  const { exp } = jwtDecode<{ exp: number }>(token);
  const expirationTime = exp * 1000;
  const now = Date.now();
  const refreshTime = expirationTime - now - 60000;

  if (refreshTimeout) {
    clearTimeout(refreshTimeout);
  }

  if (refreshTime > 0) {
    refreshTimeout = setTimeout(() => fetchNewAccessToken(), refreshTime);
  }
}

async function fetchNewAccessToken() {
  try {
    const response = await http.get("/api/jwt/refreshToken", {
      withCredentials: true,
    });
    const newAccessToken = response.data.accessToken;
    if (newAccessToken) {
      addTokenToLocalStorage(newAccessToken);
      scheduleNextAccessToken(newAccessToken);
    }
  } catch (error) {
    console.error("Failed to fetch new access token:", error);
  }
}

export const getTokenFromLocalStorage = () => {
  if (typeof window !== "undefined") {
    const token = sessionStorage.getItem("token");
    const actualToken = token ? JSON.parse(token) : null;

    return actualToken;
  }
};


export const addTokenToLocalStorage = (token: string) => {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("token", JSON.stringify(token));
    sessionStorage.setItem("token", JSON.stringify(token));
  }
};
