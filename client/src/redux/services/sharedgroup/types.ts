import type { TransactionItemType } from "../transaction/types";
import type { MemberType } from "../user";

export type AllSharedGroupResponse = {
  success: boolean;
  sharedGroups: {
    _id: string;
    groupName: string;
    totalExpense: number;
    isSettled: boolean;
    updatedAt: string;
    createdAt: string;
    memberCount: number;
  }[];
};

export type SharedGroupDetailsResponse = {
  success: boolean;
  sharedGroup: {
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
    sharedGroupId: string;
  }[];
};

export type SharedGroupDetailsRequest = {
  id: string;
};

export type CreateSharedGroupResponse = {
  success: boolean;
  message: string;
  sharedGroup: {
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

export type CreateSharedGroupRequest = {
  groupName: string;
  members: string[];
};

export type UpdateSharedGroupRequest = {
  members: string[];
};

export type DeleteSharedGroupRequest = SharedGroupDetailsRequest;

export type DeleteSharedGroupResponse = {
  success: boolean;
  message: string;
};
