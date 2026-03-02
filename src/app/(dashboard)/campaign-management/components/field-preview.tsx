import { Flex } from "@/uicomponents/layout";
import { Text } from "@/uicomponents";
import React, { FC, PropsWithChildren } from "react";
import { Translate } from "@/components/i18n";

import "./field-preview.scss";

interface IFieldPreviewProps extends PropsWithChildren {
  label: string;
}

export const FieldPreview: FC<IFieldPreviewProps> = ({ label, children }) => {
  return (
    <Flex vertical gap={"0.5rem"} className="dz-field-preview-box">
      <Text className="dz-field-preview-label">
        <Translate i18nKey={label} />
      </Text>
      {children}
    </Flex>
  );
};
