import { Translate } from "@/components/i18n";
import { Text } from "@/uicomponents";
import { Flex } from "@/uicomponents/layout";
import React, { FC } from "react";

interface IFormSubHeaderProps {
  subHeading: string;
}

export const FormSubHeader: FC<IFormSubHeaderProps> = ({ subHeading }) => {
  return (
    <Flex className="form-sub-header" justify="start" align="center" style={{marginBottom: "0.5rem"}}>
      <Text className="form-sub-title" strong>
        <Translate i18nKey={subHeading} />
      </Text>
    </Flex>
  );
};
