import { DzBox } from '@/components/layout/v1';
import { MapFunction } from '@/components/shared';
import { Text } from '@/uicomponents';
import { Checkbox, CheckboxGroup } from '@/uicomponents/form/input';
import { Flex } from '@/uicomponents/layout';
import { FC } from 'react';
import { JobTitleAddButton } from './job-title-add-button';
import { JobTitleRecommendationNote } from './job-title-recommendation-note';
import { JobTitleSelectAll } from './job-title-select-all';
import { JobTitleUnselectAll } from './job-title-unselect-all';

interface JobTitleRecommendationContentProps {
  show: boolean;
  recommendedJobTitles: Record<string, any>[];
  selectedRecommendedJobTitles: string[];
  existingJTList: string[];
  recommendedJobTitlesCount: number;
  onAdd: () => void;
  onCheckboxChange: (checkedValues: string[]) => void;
  handleSelectAllChange: (selectedValues: string[]) => void;
  onUnselectAll: () => void;
}

export const JobTitleRecommendationContent: FC<
  JobTitleRecommendationContentProps
> = ({
  show,
  recommendedJobTitles,
  existingJTList,
  selectedRecommendedJobTitles,
  recommendedJobTitlesCount,
  onAdd,
  onCheckboxChange,
  handleSelectAllChange,
  onUnselectAll,
}) => {
  const onSelectAllChange = () => {
    const allValues = recommendedJobTitles.flatMap((item) =>
      item.children.map((child: any) => child.value),
    );
    handleSelectAllChange(allValues);
  };

  const renderJobTitleCheckbox = (child: any) => (
    <Checkbox
      value={child.value}
      onChange={() => {}}
      disabled={existingJTList.includes(child.label)}>
      {child.label}
    </Checkbox>
  );

  const renderJobTitleGroup = (item: Record<string, any>) => (
    <Flex vertical gap='0.25rem'>
      <Text style={{ fontSize: '0.875rem' }} strong>
        {item.name}
      </Text>
      <DzBox style={{ marginLeft: '0.5rem' }}>
        <Flex vertical gap='0.25rem'>
          <MapFunction
            items={item.children}
            renderItem={renderJobTitleCheckbox}
          />
        </Flex>
      </DzBox>
    </Flex>
  );

  if (!show) return null;

  return (
    <Flex vertical gap={'0.5rem'}>
      <JobTitleRecommendationNote />
      <Flex justify='space-between' gap={'0.25rem'}>
        <Text italic strong style={{ fontSize: '0.875rem' }}>
          Suggestions
        </Text>
        <JobTitleUnselectAll onUnselectAll={onUnselectAll} />
      </Flex>

      <DzBox style={{ maxHeight: '15rem', overflowY: 'auto' }}>
        <Flex vertical gap={'0.25rem'}>
          <JobTitleSelectAll
            checked={
              selectedRecommendedJobTitles.length === recommendedJobTitlesCount
            }
            onSelectAllChange={onSelectAllChange}
          />

          <CheckboxGroup
            onChange={onCheckboxChange}
            value={selectedRecommendedJobTitles}>
            <MapFunction
              items={recommendedJobTitles}
              renderItem={renderJobTitleGroup}
            />
          </CheckboxGroup>
        </Flex>
      </DzBox>
      <Flex justify='end' gap={'0.25rem'}>
        <JobTitleAddButton
          onAdd={onAdd}
          disabled={!selectedRecommendedJobTitles?.length}
        />
      </Flex>
    </Flex>
  );
};
