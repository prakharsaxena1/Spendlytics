import React from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import ProtectedRoute from "../Auth/ProtectedRoute";
// import CssBaseline from "@mui/material/CssBaseline";
// import { ThemeProvider } from "@mui/material";
// import theme from "./themes/default";

const Layout: React.FC = () => {
  return (
    <ProtectedRoute>
      <Box sx={{ height: "100vh" }}>
        <Stack direction="row" height="100%">
          <Sidebar />
          <Stack direction="column" flexGrow={1} sx={{ overflow: "hidden" }}>
            <Outlet />
          </Stack>
        </Stack>
      </Box>
    </ProtectedRoute>
  );
};

// const ThemedLayout: React.FC = () => (
//   <ThemeProvider theme={theme}>
//     <CssBaseline />
//     <Layout />
//   </ThemeProvider>
// );

export default Layout;
