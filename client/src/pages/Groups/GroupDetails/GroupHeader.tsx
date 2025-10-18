import React, { useState } from "react";
import Button from "@mui/material/Button";
import ButtonBase from "@mui/material/ButtonBase";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import MoreVert from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import GroupIcon from "@mui/icons-material/Group";
import Options from "./Header/GroupOptions";
import GroupMembers from "./Header/GroupMembers";
import FormSlideupDialog from "../../../components/common/FormSlideupDialog";
import GroupExpenseForm from "./GroupExpenseForm";
import { useGroupContext } from "../GroupContext";
import { CurrentUserSelector } from "../../../redux/slices/auth/selector";
import { useAppSelector } from "../../../redux/hooks";

const GroupHeader: React.FC = () => {
  const { group } = useGroupContext();
  const user = useAppSelector(CurrentUserSelector);

  const [openCreateGroupExpense, setOpenCreateGroupExpense] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorElMembers, setAnchorElMembers] = useState<null | HTMLElement>(
    null
  );

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const handleCloseMenuMembers = () => {
    setAnchorElMembers(null);
  };
  const handleOpenMenu = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleOpenMenuMembers = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorElMembers(e.currentTarget);
  };

  const handleOpenGroupExpenseDialog = () => {
    setOpenCreateGroupExpense(true);
  };

  const handleCloseGroupExpenseDialog = () => {
    setOpenCreateGroupExpense(false);
  };

  if (!group) {
    return null;
  }

  const { groupName, members, createdBy } = group;

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        p={1}
      >
        <Typography variant="h5">{groupName}</Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          {members.length > 1 && (
            <Button
              startIcon={<AddIcon />}
              variant="text"
              size="small"
              color="inherit"
              onClick={handleOpenGroupExpenseDialog}
            >
              Expense
            </Button>
          )}
          <ButtonBase
            sx={{ p: 1, borderRadius: 1 }}
            onClick={handleOpenMenuMembers}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography fontWeight={600}>{members.length}</Typography>
              <GroupIcon />
            </Stack>
          </ButtonBase>
          {user?._id === createdBy && (
            <ButtonBase sx={{ p: 1, borderRadius: 1 }} onClick={handleOpenMenu}>
              <MoreVert />
            </ButtonBase>
          )}
        </Stack>
      </Stack>
      {/* Popup menus */}
      <GroupMembers
        anchorEl={anchorElMembers}
        handleCloseMenu={handleCloseMenuMembers}
      />
      <Options anchorEl={anchorEl} handleCloseMenu={handleCloseMenu} />
      <FormSlideupDialog
        open={openCreateGroupExpense}
        handleClose={handleCloseGroupExpenseDialog}
        title={
          <Stack direction="row" spacing={1} alignItems="center">
            <AddIcon />
            <Typography variant="h5">Create group expense</Typography>
          </Stack>
        }
        content={
          <GroupExpenseForm
            members={members}
            handleClose={handleCloseGroupExpenseDialog}
          />
        }
      />
    </>
  );
};

export default GroupHeader;
