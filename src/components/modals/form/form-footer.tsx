import { Flex } from "antd";
import React, { FC } from "react";
import { ISaveButtonProps, SaveButton } from "./save-button";
import { CancelButton, ICancelButtonProps } from "./cancel-button";

interface IFormFooterProps extends ISaveButtonProps, ICancelButtonProps {}

export const FormFooter: FC<IFormFooterProps> = ({ onCancel, onSubmit }) => {
  return (
    <Flex className="form-footer" justify="end" align="center" gap={"1rem"}>
      <CancelButton onCancel={onCancel} />
      <SaveButton onSubmit={onSubmit} />
    </Flex>
  );
};
