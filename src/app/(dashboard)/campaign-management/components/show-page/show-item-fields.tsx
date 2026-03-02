'use client';
import { Row } from '@/uicomponents/layout/grid';
import { DzBox } from '@/components/layout/v1';
import { FieldSkeltonRow } from '@/app/(dashboard)/components';
import { Typography } from 'antd';
import { FieldColumn } from './field-column';
import { Space } from '@/uicomponents/layout';
import { FC, Fragment, useEffect, useState } from 'react';
import { ILineItem } from '../../line-items/lib/types';
import { ICampaign } from '../../campaigns/lib/types';
import { useShowFieldsData } from '../../line-items/lib/hooks/use-show-fields-data';
import { DZONE_CLR_GRAY_4 } from '@/lib/constants';

const { Text } = Typography;

export interface IShowItemFieldsProps {
  itemDetails?: ILineItem | ICampaign;
  formConfig: any;
  isCollapsed: boolean;
  summaryViewFields: string[];
}

export const ShowItemFields: FC<IShowItemFieldsProps> = ({
  itemDetails,
  isCollapsed,
  formConfig,
  summaryViewFields,
}) => {
  const { fieldsList } = useShowFieldsData(
    itemDetails as ILineItem,
    formConfig,
  );
  const [fieldsToDisplay, setFieldsToDisplay] = useState<any[]>([]);

  const isFieldValueNonEmpty = (value: any): boolean => {
    return (
      value !== undefined &&
      value !== null &&
      value !== '' &&
      (!Array.isArray(value) || value.length > 0) &&
      (!(typeof value === 'object') || Object.keys(value).length > 0)
    );
  };

  useEffect(() => {
    if (isCollapsed) {
      const summaryFields = Array.isArray(fieldsList)
        ? fieldsList
            .map((group) => ({
              ...group,
              fields: group.fields.filter((fieldObj: { field: string }) =>
                summaryViewFields.includes(fieldObj.field),
              ),
            }))
            .filter((group) => group.fields.length > 0)
        : [];
      setFieldsToDisplay(summaryFields);
    } else {
      const nonEmptySections = Array.isArray(fieldsList)
        ? fieldsList
            .filter((group) =>
              group.fields.some((field: any) =>
                isFieldValueNonEmpty(field.value),
              ),
            )
            .map((group) => ({
              ...group,
              sectionLabel: group.section || 'Untitled Section',
              fields: group.fields.filter((field: any) =>
                isFieldValueNonEmpty(field.value),
              ),
            }))
        : [];
      setFieldsToDisplay(nonEmptySections);
    }
  }, [isCollapsed, fieldsList, summaryViewFields]);

  if (!itemDetails) return <FieldSkeltonRow show />;

  return (
    <>
      {fieldsToDisplay.map((fieldGroup: any, groupIndex: number) => (
        <Fragment key={groupIndex}>
          {fieldGroup.sectionLabel &&
            fieldGroup.sectionLabel !== 'Basic Details' && (
              <Text strong>{fieldGroup.sectionLabel}</Text>
            )}
          <DzBox
            style={{
              margin: '0.25rem 0 1rem 0',
              background: DZONE_CLR_GRAY_4,
              overflow: 'hidden',
              borderRadius: '0.5rem',
            }}>
            {Array.isArray(fieldGroup.fields) &&
              fieldGroup.fields
                .reduce((rows: any[][], field: any, index: number) => {
                  const chunkIndex = Math.floor(index / 4);
                  if (!rows[chunkIndex]) rows[chunkIndex] = [];
                  rows[chunkIndex].push(field);
                  return rows;
                }, [])
                .map(
                  (
                    rowFields: any[],
                    rowIndex: number,
                    allRows: string | any[],
                  ) => (
                    <Space
                      key={rowIndex}
                      direction='vertical'
                      style={{
                        width: '100%',
                        borderBottom:
                          rowIndex !== allRows.length - 1
                            ? '1px solid #e5e7eb'
                            : undefined,
                        padding: '1rem',
                      }}>
                      <Row gutter={[16, 16]}>
                        {rowFields.map((field) => {
                          return <FieldColumn key={field.field} data={field} />;
                        })}
                      </Row>
                    </Space>
                  ),
                )}
          </DzBox>
        </Fragment>
      ))}
    </>
  );
};
