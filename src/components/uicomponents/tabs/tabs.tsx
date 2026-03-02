import React, { FC } from "react";
import { Tabs as AntdTabs } from "antd";
import { TabsProps } from "antd/lib/tabs";

import "./tabs.scss";

interface ITabsProps extends TabsProps {}

export const Tabs: FC<ITabsProps> = ({ children, ...rest }) => {
  return (
    <AntdTabs className="dz-one-tabs" {...rest}>
      {children}
    </AntdTabs>
  );
};
