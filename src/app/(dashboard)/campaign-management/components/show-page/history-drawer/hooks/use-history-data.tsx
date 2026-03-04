import React, { useMemo } from 'react';
import { useLineItemHistoryInfiniteQuery } from '../../../../line-items/hooks';
import { getReadableHistory } from '../../../../lib/utils';
import { useFileMetadata } from './use-file-metadata';

export const useHistoryData = (
  isOpen: boolean,
  lineItemId: string,
  marketerCode?: string,
  formConfig?: any,
) => {
  const { fileMap, validationSettingMap, fetchFileMetadata } =
    useFileMetadata(marketerCode);

  const {
    data,
    isFetching: loading,
    hasNextPage: hasMore,
    fetchNextPage,
  } = useLineItemHistoryInfiniteQuery(
    lineItemId,
    'LineItemEntity',
    isOpen && !!lineItemId,
  );

  const historyData = useMemo(() => {
    if (!data?.pages) return [];
    const allRawData = data.pages.flatMap((page: any) => page ?? []);
    if (allRawData.length === 0) return [];
    const readable = getReadableHistory(allRawData, formConfig);
    // Trigger file metadata fetch for all diffs
    const allDiffs = readable.flatMap((entry: any) => entry.diff);
    fetchFileMetadata(allDiffs);
    return readable;
  }, [data, formConfig]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 100 && hasMore && !loading) {
      fetchNextPage();
    }
  };

  return {
    historyData,
    loading,
    hasMore: hasMore ?? false,
    handleScroll,
    fileMap,
    validationSettingMap,
  };
};
