"use client";

import React from "react";
import { Text } from "@/uicomponents";
import { Translate } from "@/components/i18n";

export const Copyright = () => {
  return (
    <Text style={{ color: "#fff", textAlign: "center" }}>
      <Translate i18nKey="pages.copyright" />
    </Text>
  );
};
