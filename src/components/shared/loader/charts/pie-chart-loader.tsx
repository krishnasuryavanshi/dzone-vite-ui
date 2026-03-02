import React from "react";
import { Input, Avatar } from "@/uicomponents/layout/skeleton";
import "antd/lib/skeleton/style";
import { DzBox } from "@/components/layout/v1";
import { Flex } from "@/uicomponents/layout";

export const PieChartLoader = () => {
  return (
    <Flex
      align="center"
      justify="center"
      style={{
        height: "200px",
        position: "relative",
      }}
    >
      <Avatar active shape="circle" size={200} />
      <DzBox
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Input
          active
          style={{ width: "40px", height: "40px", borderRadius: "50%" }}
        />
      </DzBox>
    </Flex>
  );
};
