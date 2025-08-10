import type { TransactionItemType } from "../transaction/types";
import type { MemberType } from "../user";

export type AllGroupResponse = {
  success: boolean;
  groups: {
    _id: string;
    groupName: string;
    totalExpense: number;
    isSettled: boolean;
    updatedAt: string;
    createdAt: string;
    memberCount: number;
  }[];
};

export type GroupDetailsResponse = {
  success: boolean;
  group: {
    _id: string;
    groupName: string;
    members: MemberType[];
    createdBy: string;
    totalExpense: number;
    isSettled: boolean;
    lastSettledAt: null;
    createdAt: string;
    updatedAt: string;
  };
  transactions: TransactionItemType[];
  invitedMembers: {
    _id: string;
    inviteBy: string;
    inviteTo: MemberType;
    groupId: string;
  }[];
};

export type GroupDetailsRequest = {
  id: string;
};

export type CreateGroupResponse = {
  success: boolean;
  message: string;
  group: {
    groupName: string;
    members: string[];
    createdBy: string;
    totalExpense: number;
    isSettled: boolean;
    lastSettledAt: string;
    _id: string;
    createdAt: string;
    updatedAt: string;
  };
};

export type CreateGroupRequest = {
  groupName: string;
  members: string[];
};

export type UpdateGroupRequest = {
  members: string[];
};

export type DeleteGroupRequest = GroupDetailsRequest;

export type DeleteGroupResponse = {
  success: boolean;
  message: string;
};

export type CreateGroupTransactionResponse = {
  message: string;
  transaction: {
    amount: number;
    transactionDate: string;
    note: string;
    userId: string;
    groupId: string;
    splitType: "percentage" | "value";
    splitDetails: {
      [userId: string]: number;
    };
  };
  updatedGroup: {
    unsettledAmount: number;
    groupName: string;
    members: string[];
    createdBy: string;
    totalExpense: number;
    isSettled: boolean;
    lastSettledAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  };
};

export type CreateGroupTransactionRequest = {
  amount: number;
  transactionDate: string;
  note: string;
  groupId: string;
  splitType: "percentage" | "value";
  splitDetails: {
    [userId: string]: number;
  };
};
