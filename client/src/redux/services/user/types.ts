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

export type SettlementType = {
  groupId: {
    _id: string;
    groupName: string;
  };
  paidBy: {
    _id: string;
    username: string;
    firstname: string;
    lastname: string;
  };
  paidTo: {
    _id: string;
    username: string;
    firstname: string;
    lastname: string;
  };
  amount: number;
  status: string;
  note: string;
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
  settlements: SettlementType[];
};

export type InviteActionResponse = {
  success: boolean;
  message: string;
};

export type InviteActionRequest = {
  status: "accept" | "reject";
  invitationId: string;
  groupId: string;
};
