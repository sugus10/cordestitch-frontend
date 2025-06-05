"use client";
import {
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { createContext } from "react";
import http from "../http-common";
import { useSelector, useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { selectAuth, setAuthState } from "@/components/redux/auth/authSlice";

// Utility functions for token management
export const getTokenFromLocalStorage = () => {
  if (typeof window !== "undefined") {
    const token = sessionStorage.getItem("token");
    if (token) {
      return JSON.parse(token);
    }
    return null;
  }
};

export const addTokenToLocalStorage = (token: string) => {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("token", JSON.stringify(token));
  }
};

export const removeTokenFromLocalStorage = () => {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("token");
  }
};

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("User must be within an AuthProvider");
  }
  return authContext;
};

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const authState = useSelector(selectAuth);
  const dispatch = useDispatch();
  const [token, setTokenState] = useState<string | null>(
    getTokenFromLocalStorage()
  );
  const [refreshTimeout, setRefreshTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const canScheduleToken = useCallback((): boolean => {
    return authState.isAuthenticated && !!token;
  }, [authState.isAuthenticated, token]);

  const setToken = (newToken: string | null) => {
    setTokenState(newToken);
    if (newToken) {
      addTokenToLocalStorage(newToken);
    } else {
      removeTokenFromLocalStorage();
    }
  };

  const fetchNewAccessToken = useCallback(async () => {
    // Prevent concurrent refresh requests
    if (isRefreshing || !canScheduleToken()) return;

    setIsRefreshing(true);
    try {
      const response = await http.get("/api/jwt/refreshToken");
      const newToken = response.data.accessToken;
      
      // Only update if we got a valid token
      if (newToken) {
        setToken(newToken);
        // Only schedule next refresh if token is valid
        scheduleTokenFetch(newToken);
      } else {
        // If no token returned, logout
        setToken(null);
        dispatch(setAuthState({ user: null, isAuthenticated: false }));
      }
    } catch (error) {
      console.error("Failed to fetch new access token:", error);
      // Clear token and logout on refresh failure
      setToken(null);
      dispatch(setAuthState({ user: null, isAuthenticated: false }));
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing, canScheduleToken, dispatch]);

  const scheduleTokenFetch = useCallback(
    (tokenToSchedule: string) => {
      try {
        // Clear any existing timeout
        if (refreshTimeout) {
          clearTimeout(refreshTimeout);
          setRefreshTimeout(null);
        }

        // Decode token to get expiration time
        const { exp } = jwtDecode<{ exp: number }>(tokenToSchedule);
        const expirationTime = exp * 1000; // Convert to milliseconds
        const now = Date.now();
        
        // Calculate time to refresh (1 minute before expiration)
        const timeUntilRefresh = expirationTime - now - 60000;
        
        // Only schedule if the time is positive and reasonable
        if (timeUntilRefresh > 0 && timeUntilRefresh < 24 * 60 * 60 * 1000) {
          console.log(`Scheduling token refresh in ${timeUntilRefresh / 1000} seconds`);
          const timeout = setTimeout(() => fetchNewAccessToken(), timeUntilRefresh);
          setRefreshTimeout(timeout);
        } else if (timeUntilRefresh <= 0) {
          // Token already expired or very close to expiring, refresh immediately
          console.log("Token expired or about to expire, refreshing immediately");
          fetchNewAccessToken();
        } else {
          console.log("Token expiration too far in the future, will reschedule later");
        }
      } catch (error) {
        console.error("Failed to decode token expiration:", error);
      }
    },
    [refreshTimeout, fetchNewAccessToken]
  );

  // Effect to initialize token refresh schedule
  useEffect(() => {
    // Only schedule if we have valid authentication state
    if (canScheduleToken()) {
      scheduleTokenFetch(token!);
    }

    // Cleanup on unmount
    return () => {
      if (refreshTimeout) {
        clearTimeout(refreshTimeout);
      }
    };
  }, [canScheduleToken, scheduleTokenFetch, refreshTimeout, token]);

  // Set up axios interceptors
  useLayoutEffect(() => {
    if (authState.isAuthenticated && token) {
      // Request interceptor to add token to all requests
      const authInterceptor = http.interceptors.request.use((config) => {
        const currentToken = getTokenFromLocalStorage();
        if (currentToken) {
          config.headers.Authorization = `Bearer ${currentToken}`;
        }
        return config;
      });

      // Response interceptor to handle auth errors
      const refreshInterceptor = http.interceptors.response.use(
        (response) => response,
        async (error) => {
          const originalRequest = error.config;
          
          // Only retry once to prevent infinite loops
          if (
            error.response &&
            (error.response.status === 401 || error.response.status === 403) &&
            !originalRequest._retry
          ) {
            originalRequest._retry = true;
            
            try {
              // Get a fresh token
              await fetchNewAccessToken();
              const newToken = getTokenFromLocalStorage();
              
              // If we got a new token, retry the request
              if (newToken) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return http(originalRequest);
              } else {
                // No token means we're logged out
                return Promise.reject(error);
              }
            } catch (refreshError) {
              // Failed to refresh, reject the promise
              return Promise.reject(refreshError);
            }
          }
          return Promise.reject(error);
        }
      );

      // Clean up interceptors on unmount or auth state change
      return () => {
        http.interceptors.request.eject(authInterceptor);
        http.interceptors.response.eject(refreshInterceptor);
      };
    }
  }, [authState.isAuthenticated, token, dispatch, fetchNewAccessToken]);

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;