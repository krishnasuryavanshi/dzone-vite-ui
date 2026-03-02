import React from "react";
import { useTranslation } from "react-i18next";
import { useGetLocale, useSetLocale } from "@refinedev/core";
import { Space } from "@/uicomponents/layout";
import { Avatar, Button, Dropdown } from "@/uicomponents";
import { Menu, MenuItem } from "@/uicomponents/menu";
import { DownOutlined } from "@/uicomponents/icons";

export const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const locale = useGetLocale();
  const changeLanguage = useSetLocale();
  const currentLocale = locale();

  const menu = (
    <Menu selectedKeys={currentLocale ? [currentLocale] : []}>
      {[...(i18n.languages || [])].sort().map((lang: string) => (
        <MenuItem
          key={lang}
          onClick={() => changeLanguage(lang)}
          icon={
            <span style={{ marginRight: 8 }}>
              <Avatar size={16} src={`/images/flags/${lang}.svg`} />
            </span>
          }
        >
          {lang === "en" ? "English" : "German"}
        </MenuItem>
      ))}
    </Menu>
  );

  return (
    <Dropdown overlay={menu}>
      <Button type="link">
        <Space>
          <Avatar size={16} src={`/images/flags/${currentLocale}.svg`} />
          {currentLocale === "en" ? "English" : "German"}
          <DownOutlined />
        </Space>
      </Button>
    </Dropdown>
  );
};
