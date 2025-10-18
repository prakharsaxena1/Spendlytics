import React from "react";
import IconButton from "@mui/material/IconButton";
import Close from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { MemberType } from "../../../../redux/services/user";

type MemberItemProps = {
  member: MemberType;
  canRemoveMember: boolean;
  handleDeleteGroupMember: (member: MemberType) => void;
  isInvited?: boolean;
};

const MemberItem: React.FC<MemberItemProps> = ({
  member,
  canRemoveMember = false,
  handleDeleteGroupMember,
  isInvited,
}) => {
  return (
    <>
      <Box sx={{ px: 1, py: 0.5 }}>
        <Stack
          direction="row"
          p={0}
          alignItems="center"
          justifyContent="space-between"
        >
          <Box>
            {isInvited && (
              <Typography variant="caption" color="textSecondary">
                Invited
              </Typography>
            )}
            <Stack direction="column">
              <Typography fontWeight={600} variant="body2">
                {member.firstname} {member.lastname}
              </Typography>
              <Typography fontStyle="italic" variant="caption">
                @{member.username}
              </Typography>
            </Stack>
          </Box>
          {canRemoveMember && (
            <IconButton
              size="small"
              onClick={() => handleDeleteGroupMember(member)}
            >
              <Close fontSize="small" />
            </IconButton>
          )}
        </Stack>
      </Box>
      <Divider />
    </>
  );
};

export default MemberItem;
