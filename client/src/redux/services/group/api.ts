import baseApi from "../baseQuery";
import type {
  AllGroupResponse,
  GroupDetailsResponse,
  GroupDetailsRequest,
  CreateGroupResponse,
  CreateGroupRequest,
  UpdateGroupRequest,
  DeleteGroupRequest,
  DeleteGroupResponse,
  CreateGroupTransactionResponse,
  CreateGroupTransactionRequest,
} from "./types";

export const GroupApis = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllGroups: build.query<AllGroupResponse, void>({
      query: () => ({
        url: '/group',
        method: 'GET',
      }),
      keepUnusedDataFor: 120,
      providesTags: ['groups']
    }),
    getGroupDetails: build.query<GroupDetailsResponse, GroupDetailsRequest>({
      query: ({ id }) => ({
        url: `/group/${id}`,
        method: 'GET',
      }),
    }),
    createGroup: build.mutation<CreateGroupResponse, CreateGroupRequest>({
      query: (body) => ({
        url: '/group',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['groups']
    }),
    createGroupTransaction: build.mutation<CreateGroupTransactionResponse, CreateGroupTransactionRequest>({
      query: (params) => ({
        url: "/transaction",
        method: "POST",
        body: params,
      }),
    }),
    updateGroup: build.mutation<GroupDetailsResponse, UpdateGroupRequest>({
      query: (body) => ({
        url: '/group',
        method: 'PUT',
        body,
      }),
    }),
    deleteGroup: build.mutation<DeleteGroupResponse, DeleteGroupRequest>({
      query: ({ id }) => ({
        url: `/group/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['groups']
    }),
  }),
});

export default GroupApis;
