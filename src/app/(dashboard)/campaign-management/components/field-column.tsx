
import React, { FC, PropsWithChildren } from "react";
import { DzBox } from "@/components/layout/v1";
import { FieldPreview } from "../components";

interface IFieldColumnProps extends PropsWithChildren {
  label: string;
}
export const FieldColumn: FC<IFieldColumnProps> = ({ label, children }) => {
  return (
    <DzBox style={{ width: "20%" }}>
      <FieldPreview label={label}>{children}</FieldPreview>
    </DzBox>
  );
};
