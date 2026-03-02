import React, { FC } from 'react';
import { Flex } from '@/uicomponents/layout';
import { DzBox } from '@/components/layout/v1';
import { MapFunction } from '@/components/shared';
import { TagItem } from '../tag-item';

interface JobTitleInputTagsRendererProps {
  jobTitles: Record<string, any>[];
  removeTag: (tag: Record<string, any>) => void;
  editTag: (tag: Record<string, any>) => void;
}

export const JobTitleInputTagsRenderer: FC<JobTitleInputTagsRendererProps> = ({
  jobTitles,
  removeTag,
  editTag,
}) => {
  return (
    <DzBox style={{ maxHeight: '10rem', overflowY: 'auto' }}>
      <Flex vertical gap={'0.25rem'} align={'flex-start'}>
        <MapFunction
          items={jobTitles}
          renderItem={(item: Record<string, any>) => (
            <TagItem
              type={item.type}
              text={item.text}
              onEdit={() => editTag(item)}
              onClose={() => removeTag(item)}
            />
          )}
        />
      </Flex>
    </DzBox>
  );
};
