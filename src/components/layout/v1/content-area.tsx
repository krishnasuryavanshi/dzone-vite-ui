import React, { FC } from "react";
import { Layout } from "antd";
import { Header } from "./header";
import { Content } from "./content";

interface IContentAreaProps {
    children: React.ReactNode;
    isMobile: boolean;
}

export const ContentArea: FC<IContentAreaProps> = ({isMobile, children}) => {
  return (
    <Layout className={isMobile ? "dz-panel-mobile" : "dz-panel-desktop"}>
      <Header />
      <Content>{children}</Content>
    </Layout>
  );
};
