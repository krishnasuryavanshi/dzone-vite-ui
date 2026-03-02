import { Flex } from "@/uicomponents/layout";
import React, { FC } from "react";
import { RememberMe } from "./remember-me";
import { ForgotPassword } from "./forgot-password";

interface IFormFooterProps {
    isFullForm: boolean;
}

export const FormFooter: FC<IFormFooterProps> = ({isFullForm}) => {
  if(!isFullForm) {
    return null;
  }

  return (
    <Flex align="center" justify="space-between">
      <RememberMe />
      <ForgotPassword />
    </Flex>
  );
};
