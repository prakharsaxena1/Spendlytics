import React, { useEffect, useState } from "react";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";
import { Button, ButtonBase } from "@mui/material";
import MoreVert from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import GroupIcon from "@mui/icons-material/Group";
import Options from "./Options";
import Members from "./Members";
import { GroupApis } from "../../../redux/services/group";
import { useAppSelector } from "../../../redux/hooks";
import { CurrentUserSelector } from "../../../redux/slices/auth/selector";
import FormSlideupDialog from "../../../components/common/FormSlideupDialog";
import GroupExpenseForm from "./GroupExpenseForm";

const GroupDetails: React.FC = () => {
  const { id } = useParams();
  const user = useAppSelector(CurrentUserSelector);
  const [openCreateGroupExpense, setOpenCreateGroupExpense] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorElMembers, setAnchorElMembers] = useState<null | HTMLElement>(
    null
  );
  const [GroupDetailTrigger, { data }] =
    GroupApis.useLazyGetGroupDetailsQuery();

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

  const handleOpenCreateGroupExpenseDialog = () => {
    setOpenCreateGroupExpense(true);
  };

  const handleCloseCreateGroupExpenseDialog = () => {
    setOpenCreateGroupExpense(false);
  };

  useEffect(() => {
    if (id) {
      GroupDetailTrigger({ id });
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
    <Stack flexGrow={1}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        p={1}
      >
        <Typography variant="h5">{data?.group?.groupName}</Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          {data?.group && data.group.members.length > 1 && (
            <Button
              startIcon={<AddIcon />}
              variant="contained"
              size="small"
              color="inherit"
              onClick={handleOpenCreateGroupExpenseDialog}
            >
              expense
            </Button>
          )}
          <ButtonBase
            sx={{ p: 1, borderRadius: 1 }}
            onClick={handleOpenMenuMembers}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography fontWeight={600}>
                {data?.group.members.length}
              </Typography>
              <GroupIcon />
            </Stack>
          </ButtonBase>
          {user?._id === data?.group.createdBy && (
            <ButtonBase sx={{ p: 1, borderRadius: 1 }} onClick={handleOpenMenu}>
              <MoreVert />
            </ButtonBase>
          )}
        </Stack>
      </Stack>
      <Divider />
      {/* Popup menus */}
      <Members
        anchorEl={anchorElMembers}
        handleCloseMenu={handleCloseMenuMembers}
        groupMembers={data?.group?.members ?? []}
        createrId={data?.group.createdBy ?? ""}
        invitedMembers={data?.invitedMembers ?? []}
      />
      <Options anchorEl={anchorEl} handleCloseMenu={handleCloseMenu} />
      <FormSlideupDialog
        open={openCreateGroupExpense}
        handleClose={handleCloseCreateGroupExpenseDialog}
        title={
          <Stack direction="row" spacing={1} alignItems="center">
            <AddIcon />
            <Typography variant="h5">Create group expense</Typography>
          </Stack>
        }
        content={
          <GroupExpenseForm
            members={data?.group.members ?? []}
            handleClose={handleCloseCreateGroupExpenseDialog}
            groupId={id}
          />
        }
      />
    </Stack>
  );
};

export default GroupDetails;
