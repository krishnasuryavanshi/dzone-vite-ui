import { ILoader } from "@/lib/types";
import { appLogger } from "@/services/logger";
import React, { FC } from "react";
import { ListLoader } from "./list";
import { TableLoader } from "./table";
import { CardLoader } from "./card";
import { FormLoader } from "./form";

export interface ILoaderProps extends ILoader {
    type: 'card' | 'table' | 'list' | 'form';
}

export const Loader: FC<ILoaderProps> = ({
  isLoading,
  message,
  resource,
  action,
  payload,
  type,
}) => {
  if (isLoading) {
    appLogger.info(message, { resource, action, payload });
    if (type === 'card') {
      return <CardLoader/>;
    }
    if(type === 'table') {
      return <TableLoader/>;
    }
    if(type === 'list') {
      return <ListLoader/>;
    }
    if(type === 'form') {
        return <FormLoader/>;
      }
  }
  return null;
};
