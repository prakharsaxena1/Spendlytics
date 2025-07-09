import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Step,
  StepButton,
  Stepper,
  Typography,
} from "@mui/material";
import React from "react";
import { SlideUpTransition } from "../../components/common/SlideupDialog";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import FormInput from "../../components/common/FormInput";
import { SlideTabBox } from "../LoginRegister/styles";
import SlideTab from "../LoginRegister/SlideTab";

type CreateGroupDialogProps = {
  open: boolean;
  handleClose: () => void;
};

const steps = ["Group Name", "Add Members", "Review & Create"];

const CreateGroupDialog: React.FC<CreateGroupDialogProps> = ({
  open,
  handleClose,
}) => {
  const [name, setName] = React.useState<string>("");
  const [members, setMembers] = React.useState<string[]>([]);

  // Steps
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      // Handle group creation logic here
      console.log("Group created with name:", name, members);
      handleClose();
      return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Dialog
      open={open}
      slots={{
        transition: SlideUpTransition,
      }}
      onClose={handleClose}
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
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ p: 3, width: 700 }}>
          <Stepper activeStep={activeStep}>
            {steps.map((label) => (
              <Step key={label}>
                <StepButton color="inherit">{label}</StepButton>
              </Step>
            ))}
          </Stepper>
          <Box sx={{ p: 2, position: "relative", height: 200 }}>
            <Stack height="100%" direction="row">
              <SlideTabBox sx={{ justifyContent: "flex-start" }}>
                <SlideTab inCondition={activeStep === 0} direction="up">
                  <FormInput
                    label="Group name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="The fantastic 4"
                  />
                </SlideTab>
                <SlideTab inCondition={activeStep === 1} direction="up">
                  <FormInput
                    label="Group members"
                    value={members.join(", ")}
                    onChange={(e) => setMembers(e.target.value.split(", ").map((member) => member.trim()))}
                    placeholder="The fantastic 4"
                  />
                </SlideTab>
                <SlideTab inCondition={activeStep === 2} direction="up">
                  <Box>
                    <Typography variant="h6">Review your group</Typography>
                    <Typography variant="body1">Group Name: {name}</Typography>
                    <Typography variant="body1">Group Members: {members.join(", ")}</Typography>
                  </Box>
                </SlideTab>
              </SlideTabBox>
            </Stack>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            {activeStep !== 0 && (
              <Button color="inherit" onClick={handleBack}>
                Back
              </Button>
            )}
            <Box sx={{ flex: "1 1 auto" }} />
            <Button onClick={handleNext}>
              {activeStep === steps.length - 1 ? "Create" : "Next"}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupDialog;
