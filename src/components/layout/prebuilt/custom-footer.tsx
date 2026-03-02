import { Footer } from "@/uicomponents/layout";
import React from "react";

export const CustomFooter = () => {
  return (
    <Footer
      style={{
        textAlign: "right",
        position: "fixed",
        right: 16,
        bottom: 4,
        backgroundColor: 'transparent',
        padding: 0
      }}
    >
      Copyright, Digitalzone
    </Footer>
  );
};
