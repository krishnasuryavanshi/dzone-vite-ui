import { Hideable } from '@/components/shared';
import { Flex } from '@/uicomponents/layout';
import { Text } from '@/uicomponents/text';
import { FC } from 'react';
import { RequiredBadge } from './required-badge';
import { FieldValuesSection } from './field-values-section';
import { ICustomField } from '../../../lib/types';

export interface ICustomFieldCardProps {
  field: ICustomField;
  onViewAllInclusion: () => void;
  onViewAllExclusion: () => void;
}

export const CustomFieldCard: FC<ICustomFieldCardProps> = ({
  field,
  onViewAllInclusion,
  onViewAllExclusion,
}) => {
  const splitValues = (value: string | null): string[] => {
    if (!value) return [];
    return value.split(',').filter((val) => val.trim());
  };

  const inclusionValues = splitValues(field.inclusion);
  const exclusionValues = splitValues(field.exclusion);

  return (
    <Flex vertical gap='0.5rem' style={{ padding: '1rem 0.75rem', paddingBottom: '0' }}>
      <Flex align='center' gap='0.5rem'>
        <Text strong text14>
          {field.position}. {field.label}
        </Text>
        <Hideable show={!!field.format}>
          <Text text12 style={{ color: '#6B7280' }} strong>
            ({field.format})
          </Text>
        </Hideable>
        <RequiredBadge required={field.required} />
      </Flex>

      <FieldValuesSection
        label='Inclusion Values'
        values={inclusionValues}
        onViewAll={onViewAllInclusion}
      />

      <FieldValuesSection
        label='Suppression Values'
        values={exclusionValues}
        onViewAll={onViewAllExclusion}
      />
    </Flex>
  );
};
