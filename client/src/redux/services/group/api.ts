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
} from "./types";

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
      query: ({ id }) => ({
        url: `/group/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["groups"],
    }),
    getGroupDetails: build.query<GroupDetailsResponse, GroupDetailsRequest>({
      query: ({ id }) => ({
        url: `/group/${id}`,
        method: "GET",
      }),
    }),
    addGroupMembers: build.mutation<
      AddGroupMembersResponse,
      AddGroupMembersRequest
    >({
      query: ({ groupId, members }) => ({
        url: `/group/${groupId}/add`,
        method: "PUT",
        body: {
          members,
        },
      }),
    }),
    removeGroupMember: build.mutation<
      RemoveGroupMemberResponse,
      RemoveGroupMemberRequest
    >({
      query: ({ groupId, member }) => ({
        url: `/group/${groupId}/remove`,
        method: "PUT",
        body: {
          member,
        },
      }),
    }),
    updateGroupName: build.mutation<
      RemoveGroupMemberResponse,
      UpdateGroupNameRequest
    >({
      query: ({ groupId, groupName }) => ({
        url: `/group/${groupId}`,
        method: "PUT",
        body: {
          groupName,
        },
      }),
    }),
  }),
});

export default GroupApis;
