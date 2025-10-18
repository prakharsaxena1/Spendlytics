// src/redux/slices/transactionFilterSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TransactionItemType } from "../../services/transaction/types";
import { TODAY } from "../../../constants/constants";

export interface TransactionFilterState {
  categories: TransactionItemType["category"][];
  fromDate: string;
  toDate: string;
}

const initialState: TransactionFilterState = {
  categories: [],
  fromDate: TODAY,
  toDate: TODAY,
};

const transactionFilterSlice = createSlice({
  name: "transactionFilter",
  initialState,
  reducers: {
    setCategories(state, action: PayloadAction<TransactionItemType["category"][]>) {
      state.categories = action.payload;
    },
    setFromDate(state, action: PayloadAction<string>) {
      state.fromDate = action.payload;
    },
    setToDate(state, action: PayloadAction<string>) {
      state.toDate = action.payload;
    },
    clearFilters(state) {
      state.categories = [];
      state.fromDate = TODAY;
      state.toDate = TODAY;
    },
  },
});

export const { setCategories, setFromDate, setToDate, clearFilters } =
  transactionFilterSlice.actions;

export default transactionFilterSlice.reducer;
