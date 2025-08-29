import baseApi from "../baseQuery";
import type {
  AllGroupResponse,
  GroupDetailsResponse,
  GroupDetailsRequest,
  CreateGroupResponse,
  CreateGroupRequest,
  DeleteGroupRequest,
  DeleteGroupResponse,
  AddGroupMembersRequest,
  RemoveGroupMemberRequest,
  AddGroupMembersResponse,
  RemoveGroupMemberResponse,
  UpdateGroupNameRequest,
} from "./group.types";

export const GroupApis = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createGroup: build.mutation<CreateGroupResponse, CreateGroupRequest>({
      query: (body) => ({
        url: "/group",
        method: "POST",
        body,
      }),
      invalidatesTags: ["groups"],
    }),
    getAllGroups: build.query<AllGroupResponse, void>({
      query: () => ({
        url: "/group",
        method: "GET",
      }),
      keepUnusedDataFor: 120,
      providesTags: ["groups"],
    }),
    deleteGroup: build.mutation<DeleteGroupResponse, DeleteGroupRequest>({
      query: ({ groupId }) => ({
        url: `/group/${groupId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["groups"],
    }),
    getGroupDetails: build.query<GroupDetailsResponse, GroupDetailsRequest>({
      query: ({ groupId }) => ({
        url: `/group/${groupId}`,
        method: "GET",
      }),
      providesTags: ["group-details"],
    }),
    addGroupMembers: build.mutation<AddGroupMembersResponse, AddGroupMembersRequest>({
      query: ({ groupId, members }) => ({
        url: `/group/${groupId}/add`,
        method: "PUT",
        body: {
          members,
        },
      }),
      invalidatesTags: ["group-details"]
    }),
    removeGroupMember: build.mutation<RemoveGroupMemberResponse, RemoveGroupMemberRequest>({
      query: ({ groupId, member }) => ({
        url: `/group/${groupId}/remove`,
        method: "PUT",
        body: {
          member,
        },
      }),
      invalidatesTags: ["group-details"]
    }),
    updateGroupName: build.mutation<RemoveGroupMemberResponse, UpdateGroupNameRequest>({
      query: ({ groupId, groupName }) => ({
        url: `/group/${groupId}`,
        method: "PUT",
        body: {
          groupName,
        },
      }),
      invalidatesTags: ["group-details", "groups"]
    }),
  }),
});

export default GroupApis;
