type GroupTransaction = {
  amount: number;
  transactionDate: string;
  note: string;
  splitType: "percentage" | "value";
  splitDetails: {
    [userId: string]: number;
  };
};

type CommonResponse = {
  success: boolean;
  message: string;
};

export type AddGroupTransactionRequest = { groupId: string } & GroupTransaction;

export type AddGroupTransactionResponse = CommonResponse & {
  transaction: { userId: string; groupId: string } & GroupTransaction;
  updatedGroup: {
    unsettledAmount: number;
    groupName: string;
    members: string[];
    createdBy: string;
    totalExpense: number;
    isSettled: boolean;
    lastSettledAt: string | null;
    createdAt: string;
    updatedAt: string;
  };
};

export type GetGroupTransactionsResponse = CommonResponse & {
  transactions: AddGroupTransactionResponse["transaction"][];
};

export type EditGroupTransactionRequest = {
  groupId: string;
  transactionId: string;
} & GroupTransaction;

export type EditGroupTransactionResponse = CommonResponse & {
  transaction: AddGroupTransactionResponse["transaction"];
};

export type DeleteGroupTransactionRequest = {
  groupId: string;
  transactionId: string;
};

export type DeleteGroupTransactionResponse = CommonResponse;

export type CalculateSettlementRequest = string;

export type CalculateSettlementResponse = CommonResponse & {
  userPayments: Record<string, number>;
};

export type CreateSettlementRequest = {
  groupId: string;
  paidTo: string;
  amount: string;
  note: string;
};

export type CreateSettlementResponse = CommonResponse;

export type SettlementActionRequest = {
  groupId: string;
  settlementId: string;
  action: 'completed' | 'rejected';
};

export type SettlementActionResponse = CommonResponse;

export type GetSettlementsResponse = CommonResponse & {
  settlements: {
    groupId: string;
    paidBy: string;
    paidTo: string;
    amount: number;
    status: string;
    note: string;
    createdAt: string;
    updatedAt: string;
  }[];
};
