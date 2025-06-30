import { Button, Container, Paper, Stack, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const ErrorMessageUI = () => {
  const navigate = useNavigate();

  const backToHomeBtnAction = () => {
    navigate("/");
  };
  return (
    <Container maxWidth="sm" component={Paper} sx={{ p: 5 }}>
      <img
          src="/404.svg"
          alt="404icon"
          style={{
            width: "100%",
            height: "auto",
            userSelect: "none",
            pointerEvents: "none",
          }}
        />
      <Typography variant="h3" fontWeight={700}>
        404
      </Typography>
      <Typography variant="h5" gutterBottom>
        Sorry we couldn't find this page.{" "}
      </Typography>
      <Typography sx={{ mb: 4 }}>
        But dont worry, you can find plenty of other things on our homepage.
      </Typography>
      <Button variant="contained" color="warning" onClick={backToHomeBtnAction}>
        go to homepage
      </Button>
    </Container>
  );
};

const ErrorElement: React.FC = () => {
  return (
    <Stack sx={{ position: "absolute", inset: 0 }}>
      <Stack direction="column" flexGrow={1} justifyContent="center">
        <ErrorMessageUI />
      </Stack>
    </Stack>
  );
};

export default ErrorElement;
