'use client';

import { Spin, Text, Title } from '@/uicomponents';
import { Flex, Space } from '@/uicomponents/layout';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { deliveryFileDownload } from '../services/delivery-file-download';

type DownloadStatus = 'idle' | 'loading' | 'success' | 'error' | 'no-token';

export const DownloadFileContainer = () => {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<DownloadStatus>('loading');
  const [message, setMessage] = useState<string>('');
  const token = searchParams.get('token');

  useEffect(() => {
    const initiateDownload = async () => {
      if (!token) {
        setStatus('no-token');
        return;
      }

      try {
        const { data } = await deliveryFileDownload(token);
        if (data?.url) {
          const link = document.createElement('a');
          link.href = data.url;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setStatus('success');
          setMessage('File downloaded successfully');
        } else {
          setStatus('error');
          setMessage('File download failed');
        }
      } catch (error: any) {
        setStatus('error');
        setMessage(error?.message || 'An unexpected error occurred');
      }
    };

    initiateDownload();
  }, [token]);

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
        return message || 'Your file has been downloaded successfully';
      case 'error':
        return message || 'Unable to download the file. Please try again.';
      case 'no-token':
        return 'The download link is invalid or has expired';
      default:
        return '';
    }
  };

  const isLoading = status === 'loading';
  const isError = status === 'error' || status === 'no-token';

  return (
    <Flex
      style={{ minHeight: '100vh', backgroundColor: 'white' }}
      justify='center'
      align='center'>
      <Space direction='vertical' align='center' size='large'>
        {isLoading && <Spin size='large' spinning={true} />}
        <Title level={3}>{getTitle()}</Title>
        <Text type={isError ? 'danger' : undefined}>{getMessage()}</Text>
      </Space>
    </Flex>
  );
};
