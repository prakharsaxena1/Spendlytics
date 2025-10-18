import dayjs from "dayjs";
import type { TransactionItemType } from "../redux/services/transaction/types";

export const TODAY = dayjs().toISOString();

export const CategoryOptions: TransactionItemType["category"][] = [
  "savings",
  "investments",
  "needs",
  "wants",
];
