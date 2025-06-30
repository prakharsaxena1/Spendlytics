import type { RootState } from "../../store";

export const AuthSelector = (state: RootState) => state.Auth;
export const CurrentUserSelector = (state: RootState) => state.Auth.user;
export const IsLoadingSelector = (state: RootState) => state.Auth.isLoading;
export const IsAuthenticatedSelector = (state: RootState) =>
  state.Auth.isAuthenticated;
