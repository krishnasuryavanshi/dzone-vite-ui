import React, { useState } from "react";
import { Layout } from "antd";
import { Sider } from "./sider";
import { ContentArea } from "./content-area";

export const DzPageContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isMobile, setIsMobile] = useState(false);

  return (
    <Layout className="dz-page-container">
      <Sider handleBreakpoint={(broken: boolean) => setIsMobile(broken)} />
      <ContentArea isMobile={isMobile}>{children}</ContentArea>
    </Layout>
  );
};
