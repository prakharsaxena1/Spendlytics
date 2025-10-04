export type BalanceBoardResponse = CommonResponse & {
  payments: Record<string, number>;
};
