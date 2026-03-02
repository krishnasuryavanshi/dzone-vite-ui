import { FieldSkeltonRow } from '@/app/(dashboard)/components';
import { useShowSectionData } from '@/app/(dashboard)/lib/hooks';
import { Translate } from '@/components/i18n';
import { DzBox } from '@/components/layout/v1';
import { Divider, Text } from '@/uicomponents';
import { Row } from '@/uicomponents/layout/grid';
import { cloneDeep } from 'lodash';
import { FC, useEffect, useState } from 'react';
import { FieldColumn } from './show-field-column';
import { ICampaign } from '../../campaigns/lib/types';
import { ILineItem } from '../../line-items/lib/types';
import { downloadIOFile } from '../../campaigns/services';
import {
  LineItemFields,
  DownloadLineItemFilesType,
} from '../../line-items/lib/enums';
import { downloadLineItemFiles } from '../../line-items/services';
import { handleFileDownload } from '../../lib/utils';

export interface IShowItemFieldsProps {
  itemDetails?: ILineItem | ICampaign;
  formConfig: any;
  isCollapsed: boolean;
  completedStepId: number;
  summaryViewFields: string[];
  stepKeysList: Record<string, number>;
}

const LineItemFilesList = {
  [LineItemFields.JobTitleListUpload]:
    DownloadLineItemFilesType.DownloadJobTitleListFile,
  [LineItemFields.TechnologyListUpload]:
    DownloadLineItemFilesType.DownloadTechnologyFile,
  [LineItemFields.IntentKeywordsList]:
    DownloadLineItemFilesType.DownloadIntentKeywordsFile,
  [LineItemFields.SuppressionListUpload]:
    DownloadLineItemFilesType.DownloadSuppressionFile,
  [LineItemFields.TargetAccountListTALUpload]:
    DownloadLineItemFilesType.DownloadTALFile,
  [LineItemFields.DeliveryTemplate]:
    DownloadLineItemFilesType.DownloadDeliveryTemplateFile,
};

export const ShowItemFields: FC<IShowItemFieldsProps> = ({
  itemDetails,
  isCollapsed,
  completedStepId,
  formConfig,
  summaryViewFields,
  stepKeysList,
}) => {
  const { sectionList } = useShowSectionData(
    itemDetails,
    completedStepId,
    formConfig,
    stepKeysList,
  );
  const [sectionsListData, setSectionsListData] = useState<any[]>([]);

  useEffect(() => {
    if (isCollapsed) {
      const firstStepData = sectionList?.length && cloneDeep(sectionList[0]);
      if (firstStepData) {
        firstStepData.title = '';
        firstStepData.fields = firstStepData.fields.filter(
          (field: Record<string, any>) =>
            summaryViewFields.includes(field.field),
        );
        setSectionsListData([firstStepData]);
      } else {
        setSectionsListData([]);
      }
    } else {
      setSectionsListData(sectionList?.length ? cloneDeep(sectionList) : []);
    }
  }, [isCollapsed, sectionList]);

  const handleDownloadFiles = async (field: any) => {
    if (field.field in LineItemFilesList) {
      const fileType =
        LineItemFilesList[field.field as keyof typeof LineItemFilesList];
      const resourceFetcher = () =>
        downloadLineItemFiles(itemDetails?.id as string, {
          fileType,
          fileId: field.value.id,
        });
      await handleFileDownload(resourceFetcher, 'content-disposition');
    } else {
      const resourceFetcher = () =>
        downloadIOFile(itemDetails?.id!, field.value.id);
      await handleFileDownload(resourceFetcher, 'content-disposition');
    }
  };

  if (!sectionsListData?.length) return <FieldSkeltonRow show />;
  return (
    <>
      {sectionsListData.map((section, index) => (
        <DzBox key={section.title} style={{ margin: '0.5rem 0' }}>
          <Text strong>
            <Translate i18nKey={section.title} />
          </Text>
          <Row>
            {section?.fields?.map((field: any) => (
              <FieldColumn
                key={field.field}
                data={field}
                handleDownload={() => handleDownloadFiles(field)}
              />
            ))}
          </Row>
          {index < sectionsListData.length - 1 && <Divider />}
        </DzBox>
      ))}
    </>
  );
};
