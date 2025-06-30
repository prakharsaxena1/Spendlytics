import { useNavigate, useSearchParams } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { styled } from "@mui/material";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { useEffect } from "react";
import { Flip, ToastContainer } from "react-toastify";
import SVGImg from "../../components/common/SVGImg";
import SlideTab from "./SlideTab";

const SlideTabBox = styled(Stack)({
  flexGrow: 1,
  overflow: "hidden",
  justifyContent: "center",
  position: "relative",
});

const LoginRegister = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");

  useEffect(() => {
    if (!tab && navigate) {
      navigate("/account?tab=login");
    }
  }, [navigate, tab]);

  const isLogin = tab === "login";

  return (
    <Box sx={{ height: "100vh" }}>
      <Stack height="100%" direction="row" bgcolor={"ghostwhite"}>
        {/* Art */}
        <SlideTabBox sx={{ display: { xs: "none", md: "flex" } }}>
          <SlideTab inCondition={isLogin}>
            <SVGImg imgsrc="/login.svg" />
          </SlideTab>
          <SlideTab inCondition={!isLogin}>
            <SVGImg imgsrc="/register.svg" />
          </SlideTab>
        </SlideTabBox>
        {/* Form */}
        <SlideTabBox>
          <SlideTab direction="down" inCondition={isLogin}>
            <LoginForm />
          </SlideTab>
          <SlideTab direction="down" inCondition={!isLogin}>
            <RegisterForm />
          </SlideTab>
        </SlideTabBox>
      </Stack>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Flip}
      />
    </Box>
  );
};

export default LoginRegister;
