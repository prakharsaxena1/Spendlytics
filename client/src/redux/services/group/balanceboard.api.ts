import baseApi from "../baseQuery";
import type { BalanceBoardResponse } from "./balanceboard.types";

export const BalanceBoardApis = baseApi.injectEndpoints({
  endpoints: (build) => ({
    calculateBalanceBoard: build.query<BalanceBoardResponse, string>({
      query: (groupId) => ({
        url: `/group/${groupId}/balance`,
        method: "GET",
      }),
    }),
  }),
});

export default BalanceBoardApis;
