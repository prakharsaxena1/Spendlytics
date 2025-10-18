import React, { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuList from "@mui/material/MenuList";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import MemberItem from "./MemberItem";
import SlideupDialog from "../../../../components/common/SlideupDialog";
import type { MemberType } from "../../../../redux/services/user";
import { useAppSelector } from "../../../../redux/hooks";
import { CurrentUserSelector } from "../../../../redux/slices/auth/selector";
import MemberAutocomplete from "../../MembersAutocomplete";
import { useGroupContext } from "../../GroupContext";

type GroupMembersProps = {
  anchorEl: null | HTMLElement;
  handleCloseMenu: () => void;
};

const GroupMembers: React.FC<GroupMembersProps> = ({
  anchorEl,
  handleCloseMenu,
}) => {
  const user = useAppSelector(CurrentUserSelector);
  const { group, invitedMembers } = useGroupContext();

  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<MemberType | null>(null);

  const [errorMembers, setErrorMembers] = React.useState<boolean>(false);
  const [members, setMembers] = React.useState<MemberType[]>([]);

  // Invite
  const handleOpenInviteDialog = () => {
    setInviteDialogOpen(true);
  };
  const handleCloseInviteDialog = () => {
    setInviteDialogOpen(false);
  };
  const handleInviteGroupMember = () => {
    handleOpenInviteDialog();
    handleCloseMenu();
  };

  // Delete
  const handleOpenDeleteDialog = (member: MemberType) => {
    setDeleteDialogOpen(true);
    setSelectedMember(member);
  };
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedMember(null);
  };
  const handleDeleteGroupMember = (member: MemberType) => {
    handleOpenDeleteDialog(member);
    handleCloseMenu();
  };

  const createrId = group?.createdBy

  return (
    <>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Box sx={{ width: 320 }}>
          <Typography variant="h6" align="center">
            Members
          </Typography>
          <Divider />
          <MenuList sx={{ p: 0, maxHeight: "480px" }}>
            {group?.members.map((member) => (
              <MemberItem
                key={member._id}
                member={member}
                canRemoveMember={
                  createrId !== member._id && createrId === user?._id
                }
                handleDeleteGroupMember={handleDeleteGroupMember}
              />
            ))}
            {invitedMembers?.map((member) => (
              <MemberItem
                key={member._id}
                isInvited
                member={member.inviteTo}
                canRemoveMember={
                  createrId !== member._id && createrId === user?._id
                }
                handleDeleteGroupMember={handleDeleteGroupMember}
              />
            ))}
          </MenuList>
          {createrId === user?._id && (
            <Stack direction="row" justifyContent="center" sx={{ p: 1 }}>
              <Button
                size="small"
                variant="contained"
                startIcon={<PersonAddIcon />}
                onClick={handleInviteGroupMember}
              >
                Invite
              </Button>
            </Stack>
          )}
        </Box>
      </Menu>
      {/* Delete */}
      <SlideupDialog
        title="Remove member from group"
        message={`Are you sure you want to remove @${selectedMember?.username} from this group?`}
        open={deleteDialogOpen}
        handleClose={handleCloseDeleteDialog}
      >
        <DialogActions>
          <Button color="inherit" onClick={handleCloseDeleteDialog}>
            No
          </Button>
          <Button color="inherit" onClick={handleCloseDeleteDialog}>
            Yes
          </Button>
        </DialogActions>
      </SlideupDialog>
      {/* Invite member */}
      <SlideupDialog
        title="Add members to group"
        message={
          <Box sx={{ p: 3, width: 500 }}>
            <Stack
              height="100%"
              direction="column"
              spacing={2}
              alignItems="center"
            >
              <MemberAutocomplete
                members={members}
                setMembers={setMembers}
                isError={errorMembers}
                setIsError={setErrorMembers}
              />
              <Button
                size="small"
                variant="contained"
                startIcon={<PersonAddIcon />}
              >
                Invite
              </Button>
            </Stack>
          </Box>
        }
        open={inviteDialogOpen}
        handleClose={handleCloseInviteDialog}
      />
    </>
  );
};

export default GroupMembers;
