import React, { useState } from "react";
import { Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import FormInput from "../../components/common/FormInput";
import { toast } from "react-toastify";
import LoginRegisterContainer from "./LoginRegisterContainer";
import { AuthApis } from "../../redux/services/auth";

const sanitizeName = (value: string) => value.replace(/[^a-zA-Z]/g, "");

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [registerMutation, { isLoading }] = AuthApis.useRegisterMutation();

  const gotoLogin = () => {
    navigate("/account?tab=login");
  };

  const handleRegister = () => {
    if (!username) {
      toast.error("Username field cannot be empty");
      return;
    }
    if (!firstname) {
      toast.error("First name field cannot be empty");
      return;
    }
    if (!lastname) {
      toast.error("Last name field cannot be empty");
      return;
    }
    if (!email) {
      toast.error("Email field cannot be empty");
      return;
    }
    if (!password) {
      toast.error("Password field cannot be empty");
      return;
    }
    const loginPromise = registerMutation({
      firstname: firstname.toLowerCase(),
      lastname: lastname.toLowerCase(),
      username,
      email,
      password,
    })
      .unwrap()
      .then(() => {
        navigate("/app/dashboard", { replace: true });
      });
    toast.promise(loginPromise, {
      pending: "Loggin you in",
      success: "Login successful",
      error: {
        render: ({ data }: { data: { message: string } }) =>
          data.message as string,
      },
    });
  };
  return (
    <LoginRegisterContainer
      label="Already have an account?"
      action={gotoLogin}
      actionLabel="Sign in!"
      formLabel={"Create an account"}
    >
      <Stack direction="column" spacing={2} alignItems="center">
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ width: "100%" }}
        >
          <FormInput
            label="First Name"
            value={firstname}
            onChange={(e) => setFirstname(sanitizeName(e.target.value))}
            placeholder="John"
          />
          <FormInput
            label="Last Name"
            value={lastname}
            onChange={(e) => setLastname(sanitizeName(e.target.value))}
            placeholder="Wick"
          />
        </Stack>
        <FormInput
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="example@email.com"
        />
        <FormInput
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Thunder_1337"
        />
        <FormInput
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="****"
        />
        <Button variant="contained" onClick={handleRegister} disabled={isLoading}>
          Register
        </Button>
      </Stack>
    </LoginRegisterContainer>
  );
};

export default RegisterForm;
