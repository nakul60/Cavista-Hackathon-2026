import { createSlice } from "@reduxjs/toolkit";

const storedUser = localStorage.getItem("authUser");
const storedToken = localStorage.getItem("authToken");

const parsedStoredUser = storedUser ? JSON.parse(storedUser) : null;

const initialState = {
  user: parsedStoredUser,
  token: storedToken || null,
  isAuthenticated: Boolean(storedToken || parsedStoredUser),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      const { user, token } = action.payload;
      state.user = user || null;
      state.token = token || null;
      state.isAuthenticated = Boolean(token || user);

      if (user) {
        localStorage.setItem("authUser", JSON.stringify(user));
      } else {
        localStorage.removeItem("authUser");
      }

      if (token) {
        localStorage.setItem("authToken", token);
      } else {
        localStorage.removeItem("authToken");
      }
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("authUser");
      localStorage.removeItem("authToken");
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;
