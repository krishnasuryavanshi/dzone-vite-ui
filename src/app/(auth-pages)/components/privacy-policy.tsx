
import { Translate } from "@/components/i18n";
import { Link } from "react-router-dom";
import React from "react";

export const PrivacyPolicy = () => {
  return (
    <Link to="#" style={{ color: "#fff", textDecoration: "underline" }}>
      <Translate i18nKey="pages.privacyPolicy" />
    </Link>
  );
};
