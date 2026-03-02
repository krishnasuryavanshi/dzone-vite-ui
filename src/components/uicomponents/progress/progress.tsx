import { ProgressProps } from "antd/lib/progress";
import { Progress as AntdProgress } from "antd";
import React, { FC } from "react";

import "./progress.scss";

export const Progress: FC<ProgressProps> = ({ children, ...rest }) => {
  return (
    <AntdProgress className="dz-progress" {...rest}>
      {children}
    </AntdProgress>
  );
};
