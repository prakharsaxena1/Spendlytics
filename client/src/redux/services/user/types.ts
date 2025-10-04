import type { UserType } from "../auth";
import type { TransactionItemType } from "../transaction/types";

export type MemberType = {
  _id: string;
  username: string;
  level: number;
  firstname: string;
  lastname: string;
};

export type InvitationType = {
  _id: string;
  inviteBy: {
    _id: string;
    username: string;
    firstname: string;
    lastname: string;
  };
  inviteTo: string;
  group: {
    _id: string;
    groupName: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type SearchMemberResponse = {
  success: boolean;
  users: MemberType[];
};

export type SearchMemberRequest = {
  username: string;
};

export type NotificationsResponse = {
  success: boolean;
  invitations: InvitationType[];
};

export type InviteActionResponse = CommonResponse;

export type InviteActionRequest = {
  status: "accept" | "reject";
  invitationId: string;
  groupId: string;
};

export type UpdateAppSettingsRequest = UserType["appearanceSettings"];

export type CategoryTotals = Record<TransactionItemType["category"], number>

export interface MonthDetail {
  month: string;
  detail: CategoryTotals;
}

export interface DashboardDetailsResponse {
  success: boolean;
  message: string;
  totalPercentage: CategoryTotals;
  monthDetails: MonthDetail[];
  totalByCategory: CategoryTotals;
}
