import baseApi from "../baseQuery";
import type {
  SearchMemberResponse,
  SearchMemberRequest,
  NotificationsResponse,
  InviteActionResponse,
  InviteActionRequest,
  UpdateAppSettingsRequest,
} from "./types";

export const UserApis = baseApi.injectEndpoints({
  endpoints: (build) => ({
    searchMember: build.query<SearchMemberResponse, SearchMemberRequest>({
      query: (params) => ({
        url: `/users/search`,
        method: "GET",
        params,
      }),
      keepUnusedDataFor: 120,
    }),
    updateAppSettings: build.mutation<CommonResponse, UpdateAppSettingsRequest>({
      query: (body) => ({
        url: `/users/settings`,
        method: "PUT",
        body,
      }),
    }),
    notification: build.query<NotificationsResponse, void>({
      query: () => ({
        url: `/users/notifications`,
        method: "GET",
      }),
      keepUnusedDataFor: 120,
      providesTags: ['notifications-invitations']
    }),
    inviteAction: build.mutation<InviteActionResponse, InviteActionRequest>({
      query: (body) => ({
        url: "/users/invite",
        method: "POST",
        body
      }),
      invalidatesTags: ['notifications-invitations', 'groups']
    }),
  }),
});

export default UserApis;
