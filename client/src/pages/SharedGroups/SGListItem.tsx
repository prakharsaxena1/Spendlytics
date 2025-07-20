import React from "react";
import ButtonBase from "@mui/material/ButtonBase";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
// import { selectGroup } from "../../redux/slices/sharedGroup/slice";
// import { useAppDispatch } from "../../redux/hooks";
import { useNavigate } from "react-router-dom";
import type { AllSharedGroupResponse } from "../../redux/services/sharedgroup";
import { getFormattedDate } from "../../utils/helper";
import { Box } from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";

type SGListItemProps = {
  sharedGroupDetails: AllSharedGroupResponse["sharedGroups"][number];
};

const SGListItem: React.FC<SGListItemProps> = ({ sharedGroupDetails }) => {
  const navigate = useNavigate();
  const { _id, groupName, totalExpense, updatedAt } = sharedGroupDetails;

  const handleSelect = () => {
    navigate(`/app/shared-groups/${_id}`);
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

export default SGListItem;
