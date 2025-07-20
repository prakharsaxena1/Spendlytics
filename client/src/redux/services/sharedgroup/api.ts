import baseApi from "../baseQuery";
import type {
  AllSharedGroupResponse,
  SharedGroupDetailsResponse,
  SharedGroupDetailsRequest,
  CreateSharedGroupResponse,
  CreateSharedGroupRequest,
  UpdateSharedGroupRequest,
  DeleteSharedGroupRequest,
  DeleteSharedGroupResponse,
} from "./types";

export const SharedGroupApis = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllSharedGroup: build.query<AllSharedGroupResponse, void>({
      query: () => ({
        url: '/sharedgroup',
        method: 'GET',
      }),
      keepUnusedDataFor: 120,
      providesTags: ['shared-groups']
    }),
    getSharedGroupDetails: build.query<SharedGroupDetailsResponse, SharedGroupDetailsRequest>({
      query: ({ id }) => ({
        url: `/sharedgroup/${id}`,
        method: 'GET',
      }),
    }),
    createSharedGroup: build.mutation<CreateSharedGroupResponse, CreateSharedGroupRequest>({
      query: (body) => ({
        url: '/sharedgroup',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['shared-groups']
    }),
    updateSharedGroup: build.mutation<SharedGroupDetailsResponse, UpdateSharedGroupRequest>({
      query: (body) => ({
        url: '/sharedgroup',
        method: 'PUT',
        body,
      }),
    }),
    deleteSharedGroup: build.mutation<DeleteSharedGroupResponse, DeleteSharedGroupRequest>({
      query: ({ id }) => ({
        url: `/sharedgroup/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['shared-groups']
    }),
  }),
});

export default SharedGroupApis;
