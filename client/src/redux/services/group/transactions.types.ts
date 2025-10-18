type GroupTransaction = {
  paidBy: string;
  amount: number;
  transactionDate: string;
  note: string;
  splitType: "percentage" | "value";
  splitDetails: {
    [userId: string]: number;
  };
};

export type AddGroupTransactionRequest = { groupId: string } & GroupTransaction;

export type AddGroupTransactionResponse = CommonResponse & {
  transaction: {
    _id: string;
    paidBy: string;
    createdBy: string;
    group: string;
    updatedAt: string;
    createdAt: string;
  } & GroupTransaction;
  updatedGroup: {
    groupName: string;
    members: string[];
    createdBy: string;
    totalExpense: number;
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

export type GroupTransactionFullType =
  AddGroupTransactionResponse["transaction"];
