"use client";
import BirthDayModal from "@/components/birthday-modal";
import ProModal from "@/components/pro-modal";
import FeaturesModal from "@/components/features-modal";
import AboutModal from "@/components/about-modal";
import React from "react";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = React.useState(false);

  // Use useLayoutEffect pattern for mounting
  React.useLayoutEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <>
      <ProModal />
      <FeaturesModal />
      <AboutModal />
      <BirthDayModal />
    </>
  );
};

export default ModalProvider;
