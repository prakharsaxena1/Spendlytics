import { Button, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";
import { toast } from "react-toastify";
import FormInput from "../../components/common/FormInput";
import LoginRegisterContainer from "./LoginRegisterContainer";
import { AuthApis } from "../../redux/services/auth";

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loginTrigger, { isLoading }] = AuthApis.useLoginMutation();

  const gotoRegister = () => {
    navigate("/account?tab=register");
  };

  const handleLogin = () => {
    if (!email) {
      toast.error("Email field cannot be empty");
      return;
    }
    if (!password) {
      toast.error("Password field cannot be empty");
      return;
    }
    const loginPromise = loginTrigger({
      email,
      password,
    })
      .unwrap()
      .then((res) => {
        navigate("/app/dashboard", { replace: true });
        return res.message;
      });
    toast.promise(loginPromise, {
      pending: "Loggin you in",
      success: "Login successful",
      error: {
        render: ({ data }: { data: { data: { message: string } } }) =>
          "Login failed: " + data.data.message,
      },
    });
  };

  return (
    <LoginRegisterContainer
      label="Don't have an account?"
      action={gotoRegister}
      actionLabel="Create one"
      formLabel="Sign-in"
    >
      <Stack spacing={2} marginBottom={2} alignItems="start">
        <Button
          startIcon={<GoogleIcon />}
          variant="outlined"
          sx={{ textTransform: "none" }}
          color="inherit"
          onClick={() => {
            // navigate("/app/dashboard", { replace: true });
          }}
        >
          Sign in with Google
        </Button>
        <Typography>Or continue with email</Typography>
      </Stack>
      <Stack direction="column" spacing={2} alignItems="center">
        <FormInput
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="example@email.com"
        />
        <FormInput
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="****"
        />
        <Button variant="contained" onClick={handleLogin} disabled={isLoading}>
          Login
        </Button>
      </Stack>
    </LoginRegisterContainer>
  );
};

export default LoginForm;
