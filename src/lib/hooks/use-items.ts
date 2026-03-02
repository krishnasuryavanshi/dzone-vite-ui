/* eslint-disable react-hooks/exhaustive-deps */
import { BaseRecord, HttpError, useList } from "@refinedev/core";
import { useEffect, useState } from "react";
import { IError, ILoader } from "../types";

export interface IUseItemsParams<T> {
  resource: string;
  queryOptions: any; // TODO: fix type
}

export function useItems<T extends BaseRecord, E extends HttpError>({
  resource,
  queryOptions,
}: IUseItemsParams<T>) {
  const [data, setData] = useState<T[] | null>(null);
  const [loader, setLoader] = useState<ILoader | null>({isLoading: true} as ILoader);
  const [error, setError] = useState<IError | null>(null);

  const {
    data: items,
    isLoading,
    isError,
    refetch
  } = useList<T, E, T>({
    resource,
    queryOptions,
  });

  useEffect(() => {
    if (isError) {
      setError({
        isError: true,
        message: `Error while fetching ${resource}`,
        resource,
        action: 'Fetch List',
        payload: null
      });
      setData(null);
      setLoader(null);
    }
  }, [isError]);

  useEffect(() => {
    if (isLoading) {
      setLoader({
        isLoading: true,
        message: `Loading ${resource}`,
        resource,
        action: 'Fetch List',
        payload: null
      });
      setData(null);
      setError(null);
    }
  }, [isLoading]);

  useEffect(() => {
    if (items && items.data) {
      setData(items?.data);
      setError(null);
      setLoader(null);
    }
  }, [items]);

  return { data, loader, error, refetch };
}
