import React from "react";
import { UserApis, type InvitationType } from "../../../redux/services/user";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { CircularProgress } from "@mui/material";

type InvitaionBoxProps = {
  invitationObj: InvitationType;
};

const InvitaionBox: React.FC<InvitaionBoxProps> = ({ invitationObj }) => {
  const { inviteBy, sharedGroupId, _id } = invitationObj;
  const [notificationTrigger, { isLoading }] =
    UserApis.useInviteActionMutation();
  const handleInvite = (status: "accept" | "reject") => {
    notificationTrigger({
      status,
      sharedGroupId: sharedGroupId._id,
      invitationId: _id,
    });
  };
  return (
    <Box component={Paper}>
      <Typography p={1} variant="h5">
        You are invited!
      </Typography>
      <Divider />
      <Box sx={{ p: 1 }}>
        <Typography>
          <Typography fontWeight={600}>
            {inviteBy.firstname} {inviteBy.lastname} (@{inviteBy.username})
          </Typography>
          has invited you to join
          <Typography fontWeight={600}>{sharedGroupId.groupName}</Typography>
        </Typography>
        <Stack
          direction="row"
          marginTop={2}
          spacing={1}
          justifyContent="flex-end"
        >
          {isLoading && <CircularProgress />}
          <Button
            size="small"
            variant="contained"
            color="success"
            disabled={isLoading}
            onClick={() => handleInvite("accept")}
          >
            Accept
          </Button>
          <Button
            size="small"
            variant="contained"
            color="error"
            disabled={isLoading}
            onClick={() => handleInvite("reject")}
          >
            Reject
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default InvitaionBox;
