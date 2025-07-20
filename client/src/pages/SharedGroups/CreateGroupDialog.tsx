import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import { SlideUpTransition } from "../../components/common/SlideupDialog";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import FormInput from "../../components/common/FormInput";
import MemberAutocomplete from "./MembersAutocomplete";
import type { MemberType } from "../../redux/services/user";
import { SharedGroupApis } from "../../redux/services/sharedgroup";

type CreateGroupDialogProps = {
  open: boolean;
  handleClose: () => void;
};

const CreateGroupDialog: React.FC<CreateGroupDialogProps> = ({
  open,
  handleClose,
}) => {
  const [name, setName] = React.useState<string>("");
  const [errorName, setErrorName] = React.useState<boolean>(false);
  const [errorMembers, setErrorMembers] = React.useState<boolean>(false);
  const [members, setMembers] = React.useState<MemberType[]>([]);

  const [createGroupTrigger, { isLoading, isError }] =
    SharedGroupApis.useCreateSharedGroupMutation();

  const handleGroupCreation = () => {
    let isValid = true;
    if (name.trim() === "") {
      setErrorName(true);
      isValid = false;
    } else {
      setErrorName(false);
    }
    if (members.length === 0) {
      setErrorMembers(true);
      isValid = false;
    } else {
      setErrorMembers(false);
    }
    if (isValid) {
      const memberIds = members.map((member) => member._id);
      createGroupTrigger({ groupName: name, members: memberIds })
        .unwrap()
        .then(() => {
          setName("");
          setMembers([]);
          handleClose();
        })
        .catch((error) => {
          console.error("Error creating group:", error);
        });
    }
  };

  const handleDialogClose = () => {
    setName("");
    setMembers([]);
    setErrorName(false);
    setErrorMembers(false);
    handleClose();
  };

  return (
    <Dialog
      open={open}
      slots={{
        transition: SlideUpTransition,
      }}
      onClose={handleDialogClose}
      maxWidth="xl"
    >
      <DialogTitle sx={{ bgcolor: "#ECF0F1" }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <AddIcon />
            <Typography variant="h5">Create group</Typography>
          </Stack>
          <IconButton onClick={handleDialogClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ p: 3, width: 500 }}>
          <Stack
            height="100%"
            direction="column"
            spacing={2}
            alignItems="center"
          >
            <FormInput
              label="Group name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="The fantastic 4"
              error={errorName}
              helperText={errorName ? "Group name is required" : ""}
            />
            <MemberAutocomplete
              members={members}
              setMembers={setMembers}
              isError={errorMembers}
              setIsError={setErrorMembers}
            />
            {isError && (
              <Typography color="error">Error creating group</Typography>
            )}
            <Button
              loading={isLoading}
              variant="contained"
              onClick={handleGroupCreation}
            >
              Create
            </Button>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupDialog;
