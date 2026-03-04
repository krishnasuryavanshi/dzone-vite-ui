import { Input } from 'antd';
import { FC, useMemo } from 'react';
import { TagItem } from './tag-item';
import { Flex } from '@/uicomponents/layout';
import { JobTitleRecommendation } from './job-title-recommendation';
import { TruncatedTagList } from '@/app/(dashboard)/campaign-management/line-items/components/lead-validation-settings/show-rule/components/truncated-tag-list';
import { DrawerShowList } from '@/components/shared/text/drawer-list-view';
import { useToggle } from '../../hooks/use-toggle';

interface IJobTitleInputRendererProps {
  input: string;
  jobTitles: Record<string, any>[];
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  removeTag: (tag: Record<string, any>) => void;
  placeholder?: string;
  isEditMode?: boolean;
  handleAddRecommendedJobTitles: (selectedRecommendedJobTitles: string[]) => void;
  recommendedJobTitles: Record<string, any>[];
  isRecommendedJobTitlesLoading: boolean;
  disabled?: boolean;
}
export const JobTitleInputRenderer: FC<IJobTitleInputRendererProps> = ({
  input,
  jobTitles,
  handleInputChange,
  handleKeyDown,
  removeTag,
  placeholder,
  isEditMode = false,
  handleAddRecommendedJobTitles,
  recommendedJobTitles,
  isRecommendedJobTitlesLoading,
  disabled,
}) => {
  const { isOpen: isDrawerOpen, close: closeDrawer, open: openDrawer } = useToggle();

  // Properly format job titles for TruncatedTagList with safety checks
  const memoizedJobTitles = useMemo(() => {
    if (!Array.isArray(jobTitles) || jobTitles.length === 0) return [];

    return jobTitles.map((job) => ({
      label: job?.text || '',
      value: job?.text || '',
    }));
  }, [jobTitles]);

  // Extract text list for drawer display
  const jobTitleTextList = useMemo(
    () => memoizedJobTitles.map((item) => item.label).filter(Boolean),
    [memoizedJobTitles],
  );

  return (
    <Flex vertical gap='0.5rem' style={{ width: '100%' }}>
      <Flex align='center' gap='0.5rem' style={{ width: '100%' }}>
        <Input
          type='text'
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || 'Add more'}
          style={{
            border: 'none',
            outline: 'none',
            boxShadow: 'none',
            padding: '0',
            background: 'transparent',
            fontSize: '0.875rem',
            width: '100%',
            marginLeft: '1.5rem',
          }}
          disabled={disabled}
        />
        <JobTitleRecommendation
          show={isEditMode}
          existingjobTitles={jobTitles}
          handleAddRecommendedJobTitles={handleAddRecommendedJobTitles}
          recommendedJobTitles={recommendedJobTitles}
          isLoading={isRecommendedJobTitlesLoading}
          disabled={disabled}
        />
      </Flex>

      {/* Chips displayed below the input */}
      {jobTitles.length > 0 && (
        <>
          <TruncatedTagList
            items={memoizedJobTitles}
            onViewAll={openDrawer}
            renderItem={(item, index) => {
              // Safely access the original job title with fallback
              const originalJob = jobTitles[index];
              const jobType = originalJob?.type || 'user-entered';

              return (
                <TagItem
                  key={`${item.label}-${jobType}-${index}`}
                  text={item.label}
                  type={jobType}
                  onClose={() => {
                    // Only remove if we have a valid job object
                    if (originalJob) {
                      removeTag(originalJob);
                    }
                  }}
                />
              );
            }}
          />
          <DrawerShowList
            show={isDrawerOpen}
            handleClose={closeDrawer}
            list={jobTitleTextList}
            label='Job Titles'
            hasChildren={false}
          />
        </>
      )}
    </Flex>
  );
};
