"use client";

import { ThemedLayoutV2 } from "@/refine-components";
import React, { FC, PropsWithChildren } from "react";
import { CustomFooter } from "./custom-footer";
import { CustomHeader } from "./custom-header";
import { CustomSider } from "./custom-sider";
import { Digitalzone } from "@/components/brands";

export const ThemedLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ThemedLayoutV2
      Header={() => <CustomHeader sticky />}
      Sider={() => (
        <CustomSider
          text={"DZ One"}
          fixed
          collapsed={false}
          icon={<Digitalzone variant="small" />}
        />
      )}
      Footer={() => <CustomFooter />}
    >
      {children}
    </ThemedLayoutV2>
  );
};
