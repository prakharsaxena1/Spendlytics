import { Container, Slide } from "@mui/material";
import React from "react";

type SlideTabProps = {
  inCondition: boolean;
  direction?: "up" | "down" | "left" | "right";
  children?: React.JSX.Element;
};

const SlideTab: React.FC<SlideTabProps> = ({
  direction = "up",
  inCondition,
  children,
}) => (
  <Slide
    direction={direction}
    in={inCondition}
    timeout={240}
    easing="ease-in-out"
  >
    <Container maxWidth="sm" sx={{ position: "absolute", left: 0, right: 0 }}>
      {children}
    </Container>
  </Slide>
);

export default SlideTab;
