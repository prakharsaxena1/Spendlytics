import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";

const Hero: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        p: 2,
        height: "100lvh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container>
        <Stack spacing={3} alignItems="center" textAlign="center">
          <Typography variant="h2" fontWeight="bold">
            Master Your Money with Ease
          </Typography>
          <Typography variant="h6" sx={{ maxWidth: 600 }}>
            Track expenses & income, set smart budgets, visualize spending, and
            share costs effortlessly — all in one place.
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/app/dashboard")}
            >
              Go to Dashboard
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Hero;
