import { Text } from "@/uicomponents";
import React, { FC } from "react";
import { ILinkSent } from "../types";
import { Translate } from "@/components/i18n";

interface IForgotPasswordSubtitleProps extends ILinkSent {
  email: string;
}
export const ForgotPasswordSubtitle: FC<IForgotPasswordSubtitleProps> = ({
  isLinkSent,
  email,
}) => {
  const style = {
    marginBottom: (!isLinkSent && "1.5rem") || 0,
    color: "#fff",
    fontWeight: 500,
  };

  return (
    <Text style={style}>
      <Translate
        i18nKey="form.forgotPassword.messageLinkReceived"
        options={{ email }}
        show={isLinkSent}
      />
      <Translate
        i18nKey="form.forgotPassword.messageResetPassword"
        show={!isLinkSent}
      />
    </Text>
  );
};
