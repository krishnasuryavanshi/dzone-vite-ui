import React from "react";
import { useTranslation } from "react-i18next";
import { useGetLocale, useSetLocale } from "@/lib/hooks/use-i18n";
import { Space } from "@/uicomponents/layout";
import { Avatar, Button, Dropdown } from "@/uicomponents";
import { Menu, MenuItem } from "@/uicomponents/menu";
import { DownOutlined } from "@/uicomponents/icons";

export const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const locale = useGetLocale();
  const changeLanguage = useSetLocale();
  const currentLocale = locale();

  const menuItems = [...(i18n.languages || [])].sort().map((lang: string) => ({
    key: lang,
    label: lang === "en" ? "English" : "German",
    icon: (
      <span style={{ marginRight: 8 }}>
        <Avatar size={16} src={`/images/flags/${lang}.svg`} />
      </span>
    ),
    onClick: () => changeLanguage(lang),
  }));

  return (
    <Dropdown menu={{ items: menuItems, selectedKeys: currentLocale ? [currentLocale] : [] }}>
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
