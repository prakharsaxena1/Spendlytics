import type { MemberType } from "../user";

export type AllGroupResponse = CommonResponse & {
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
export type GroupDetailsResponse = CommonResponse & {
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
  invitedMembers: {
    _id: string;
    inviteBy: string;
    inviteTo: MemberType;
    groupId: string;
  }[];
};

export type GroupDetailsRequest = {
  groupId: string;
};

export type CreateGroupResponse = CommonResponse;

export type CreateGroupRequest = {
  groupName: string;
  members: string[];
};

export type AddGroupMembersRequest = {
  groupId: string;
  members: string[];
};

export type AddGroupMembersResponse = CommonResponse;

export type RemoveGroupMemberRequest = {
  groupId: string;
  member: string;
};

export type RemoveGroupMemberResponse = CommonResponse;

export type UpdateGroupNameRequest = {
  groupId: string;
  groupName: string;
};

export type DeleteGroupRequest = GroupDetailsRequest;

export type DeleteGroupResponse = CommonResponse;
