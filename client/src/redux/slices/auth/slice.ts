import { createSlice } from "@reduxjs/toolkit";
import { AuthApis, type UserType } from "../../services/auth";

interface AuthState {
  user: UserType | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        AuthApis.endpoints.login.matchFulfilled,
        (state, { payload }) => {
          state.user = payload.user;
          state.isAuthenticated = true;
          state.isLoading = false;
          state.error = null;
        }
      )
      .addMatcher(
        AuthApis.endpoints.register.matchFulfilled,
        (state, { payload }) => {
          state.user = payload.user;
          state.isAuthenticated = true;
          state.isLoading = false;
          state.error = null;
        }
      )
      .addMatcher(AuthApis.endpoints.getCurrentUser.matchPending, (state) => {
        state.isLoading = true;
      })
      .addMatcher(
        AuthApis.endpoints.getCurrentUser.matchFulfilled,
        (state, { payload }) => {
          state.user = payload.user;
          state.isAuthenticated = true;
          state.isLoading = false;
          state.error = null;
        }
      )
      .addMatcher(
        AuthApis.endpoints.getCurrentUser.matchRejected,
        (state, { error }) => {
          state.isAuthenticated = false;
          state.user = null;
          state.isLoading = false;
          state.error = error.message || "Authentication failed";
        }
      );
  },
});

export const { logout, setError } = authSlice.actions;
export default authSlice.reducer;
