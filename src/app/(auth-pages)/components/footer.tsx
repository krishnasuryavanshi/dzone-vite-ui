"use client";

import React from "react";
import { Text } from "@/uicomponents";
import { TermsOfuse } from "./terms-of-use";
import { PrivacyPolicy } from "./privacy-policy";
import { Flex } from "@/uicomponents/layout";
import { Translate } from "@/components/i18n";

export const Footer = () => {
  return (
    <Flex align="center" justify="center">
      <Text style={{ color: "#fff" }}>
        <Translate i18nKey="pages.termsAndPolicies" addSpaceAfter/>
        <TermsOfuse />
        <Translate i18nKey="and" addSpaceAfter addSpaceBefore/>
        <PrivacyPolicy />
      </Text>
    </Flex>
  );
};
