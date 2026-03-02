import React, { FC, PropsWithChildren } from "react";
import { Typography } from "antd";
import { LinkProps } from "antd/lib/typography/Link";

interface ILinkProps extends LinkProps, PropsWithChildren {}

export const Link: FC<ILinkProps> = ({ children, ...restProps }) => {
  return <Typography.Link {...restProps}>{children}</Typography.Link>;
};
