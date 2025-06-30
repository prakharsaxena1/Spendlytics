import React, { useRef } from "react";
import { Box, Stack } from "@mui/material";
import Topbar from "./Topbar";
import Hero from "./sections/Hero";
import Howitworks from "./sections/Howitworks";
import Features from "./sections/Features";
import Footer from "./sections/Footer";

const LandingPage: React.FC = () => {
  const featuresRef = useRef(null);
  const howItWorksRef = useRef(null);

  return (
    <Box>
      <Stack>
        {/* Appbar */}
        <Topbar featuresRef={featuresRef} howItWorksRef={howItWorksRef} />
        {/* Hero section and CTA */}
        <Hero />
        {/* Features */}
        <Features ref={featuresRef} />
        {/* How it works */}
        <Howitworks ref={howItWorksRef} />
        {/* Footer */}
        <Footer />
      </Stack>
    </Box>
  );
};

export default LandingPage;
