
import React, { useState } from "react";

import { SendLinkButton } from "./send-link-button";

import { EmailLinkSent } from "./email-link-sent";
import { ForgotPasswordTitle } from "./forgot-password-title";
import { ForgotPasswordSubtitle } from "./forgot-password-subtitle";
import { EmailFormControl } from "./email-form-control";
import { ForgotPasswordForm } from "./forgot-password-form";

export const ForgotPasswordFormContainer = () => {
  const [isLinkSent, setIsLinkSent] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState("");

  const handleLinkSent = (isSent: boolean) => {
    setIsLinkSent(isSent);
  };
  const handleSetVerifiedEmail = (email: string) => {
    setVerifiedEmail(email);
  };
  
  return (
    <ForgotPasswordForm
      isLinkSent={isLinkSent}
      verifiedEmail={verifiedEmail}
      handleLinkSent={handleLinkSent}
      handleSetVerifiedEmail={handleSetVerifiedEmail}
    >
      <EmailLinkSent isLinkSent={isLinkSent} />
      <ForgotPasswordTitle isLinkSent={isLinkSent} />
      <ForgotPasswordSubtitle isLinkSent={isLinkSent} email={verifiedEmail} />
      <EmailFormControl isLinkSent={isLinkSent} />
      <SendLinkButton isLinkSent={isLinkSent} />
    </ForgotPasswordForm>
  );
};
