import React from "react";
import './style.css'
import Stack from "@mui/material/Stack";

const Loader: React.FC = () => {
  return (
    <Stack height="100%" direction="row" alignItems="center" justifyContent="center">
      <div className="spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </Stack>
  );
};

export default Loader;
