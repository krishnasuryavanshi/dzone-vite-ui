import React, { FC } from "react";
import { forgotPasswordConfig } from "../config";
import { ILinkSent } from "../types";
import { FormControl } from "../../components/form-control";

interface IEmailFormControlProps extends ILinkSent {}

export const EmailFormControl: FC<IEmailFormControlProps> = ({
  isLinkSent,
}) => {
  const { fields } = forgotPasswordConfig;
  if (isLinkSent) {
    return null;
  }
  return <FormControl field={fields.email}/>;
};
