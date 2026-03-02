import { FC, useEffect, useState } from 'react';
import { JobTitleInputRenderer } from './job-title-input-renderer';
import { JobTitleCustomProps } from './job-title';

interface IJobTitleInputProps {
  show: boolean;
  jobTitles: Record<string, any>[];
  customProps?: JobTitleCustomProps;
  handleModeChange: (enableEditMode: boolean) => void;
  addUserEnteredTag: (tag: string) => void;
  clearAll: () => void;
  removeTag: (tag: Record<string, any>) => void;
  handleAddRecommendedJobTitles: (
    selectedRecommendedJobTitles: string[],
  ) => void;
  recommendedJobTitles: Record<string, any>[];
  isRecommendedJobTitlesLoading: boolean;
}

export const JobTitleInput: FC<IJobTitleInputProps> = ({
  show,
  jobTitles,
  handleModeChange,
  customProps,
  addUserEnteredTag,
  clearAll,
  removeTag,
  handleAddRecommendedJobTitles,
  recommendedJobTitles,
  isRecommendedJobTitlesLoading,
}) => {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (customProps?.disabled) {
      setInputValue('');
    }
  }, [customProps?.disabled]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmedInputValue = inputValue?.trim();
      if (trimmedInputValue) {
        addUserEnteredTag(trimmedInputValue);
        setInputValue('');
      }
    }
  };

  if (!show) return null;

  return (
    <JobTitleInputRenderer
      input={inputValue}
      jobTitles={jobTitles}
      handleInputChange={handleInputChange}
      handleKeyDown={handleKeyDown}
      removeTag={removeTag}
      placeholder={customProps?.placeholder}
      isEditMode={true}
      handleAddRecommendedJobTitles={handleAddRecommendedJobTitles}
      recommendedJobTitles={recommendedJobTitles}
      isRecommendedJobTitlesLoading={isRecommendedJobTitlesLoading}
      disabled={customProps?.disabled}
    />
  );
};
