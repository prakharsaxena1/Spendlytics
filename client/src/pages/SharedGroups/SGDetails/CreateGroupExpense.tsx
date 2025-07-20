import React from "react";
import FormSlideupDialog from "../../../components/common/FormSlideupDialog";

type CreateGroupExpenseProps = {
  open: boolean;
  handleClose: () => void;
};
const CreateGroupExpense: React.FC<CreateGroupExpenseProps> = ({
  open,
  handleClose,
}) => {
  return (
    <FormSlideupDialog
      open={open}
      handleClose={handleClose}
      title={<h3>Create an expense</h3>}
      content={<></>}
    />
  );
};

export default CreateGroupExpense;
