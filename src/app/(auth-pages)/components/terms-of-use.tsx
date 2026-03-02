"use client";

import { Translate } from "@/components/i18n";
import Link from "next/link";
import React from "react";

export const TermsOfuse = () => {
  return (
    <Link href="#" style={{ color: "#fff", textDecoration: "underline" }}>
      <Translate i18nKey="pages.termsOfUse" />
    </Link>
  );
};
