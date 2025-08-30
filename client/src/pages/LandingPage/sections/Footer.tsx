import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box>
      <Stack p={2} alignItems="center" justifyContent="center">
        <Typography>Copyright © Spendlytics {currentYear}.</Typography>
        <Typography fontWeight={600}>
          Made by{" "}
          <Link
            href="https://www.linkedin.com/in/prakharsaxena-/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Prakhar Saxena
          </Link>
        </Typography>
      </Stack>
    </Box>
  );
};

export default Footer;
