import type React from "react";
import { Typography } from "@mui/material";

type HeaderProps = {
  headerStr: string;
};

const Header: React.FC<HeaderProps> = ({ headerStr }) => (
  <Typography
    variant="body2"
    fontWeight={600}
    sx={{ textWrap: "nowrap" }}
  >
    {headerStr}
  </Typography>
);

export default Header;
