import React from "react";
import { TxTableProvider } from "./TransactionTableContext";
import TransactionsUI from "./TransactionsUI";

const Transactions: React.FC = () => {
  return (
    <TxTableProvider>
      <TransactionsUI />
    </TxTableProvider>
  );
};

export default Transactions;
