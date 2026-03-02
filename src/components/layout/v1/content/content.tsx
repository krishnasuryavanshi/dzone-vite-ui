import React, { FC, PropsWithChildren } from "react";

import "./content.scss";
import { ContentPanel } from "./content-panel";

interface IContentProps extends PropsWithChildren {}

export const Content: FC<IContentProps> = ({ children }) => {
  return (
    <ContentPanel>
      {children}
    </ContentPanel>
  );
};
