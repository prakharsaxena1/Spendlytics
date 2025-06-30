export type UserType = {
  _id: string;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  totalBalance: number;
  avatar: string;
  hasProvidedStartingBalance: boolean;
  level: number;
  createdAt: string;
  updatedAt: string;
};

export type LoginRegisterResponse = {
  message: string;
  user: UserType;
};


export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
};

export type LogoutResponse = {
  message: string;
};

export type GetCurrentUserResponse = {
  user: UserType;
};
