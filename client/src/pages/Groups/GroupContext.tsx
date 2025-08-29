// GroupContext.tsx
import React, { createContext, useState, useContext, useEffect } from "react";
import {
  GroupApis,
  type GroupDetailsResponse,
  type GroupTransactionFullType,
} from "../../redux/services/group";
import { useParams } from "react-router-dom";
import { Stack, Typography } from "@mui/material";

type GroupContextType = {
  group: GroupDetailsResponse["group"] | null;
  invitedMembers: GroupDetailsResponse["invitedMembers"] | null;
  transaction: GroupTransactionFullType | null;
  setTransaction: React.Dispatch<
    React.SetStateAction<GroupTransactionFullType | null>
  >;
};

const GroupContext = createContext<GroupContextType | undefined>(undefined);

export const GroupProvider = ({ children }: { children: React.ReactNode }) => {
  const { id } = useParams();
  const [transaction, setTransaction] =
    useState<GroupTransactionFullType | null>(null);

  const [GroupDetailTrigger, { data }] = GroupApis.useLazyGetGroupDetailsQuery();

  useEffect(() => {
    if (id) {
      GroupDetailTrigger({ groupId: id });
    }
  }, [GroupDetailTrigger, id]);

  if (!id) {
    return (
      <Stack flexGrow={1} alignItems="center" justifyContent="center">
        <Typography variant="h4" color="textSecondary">
          Select a group
        </Typography>
      </Stack>
    );
  }

  return (
    <GroupContext.Provider
      value={{
        group: data?.group || null,
        transaction,
        setTransaction,
        invitedMembers: data?.invitedMembers || null,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};

export const useGroupContext = () => {
  const context = useContext(GroupContext);
  if (!context) {
    throw new Error("useGroupContext must be used within a GroupProvider");
  }
  return context;
};
