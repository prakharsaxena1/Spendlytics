import baseApi from "../baseQuery";
import type {
  AddGroupTransactionRequest,
  AddGroupTransactionResponse,
  GetGroupTransactionsResponse,
  EditGroupTransactionRequest,
  EditGroupTransactionResponse,
  DeleteGroupTransactionRequest,
  DeleteGroupTransactionResponse,
  CalculateSettlementRequest,
  CalculateSettlementResponse,
  CreateSettlementRequest,
  CreateSettlementResponse,
  SettlementActionRequest,
  SettlementActionResponse,
  GetSettlementsResponse,
} from "./transactions.types";

export const GroupTransactionApis = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addGroupTransaction: build.mutation<
      AddGroupTransactionResponse,
      AddGroupTransactionRequest
    >({
      query: ({ groupId, ...body }) => ({
        url: `/${groupId}/transaction`,
        method: "POST",
        body,
      }),
    }),
    getGroupTransactions: build.query<GetGroupTransactionsResponse, string>({
      query: (groupId) => ({
        url: `/${groupId}/transaction`,
        method: "GET",
      }),
    }),
    editGroupTransaction: build.mutation<
      EditGroupTransactionResponse,
      EditGroupTransactionRequest
    >({
      query: ({ groupId, transactionId, ...body }) => ({
        url: `/${groupId}/transaction/${transactionId}`,
        method: "PUT",
        body,
      }),
    }),
    deleteGroupTransaction: build.mutation<
      DeleteGroupTransactionResponse,
      DeleteGroupTransactionRequest
    >({
      query: ({ groupId, transactionId }) => ({
        url: `/${groupId}/transaction/${transactionId}`,
        method: "DELETE",
      }),
    }),
    calculateSettlement: build.query<
      CalculateSettlementResponse,
      CalculateSettlementRequest
    >({
      query: (groupId) => ({
        url: `/${groupId}/settlement`,
        method: "GET",
      }),
    }),
    createSettlement: build.mutation<
      CreateSettlementResponse,
      CreateSettlementRequest
    >({
      query: ({ groupId, ...body }) => ({
        url: `/${groupId}/settlement`,
        method: "POST",
        body,
      }),
    }),
    settlementAction: build.mutation<
      SettlementActionResponse,
      SettlementActionRequest
    >({
      query: ({ groupId, settlementId, ...body }) => ({
        url: `/${groupId}/settlement/${settlementId}`,
        method: "PUT",
        body,
      }),
    }),
    getSettlements: build.query<GetSettlementsResponse, string>({
      query: (groupId) => ({
        url: `/${groupId}/settlement`,
        method: "GET",
      }),
    }),
  }),
});

export default GroupTransactionApis;
