import { Sider } from "@/refine-components";
import React, { FC } from "react";

interface ICustomSiderProps {
  text: string;
  fixed: boolean;
  icon: React.ReactNode;
  collapsed: boolean;
}

export const CustomSider: FC<ICustomSiderProps> = (props) => {
  return (
    <Sider {...props}/>
  )
};
