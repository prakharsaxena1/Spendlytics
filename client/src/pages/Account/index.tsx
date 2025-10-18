import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

interface UserDetails {
  firstName: string;
  lastName: string;
}

const Account: React.FC = () => {
  const [formData, setFormData] = useState<UserDetails>({
    firstName: "",
    lastName: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof UserDetails, string>>
  >({});

  const handleChange = (field: keyof UserDetails, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof UserDetails, string>> = {};
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    console.log("Form submitted:", formData);
  };

  return (
    <Box>
      <Container>
        <Stack spacing={1} sx={{ p: 2 }}>
          <Typography variant="h5" fontWeight={700} letterSpacing={2}>
            Update user details
          </Typography>
          <Divider />
          <Container sx={{ px: 4, py: 2 }}>
            <Stack spacing={2} mb={2}>
              <TextField
                label="First Name"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                error={!!errors.firstName}
                helperText={errors.firstName}
                fullWidth
              />
              <TextField
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                error={!!errors.lastName}
                helperText={errors.lastName}
                fullWidth
              />
            </Stack>
            <Button type="submit" variant="contained" onClick={handleSubmit}>
              Save
            </Button>
          </Container>
        </Stack>
        <Stack spacing={1} sx={{ p: 2 }}>
          <Typography variant="h5" fontWeight={700} letterSpacing={2}>
            Security
          </Typography>
          <Divider />
          <Container sx={{ px: 4, py: 2 }}>
            <Stack spacing={3}>
              {/* Delete Account */}
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom color="error">
                    Delete Account
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Permanently remove your account and all associated data.
                    This action is irreversible — once deleted, your account
                    cannot be recovered.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button variant="contained" color="error">
                    Delete Account
                  </Button>
                </CardActions>
              </Card>

              {/* Reset Account */}
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom color="warning.main">
                    Reset Account
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Clear your account settings, preferences, and temporary
                    data. Your personal information will remain, but the account
                    will be restored to its default state.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button variant="contained" color="warning">
                    Reset Account
                  </Button>
                </CardActions>
              </Card>
            </Stack>
          </Container>
        </Stack>
      </Container>
    </Box>
  );
};

export default Account;
