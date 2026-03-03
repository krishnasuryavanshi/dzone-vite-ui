import { DzTheme } from "@/components/layout/v1";
import React, { FC, PropsWithChildren } from "react";

export const AuthPageLayout: FC<PropsWithChildren> = ({ children }) => {
  return <DzTheme theme="blueV1">{children}</DzTheme>;
};
