/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { IError, ILoader } from "../types";
import type { BaseRecord, HttpError } from "../types/resource.types";

export interface IUseItemsParams<T> {
  resource: string;
  queryOptions: any; // TODO: fix type
}

/**
 * Generic list hook. Previously relied on Refine's useList (which was a no-op stub).
 * Consumers should migrate to direct service calls instead.
 */
export function useItems<T extends BaseRecord, E extends HttpError>({
  resource,
  queryOptions,
}: IUseItemsParams<T>) {
  const [data, setData] = useState<T[] | null>(null);
  const [loader, setLoader] = useState<ILoader | null>({isLoading: true} as ILoader);
  const [error, setError] = useState<IError | null>(null);

  // No-op: useList was a stub that always returned empty data.
  const items = { data: [] as T[], total: 0 };
  const isLoading = false;
  const isError = false;
  const refetch = () => Promise.resolve();

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
  }, []);

  return { data, loader, error, refetch };
}
