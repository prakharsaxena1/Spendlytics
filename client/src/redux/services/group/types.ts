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

export type AddGroupMembersRequest = {
  groupId: string;
  members: string[];
};

export type AddGroupMembersResponse = {
  success: boolean;
  message: string;
};

export type RemoveGroupMemberRequest = {
  groupId: string;
  member: string;
};

export type RemoveGroupMemberResponse = {
  success: boolean;
  message: string;
  group: CreateGroupResponse["group"];
};

export type UpdateGroupNameRequest = {
  groupId: string;
  groupName: string;
};

export type DeleteGroupRequest = GroupDetailsRequest;

export type DeleteGroupResponse = {
  success: boolean;
  message: string;
};
