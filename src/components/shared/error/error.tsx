import { IError } from "@/lib/types";
import { Level, logger } from "@/services/logger";
import { Button, Result } from "@/uicomponents";
import React, { FC } from "react";

export interface IErrorProps extends IError {
  handleRefresh?: () => void
}

export const ErrorResult: FC<IErrorProps> = ({
  isError,
  message,
  resource,
  action,
  payload,
  handleRefresh
}) => {
  if (isError) {
    logger(Level.Error, message, resource, action, payload);
    return (
      <Result
        status="error"
        title={`${action} ${resource} failed`}
        subTitle={message}
        extra={handleRefresh ? <Button type="primary" onClick={handleRefresh}>Refresh</Button> : null}
      />
    );
  }
  return null;
};
