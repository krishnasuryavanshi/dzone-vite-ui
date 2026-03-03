
import { Spin, Text, Title } from '@/uicomponents';
import { Flex, Space } from '@/uicomponents/layout';
import { useSearchParams } from '@/lib/hooks/use-router';
import { useEffect } from 'react';
import { useDownloadFileQuery } from '../hooks';

type DownloadStatus = 'idle' | 'loading' | 'success' | 'error' | 'no-token';

export const DownloadFileContainer = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const { data, isLoading, isError } = useDownloadFileQuery(
    token ?? '',
    !!token,
  );

  // Trigger file download when data arrives
  useEffect(() => {
    if (data?.data?.url) {
      const link = document.createElement('a');
      link.href = data.data.url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [data]);

  const getStatus = (): DownloadStatus => {
    if (!token) return 'no-token';
    if (isLoading) return 'loading';
    if (isError || !data?.data?.url) return 'error';
    return 'success';
  };

  const status = getStatus();

  const getTitle = () => {
    switch (status) {
      case 'loading':
        return 'Preparing Download';
      case 'success':
        return 'Download Complete';
      case 'error':
        return 'Download Failed';
      case 'no-token':
        return 'Invalid Download Link';
      default:
        return 'Download File';
    }
  };

  const getMessage = () => {
    switch (status) {
      case 'loading':
        return 'Please wait while we prepare your file...';
      case 'success':
        return 'Your file has been downloaded successfully';
      case 'error':
        return 'Unable to download the file. Please try again.';
      case 'no-token':
        return 'The download link is invalid or has expired';
      default:
        return '';
    }
  };

  const hasError = status === 'error' || status === 'no-token';

  return (
    <Flex
      style={{ minHeight: '100vh', backgroundColor: 'white' }}
      justify='center'
      align='center'>
      <Space direction='vertical' align='center' size='large'>
        {isLoading && <Spin size='large' spinning={true} />}
        <Title level={3}>{getTitle()}</Title>
        <Text type={hasError ? 'danger' : undefined}>{getMessage()}</Text>
      </Space>
    </Flex>
  );
};
