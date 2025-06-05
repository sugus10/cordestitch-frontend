import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";


export interface User {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  isVerified: boolean
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}



const loadFromSessionStorage = (): AuthState => {
  if (typeof window === "undefined") {

    return { user: null, isAuthenticated: false };
  }


  const user = sessionStorage.getItem("user");
  const isAuthenticated = sessionStorage.getItem("isAuthenticated") === "true";

  return user
    ? { user: JSON.parse(user), isAuthenticated }
    : { user: null, isAuthenticated: false };
};

const initialState: AuthState = loadFromSessionStorage();

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthState: (state, action: PayloadAction<AuthState>) => {
      state.user = action.payload.user;
      state.isAuthenticated = action.payload.isAuthenticated;
      if (typeof window !== "undefined") {
        sessionStorage.setItem("user", JSON.stringify(action.payload.user));
        sessionStorage.setItem("isAuthenticated", String(action.payload.isAuthenticated));
      }
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("isAuthenticated");
      }
    },
  },
});

export const { setAuthState, logout } = authSlice.actions;

// Selectors
export const selectAuth = (state: RootState) => state.auth;

export default authSlice.reducer;
