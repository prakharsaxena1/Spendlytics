import React from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAppSelector } from "../../redux/hooks";
import { IsLoadingSelector } from "../../redux/slices/auth/selector";
import Loader from "../common/Loader";
// import CssBaseline from "@mui/material/CssBaseline";
// import { ThemeProvider } from "@mui/material";
// import theme from "./themes/default";

const Layout: React.FC = () => {
  const isLoading = useAppSelector(IsLoadingSelector);
  return (
    <Box sx={{ height: "100vh" }}>
      <Stack direction="row" height="100%">
        <Sidebar />
        <Stack direction="column" flexGrow={1} sx={{ overflow: "hidden" }}>
          {isLoading ? (
            <Box sx={{ position: "absolute", inset: 0 }}>
              <Loader />
            </Box>
          ) : (
            <Outlet />
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

// const ThemedLayout: React.FC = () => (
//   <ThemeProvider theme={theme}>
//     <CssBaseline />
//     <Layout />
//   </ThemeProvider>
// );

export default Layout;
