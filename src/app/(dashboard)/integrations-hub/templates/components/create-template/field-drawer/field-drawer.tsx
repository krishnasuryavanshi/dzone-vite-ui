'use client';
import { IFileUploadMetaData } from '@/app/(dashboard)/campaign-management/line-items/lib/types';
import { DrawerCloseButton } from '@/app/(dashboard)/components';
import { Translate } from '@/components/i18n';
import { DzBox } from '@/components/layout/v1';
import { Title } from '@/uicomponents';
import { Drawer } from '@/uicomponents/drawers';
import { FormInstance } from '@/uicomponents/form';
import { Flex, Space } from '@/uicomponents/layout';
import { FC, useEffect, useState } from 'react';
import {
  ITemplateFieldDataType,
  ITemplateFieldResponse,
} from '../../../lib/types';
import {
  fetchDataMapperFileUploadMetadata,
  fetchDataTypes,
} from '../../../services';
import { useTemplateStore } from '../../../stores';
import { FieldForm } from './field-form';
import { Footer } from './footer';
import { Navigation } from './navigation';

interface IFieldDrawerProps {
  form: FormInstance<any>;
  isFieldDrawerOpen: boolean;
  closeFieldDrawer: () => void;
  templateField: ITemplateFieldResponse | null;
  handleNext: () => void;
  handlePrev: () => void;
  currentIndex: number;
  getCurrentFieldData: () => Promise<{
    field: ITemplateFieldResponse;
    index: number;
  }>;
}

export const FieldDrawer: FC<IFieldDrawerProps> = ({
  form,
  isFieldDrawerOpen,
  closeFieldDrawer,
  templateField,
  handleNext,
  handlePrev,
  currentIndex,
  getCurrentFieldData,
}) => {
  const { visibleFieldsCount } = useTemplateStore();

  const [dataTypePicklist, setDataTypePicklist] = useState<
    ITemplateFieldDataType[]
  >([]);
  const [mapperFileUploadMetadata, setMapperFileUploadMetadata] =
    useState<IFileUploadMetaData>();

  const fetchDataTypePicklist = async () => {
    const data = await fetchDataTypes();
    setDataTypePicklist(data?.data || []);
  };

  const fetchMapperFileUploadMetadata = async () => {
    const response = await fetchDataMapperFileUploadMetadata();
    if (response?.data?.file?.types?.length) {
      setMapperFileUploadMetadata(response.data);
    }
  };

  useEffect(() => {
    if (isFieldDrawerOpen) {
      fetchDataTypePicklist();
      fetchMapperFileUploadMetadata();
    }
  }, [isFieldDrawerOpen]);

  const handleDrawerClose = () => {
    closeFieldDrawer();
  };

  return (
    <Drawer
      open={isFieldDrawerOpen}
      closable
      maskClosable={false}
      placement='right'
      closeIcon={<DrawerCloseButton />}
      title={
        <Flex align='center' justify='space-between'>
          <Title level={5} style={{ marginBottom: '0' }}>
            <Translate i18nKey='pages.templates.label.fieldProperties' />
          </Title>
          <Navigation
            totalFields={visibleFieldsCount!}
            currentFieldNumber={currentIndex + 1}
            handleNext={handleNext}
            handlePrev={handlePrev}
          />
        </Flex>
      }
      destroyOnClose
      width='45vw'
      onClose={handleDrawerClose}
      style={{ overflow: 'hidden' }}
      footer={
        <Space style={{ maxHeight: '2rem', height: '2rem' }}>
          <Footer getCurrentFieldData={getCurrentFieldData} />
        </Space>
      }>
      <DzBox style={{ paddingLeft: '2rem' }}>
        <FieldForm
          form={form}
          key={templateField?.id ?? ''}
          index={currentIndex}
          templateField={templateField}
          dataTypePicklist={dataTypePicklist}
          mapperFileUploadMetadata={mapperFileUploadMetadata}
        />
      </DzBox>
    </Drawer>
  );
};
