
import { Translate } from "@/components/i18n";
import { Link } from "react-router";
import React from "react";

export const TermsOfuse = () => {
  return (
    <Link to="#" style={{ color: "#fff", textDecoration: "underline" }}>
      <Translate i18nKey="pages.termsOfUse" />
    </Link>
  );
};
