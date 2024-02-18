import { createSlice } from "@reduxjs/toolkit";

const initialState = JSON.parse(localStorage.getItem("login"));

const authSlice = createSlice({
  name: "auth",
  initialState: initialState || null,
  reducers: {
    login(state, action) {
      localStorage.setItem("login", JSON.stringify(action.payload));
      return action.payload;
    },
    logout(state, action) {
      localStorage.removeItem("login");
      return null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice;
