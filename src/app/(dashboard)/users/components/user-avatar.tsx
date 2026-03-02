import { Avatar } from "@/uicomponents/avatar";
import { UserOutlined } from "@/uicomponents/icons";
import { Image } from "@/uicomponents/image";
import React, { FC } from "react";

interface IUserAvatarProps {
  url?: string;
}

export const UserAvatar: FC<IUserAvatarProps> = ({ url }) => {
  if (url) {
    return (
      <Avatar
        shape="square"
        size={42}
        src={<Image preview={false} src={url} alt="avatar" />}
      />
    );
  }
  return (
    <Avatar
      style={{
        boxShadow: " 0px 0px 4px 0px rgba(35, 90, 237, 0.16)",
      }}
      shape="square"
      size={42}
      icon={<UserOutlined />}
    />
  );
};
