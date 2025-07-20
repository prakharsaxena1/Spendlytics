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
  sharedGroupId: {
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

export type InviteActionResponse = {
  success: boolean;
  message: string;
};

export type InviteActionRequest = {
  status: 'accept' | 'reject';
  invitationId: string;
  sharedGroupId: string;
};

