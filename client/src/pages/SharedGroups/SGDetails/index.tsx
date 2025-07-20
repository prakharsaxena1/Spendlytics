import React, { useEffect, useState } from "react";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";
import { Button, ButtonBase } from "@mui/material";
import { MoreVert, Add } from "@mui/icons-material";
import GroupIcon from "@mui/icons-material/Group";
import SGOptions from "./SGOptions";
import SGMembers from "./SGMembers";
import { SharedGroupApis } from "../../../redux/services/sharedgroup";
import { useAppSelector } from "../../../redux/hooks";
import { CurrentUserSelector } from "../../../redux/slices/auth/selector";
import CreateGroupExpense from "./CreateGroupExpense";

const SGDetails: React.FC = () => {
  const { id } = useParams();
  const user = useAppSelector(CurrentUserSelector);
  const [openCreateGroupExpense, setOpenCreateGroupExpense] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorElMembers, setAnchorElMembers] = useState<null | HTMLElement>(
    null
  );
  const [SGDetailTrigger, { data }] =
    SharedGroupApis.useLazyGetSharedGroupDetailsQuery();

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
      SGDetailTrigger({ id });
    }
  }, [SGDetailTrigger, id]);

  if (!id) {
    return (
      <Stack flexGrow={1} alignItems="center" justifyContent="center">
        <Typography variant="h4" color="textSecondary">
          Select a shared group
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
        <Typography variant="h5">{data?.sharedGroup?.groupName}</Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Button
            startIcon={<Add />}
            variant="contained"
            size="small"
            color="inherit"
            onClick={handleOpenCreateGroupExpenseDialog}
          >
            expense
          </Button>
          <ButtonBase
            sx={{ p: 1, borderRadius: 1 }}
            onClick={handleOpenMenuMembers}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography fontWeight={600}>
                {data?.sharedGroup.members.length}
              </Typography>
              <GroupIcon />
            </Stack>
          </ButtonBase>
          {user?._id === data?.sharedGroup.createdBy && (
            <ButtonBase sx={{ p: 1, borderRadius: 1 }} onClick={handleOpenMenu}>
              <MoreVert />
            </ButtonBase>
          )}
        </Stack>
      </Stack>
      <Divider />
      <SGMembers
        anchorEl={anchorElMembers}
        handleCloseMenu={handleCloseMenuMembers}
        groupMembers={data?.sharedGroup?.members ?? []}
        createrId={data?.sharedGroup.createdBy ?? ""}
        invitedMembers={data?.invitedMembers ?? []}
      />
      <SGOptions anchorEl={anchorEl} handleCloseMenu={handleCloseMenu} />
      <CreateGroupExpense open={openCreateGroupExpense} handleClose={handleCloseCreateGroupExpenseDialog} />
    </Stack>
  );
};

export default SGDetails;
