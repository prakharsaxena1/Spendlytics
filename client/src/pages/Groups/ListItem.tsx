import React from "react";
import ButtonBase from "@mui/material/ButtonBase";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import type { AllGroupResponse } from "../../redux/services/group";
import { getFormattedDate } from "../../utils/helper";
import { Box } from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";

type ListItemProps = {
  groupDetails: AllGroupResponse["groups"][number];
};

const ListItem: React.FC<ListItemProps> = ({ groupDetails }) => {
  const navigate = useNavigate();
  const { _id, groupName, totalExpense, updatedAt } = groupDetails;

  const handleSelect = () => {
    navigate(`/app/groups/${_id}`);
  };

  return (
    <>
      <ButtonBase onClick={handleSelect} sx={{ p: 1, textAlign: "left" }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            bgcolor: "grey.200",
            borderRadius: "100%",
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <GroupsIcon />
        </Box>
        <Stack
          direction="column"
          ml={1}
          height="100%"
          justifyContent="space-between"
          flexGrow={1}
        >
          <Typography variant="body2" fontWeight={600}>
            {groupName}
          </Typography>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="caption" fontWeight={600}>
              Total: {totalExpense}
            </Typography>
            <Typography
              variant="caption"
              fontWeight={600}
              color="textSecondary"
            >
              Last updated: {getFormattedDate(updatedAt)}
            </Typography>
          </Stack>
        </Stack>
      </ButtonBase>
      <Divider />
    </>
  );
};

export default ListItem;
