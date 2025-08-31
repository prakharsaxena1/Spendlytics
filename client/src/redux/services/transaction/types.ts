export type TransactionItemType = {
  _id: string;
  transactionType: "inflow" | "outflow";
  category: "needs" | "wants" | "investments" | "savings" | "debt";
  amount: number;
  transactionDate: string;
  groupId?: string;
  note: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type TransactionListResponse = CommonResponse & {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  transactions: TransactionItemType[];
};

export type TransactionListRequest = {
  page: number;
  limit: number;
};

export type CreateTransactionResponse = {
  message: string;
  transaction: TransactionItemType;
};

export type CreateTransactionRequest = {
  transactionType: TransactionItemType["transactionType"];
  category: TransactionItemType["category"];
  amount: number;
  transactionDate: string;
  note: string;
};

export type DeleteTransactionResponse = {
  message: string;
  transaction: TransactionItemType;
};
export type DeleteTransactionRequest = {
  transactionId: string;
};

export type UpdateTransactionResponse = {
  message: string;
  transaction: TransactionItemType;
};

export type UpdateTransactionRequest = CreateTransactionRequest & {
  _id: string;
};
