import baseApi from "../baseQuery";
import type {
  GetCurrentUserResponse,
  LoginRegisterResponse,
  LoginRequest,
  LogoutResponse,
  RegisterRequest,
} from "./types";

export const AuthApis = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<LoginRegisterResponse, LoginRequest>({
      query: (params) => ({
        url: "/auth/login",
        method: "POST",
        body: params,
      }),
    }),
    register: build.mutation<LoginRegisterResponse, RegisterRequest>({
      query: (params) => ({
        url: "/auth/register",
        method: "POST",
        body: params,
      }),
    }),
    logout: build.mutation<LogoutResponse, null>({
      query: () => ({
        url: "/auth/logout",
        method: "GET",
      }),
    }),
    getCurrentUser: build.query<GetCurrentUserResponse, void>({
      query: () => '/auth/me',
    }),
  }),
});

export default AuthApis;
