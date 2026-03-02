import { Translate } from "@/components/i18n";
import { Link } from "@/uicomponents";
import React from "react";

export const ForgotPassword = () => {
  return (
    <Link
      href="/forgot-password"
      style={{ color: "#fff", fontSize: "0.875rem" }}
    >
      <Translate i18nKey="form.login.forgotPassword" />
    </Link>
  );
};
