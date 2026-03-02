import React from "react";
import { Layout } from "@/uicomponents/layout";
import { DzContentPanelWrapper } from "./dz-content-panel-wrapper";

const { Content: Panel } = Layout;

export const ContentPanel = ({ children }: { children: React.ReactNode }) => {
  return (
    <Panel style={{ marginTop: "0.5rem" }}>
      <DzContentPanelWrapper>{children}</DzContentPanelWrapper>
    </Panel>
  );
};
