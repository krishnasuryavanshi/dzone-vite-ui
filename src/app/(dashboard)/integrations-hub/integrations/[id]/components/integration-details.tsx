
import { DzBox } from '@/components/layout/v1/dz-box';
import { BasicTable } from '@/components/table';
import { FormatDate } from '@/components/util';
import { ItemType, TableProps } from '@/lib/types/uicomponents';
import { createColumn } from '@/lib/utils/table/create-columns';
import { Breadcrumb, Button, Spin, Text } from '@/uicomponents';
import { ArrowLeftOutlined } from '@/uicomponents/icons';
import { Flex } from '@/uicomponents/layout';
import { useRouter } from '@/lib/hooks/use-router';
import React, { useEffect, useState } from 'react';
import { fetchIntegrationDetails } from '../services';
import styles from './integration-details.module.css';
import { Alert } from 'antd';
import { DzRecord } from '@/lib/types';
import { useScrollableTableHeight } from '@/lib/hooks/use-scrollable-table-height';

interface IntegrationDetailsProps {
  integrationId: string;
}

interface Template {
  templateName: string;
  lastUsed: string;
}

interface IntegrationDetailsResponse {
  id: string;
  name: string;
  type: string;
  data: Template[];
}

const StaticContentHeight = 210;

export const IntegrationDetails: React.FC<IntegrationDetailsProps> = ({
  integrationId,
}) => {
  const [integrationData, setIntegrationData] = useState<DzRecord | null>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { scrollableTableHeight } =
    useScrollableTableHeight(StaticContentHeight);

  useEffect(() => {
    loadIntegrationDetails();
  }, [integrationId]);

  const loadIntegrationDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchIntegrationDetails(integrationId);
      if (response?.data) {
        setIntegrationData(response.data);
      } else {
        setIntegrationData([]);
      }
    } catch (err) {
      setError('Failed to load integration details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/integrations-hub/integrations');
  };

  const dateRenderer = (lastUsed: string) => {
    if (!lastUsed) return '-';
    return <FormatDate date={lastUsed} />;
  };

  const column = createColumn(false);
  const columns: TableProps<Template>['columns'] = [
    column('Template Name', 'name', {
      width: 400,
      ellipsis: true,
    }),
    column(
      'Last Used',
      'lastUsed',
      {
        width: 200,
        ellipsis: true,
      },
      dateRenderer,
    ),
  ];

  const breadcrumbItems: ItemType[] = [
    {
      title: 'Integrations Hub',
    },
    {
      title: 'Integration Logs',
    },
  ];

  if (loading) {
    return (
      <DzBox
        className={styles.integrationDetails}
        style={{ textAlign: 'center', padding: '40px' }}>
        <Spin size='large' />
        <Text style={{ display: 'block', marginTop: '16px' }}>
          Loading integration details...
        </Text>
      </DzBox>
    );
  }

  if (error) {
    return (
      <DzBox className={styles.integrationDetails}>
        <DzBox className='header-section'>
          <Button
            type='text'
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
            className='back-button'>
            Back
          </Button>
        </DzBox>
        <DzBox className='content-section'>
          <Alert
            message='Error'
            description={error}
            type='error'
            showIcon
            action={
              <Button size='small' onClick={loadIntegrationDetails}>
                Retry
              </Button>
            }
          />
        </DzBox>
      </DzBox>
    );
  }

  if (!integrationData) {
    return (
      <DzBox className={styles.integrationDetails}>
        <DzBox className='header-section'>
          <Button
            type='text'
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
            className='back-button'>
            Back
          </Button>
        </DzBox>
        <DzBox className='content-section'>
          <DzBox className='no-data-container'>
            <DzBox className='no-data-content'>
              <Text className='no-data-title'>No Data Found</Text>
              <Text className='no-data-description'>
                {"We couldn't find any details for this integration."}
              </Text>
            </DzBox>
          </DzBox>
        </DzBox>
      </DzBox>
    );
  }

  return (
    <Flex vertical style={{ padding: '0.5rem', paddingBottom: '0rem' }}>
      <Breadcrumb items={breadcrumbItems} />

      <Flex vertical gap='0.75rem' style={{ paddingTop: '0.5rem' }}>
        <Flex align='center' gap='0.5rem'>
          <ArrowLeftOutlined
            className={styles.backArrow}
            onClick={handleBack}
            style={{ fontSize: '14px', color: '#595959', cursor: 'pointer' }}
          />
          <Text strong style={{ marginBottom: '0' }}>
            {integrationData?.name || integrationData?.type || 'Integration'}{' '}
            Details
          </Text>
        </Flex>

        <DzBox>
          {/* <DzBox dzOneBox style={{ paddingBlock: '1rem' }}>
            <Text strong>{integrationData.type}</Text>
          </DzBox> */}
          <BasicTable
            scrollableHeight={scrollableTableHeight}
            columns={columns}
            data={integrationData.data || []}
            hasPagination={false}
            // className='templates-table'
            className='row-hover-highlight'
          />
        </DzBox>
      </Flex>
    </Flex>
  );
};
