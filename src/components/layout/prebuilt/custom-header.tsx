"use client";

import { ColorModeContext } from "@/contexts";
import { theme } from "antd";
import React, { FC, useContext } from "react";
import { Header, Space } from "@/uicomponents/layout";
import { Switch } from "@/uicomponents";
import { LanguageSelector } from "../language-selector";
import { UserProfile } from "../user-profile";

const { useToken } = theme;

interface ICustomHeaderProps {
  sticky: boolean;
}

export const CustomHeader: FC<ICustomHeaderProps> = ({
  sticky,
}) => {
  const { token } = useToken();
  const { mode, setMode } = useContext(ColorModeContext);

  const headerStyles: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: "0px 24px",
    height: "64px",
  };

  if (sticky) {
    headerStyles.position = "sticky";
    headerStyles.top = 0;
    headerStyles.zIndex = 1;
  }

  return (
    <Header style={headerStyles}>
      <Space>
        <LanguageSelector />
        <Switch
          checkedChildren="🌛"
          unCheckedChildren="🔆"
          onChange={() => setMode(mode === "light" ? "dark" : "light")}
          defaultChecked={mode === "dark"}
        />
        <UserProfile />
      </Space>
    </Header>
  );
};
