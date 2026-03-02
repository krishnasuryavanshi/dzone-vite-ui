import { useState, useEffect } from 'react';
import { fetchLineItemHistory } from '../../../../line-items/services';
import { getReadableHistory } from '../../../../lib/utils';
import { useFileMetadata } from './use-file-metadata';

export const useHistoryData = (
  isOpen: boolean,
  lineItemId: string,
  marketerCode?: string,
  formConfig?: any,
) => {
  const [loading, setLoading] = useState(false);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState(true);

  const { fileMap, validationSettingMap, fetchFileMetadata } =
    useFileMetadata(marketerCode);

  const fetchHistory = async (id: string, pageNo: number, append: boolean) => {
    if (!id) return;
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetchLineItemHistory(id, {
        page: pageNo || 1,
        size: 10,
        entityName: 'LineItemEntity',
      });
      const rawData = res?.data;
      if (rawData?.length > 0) {
        const readable = getReadableHistory(rawData, formConfig);
        const allDiffs = readable.flatMap((entry: any) => entry.diff);
        await fetchFileMetadata(allDiffs);
        setHistoryData((prev) => (append ? [...prev, ...readable] : readable));
        if (rawData.length < 10) setHasMore(false);
      } else {
        setHasMore(false);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && lineItemId) {
      setPage(1);
      setHasMore(true);
      setHistoryData([]);
      fetchHistory(lineItemId, 1, false);
    }
  }, [isOpen, lineItemId]);

  useEffect(() => {
    if (page === 1) return;
    fetchHistory(lineItemId, page, true);
  }, [page, lineItemId]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 100 && hasMore && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return {
    historyData,
    loading,
    hasMore,
    handleScroll,
    fileMap,
    validationSettingMap,
  };
};
