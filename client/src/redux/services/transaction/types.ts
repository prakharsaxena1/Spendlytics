export type TransactionItemType = {
  transactionType: "inflow" | "outflow";
  category: "needs" | "wants" | "investments" | "savings" | "debt";
  amount: number;
  transactionDate: string;
  isShared: boolean;
  sharedGroupId?: string;
  note: string;
  userId: string;
  splitType: "percentage" | "value";
  splitDetails: {
    [userId: string]: number;
  };
  _id: string;
  createdAt: string;
  updatedAt: string;
};

export type TransactionListResponse = {
  message: string;
  transactions: TransactionItemType[];
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
  isShared?: boolean;
  sharedGroupId?: string | undefined;
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
