"use client";

import { createSlice } from "@reduxjs/toolkit";

let savedAuthState = null;

if (typeof window !== "undefined") {
  const localStorageState = localStorage.getItem("authState");
  const sessionStorageState = sessionStorage.getItem("authState");
  savedAuthState = localStorageState || sessionStorageState;
}

const initialState = savedAuthState
  ? JSON.parse(savedAuthState)
  : {
      isAuthenticated: false,
      user: null,
      cartCount: 0, 
    };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;

      if (typeof window !== "undefined") {
        localStorage.setItem("authState", JSON.stringify(state));
        sessionStorage.setItem("authState", JSON.stringify(state));
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.cartCount = 0; // Reset cart count on logout

      if (typeof window !== "undefined") {
        localStorage.removeItem("authState");
        sessionStorage.removeItem("authState");
      }
    },
    loginFailure: (state) => {
      state.isAuthenticated = false;
    },
    setCartCount: (state, action) => {
      state.cartCount = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("authState", JSON.stringify(state));
      }
    }

  },
});

export const { loginSuccess, logout, loginFailure, setCartCount } = authSlice.actions;
export default authSlice.reducer;

export const selectAuth = (state) => state.auth;
