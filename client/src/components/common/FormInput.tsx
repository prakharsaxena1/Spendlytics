import {
  Stack,
  TextField,
  Typography,
  type TextFieldProps,
} from "@mui/material";
import React from "react";

// type FormInputProps = {
//   label: string;
//   fieldValue: string;
//   setFieldValue: React.Dispatch<React.SetStateAction<string>>;
//   fieldPlaceholder?: string;
//   fieldType?: React.HTMLInputTypeAttribute;
// };

const FormInput: React.FC<TextFieldProps> = ({ label, ...props }) => (
  <Stack sx={{ width: "100%" }}>
    <Typography fontWeight={700} gutterBottom color={props.disabled ? 'textDisabled' : 'textPrimary'}>
      {label}
    </Typography>
    <TextField size="small" fullWidth {...props} />
  </Stack>
);

export default FormInput;
