import React from "react";
import { Input } from "@/uicomponents/layout/skeleton";
import { DzBox } from "@/components/layout/v1";

import "antd/lib/skeleton/style";
import { Flex } from "@/uicomponents/layout";

export const BarChartLoader = () => {
  const bars = Array.from({ length: 5 }); // Array to represent 5 bars

  return (
    <Flex vertical align="center" justify="center">
      {bars.map((_, index) => (
        <DzBox key={index} style={{ margin: "10px 0" }}>
          <Input
            active
            style={{ width: `${20 + index * 20}%`, height: "20px" }}
          />
        </DzBox>
      ))}
    </Flex>
  );
};
