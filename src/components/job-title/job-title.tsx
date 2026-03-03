import { DzBox } from '@/components/layout/v1';
import { showNotification } from '@/services/notification';
import { Flex } from '@/uicomponents/layout';
import { debounce } from 'lodash';
import { FC, useEffect, useState } from 'react';
import { JobTitleTokenType } from '@/app/(dashboard)/campaign-management/line-items/lib/enums';
import { storeRecommendedJobTitlesAnalytics } from '@/app/(dashboard)/campaign-management/line-items/lib/utils';
import { separateJobTitles } from '@/app/(dashboard)/campaign-management/line-items/lib/utils/recommendations';
import { fetchRecommendations } from '@/app/(dashboard)/campaign-management/line-items/services';
import { JobTitleInput } from './job-title-input';
import { TagsContainer } from './tags-container';

export interface JobTitleCustomProps {
  disabled?: boolean;
  type?: string;
  placeholder?: string;
  onChange?: (jtList: Record<string, any>[]) => void;
}

interface IJobTitleProps {
  containerClassName?: string;
  customProps?: JobTitleCustomProps;
  value?: Record<string, any>[];
  onChange: (e: any) => void;
}

export const JobTitle: FC<IJobTitleProps> = ({
  containerClassName,
  value,
  onChange,
  customProps,
}) => {
  const [jtList, setJtList] = useState<Record<string, any>[]>([]);
  const [jobTitles, setJobTitles] = useState<Record<string, any>[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [recommendedJobTitles, setRecommendedJobTitles] = useState<
    Record<string, any>[]
  >([]);
  const [selectedRecommendedJobTitlesMap, setSelectedRecommendedJobTitlesMap] =
    useState<Record<string, string[]>>({});
  const [isRecommendedJobTitlesLoading, setIsRecommendedJobTitlesLoading] =
    useState(false);

  const debouncedStoreRecommendedJobTitlesAnalytics = debounce(
    storeRecommendedJobTitlesAnalytics,
    500,
  );

  useEffect(() => {
    if (customProps?.disabled) {
      setIsEditMode(false);
    }
  }, [customProps?.disabled]);

  useEffect(() => {
    if (customProps?.disabled) {
      // customProps?.disabled === true means the custom component is not rendering
      setRecommendedJobTitles([]);
    }
  }, [customProps?.disabled]);

  useEffect(() => {
    if (value?.length) {
      setJobTitles(value);
    } else {
      setJobTitles([]);
      setIsEditMode(true);
    }
  }, [value]);

  useEffect(() => {
    // Update recommended job titles in localstorage for analytics
    // retrive it for saving line items
    debouncedStoreRecommendedJobTitlesAnalytics(recommendedJobTitles, jtList);
  }, [recommendedJobTitles, jtList]);

  const handleChange = (jtList: Record<string, any>[]) => {
    onChange(jtList);
    if (customProps?.onChange) {
      customProps.onChange(jtList);
    }
    setJtList(jtList);
  };

  const removeTag = (tag: Record<string, any>) => {
    const removing = [tag.text];
    if (tag.type === JobTitleTokenType.UserEntered) {
      removing.push(...(selectedRecommendedJobTitlesMap[tag.text] || []));
      setSelectedRecommendedJobTitlesMap({
        ...selectedRecommendedJobTitlesMap,
        [tag.text]: [],
      });
      setRecommendedJobTitles(
        recommendedJobTitles.filter((jt) => jt.name !== tag.text),
      );
    }

    const jtList = jobTitles.filter((t) => !removing.includes(t.text));

    if (jtList.length) {
      setJobTitles(jtList);
      handleChange(jtList);
    } else {
      clearAll();
    }
  };

  const addUserEnteredTag = (tag: string) => {
    const isExisting = jobTitles.some(
      (jt) => jt.text.toLowerCase() === tag.toLowerCase(),
    );
    if (isExisting) {
      showNotification({
        message: `${tag} already exists`,
        type: 'error',
      });
      return;
    }
    const jtList = [
      { text: tag, type: JobTitleTokenType.UserEntered },
      ...jobTitles,
    ];
    setJobTitles(jtList);
    handleChange(jtList);
    fetchRecommendedJobTitles(tag);
  };

  const clearAll = () => {
    setJobTitles([]);
    setRecommendedJobTitles([]);
    setIsEditMode(true);
    handleChange([]);
  };

  const fetchRecommendedJobTitles = async (tag: string) => {
    setIsRecommendedJobTitlesLoading(true);
    try {
      const jtRecommendations = await fetchRecommendations('job_title', tag);
      if (jtRecommendations) {
        setRecommendedJobTitles([jtRecommendations, ...recommendedJobTitles]);
      }
    } finally {
      setIsRecommendedJobTitlesLoading(false);
    }
  };

  const handleAddRecommendedJobTitles = (
    selectedRecommendedJobTitles: string[],
  ) => {
    const { newJobTitles } = separateJobTitles(
      selectedRecommendedJobTitles,
      jobTitles,
    );

    if (newJobTitles.length) {
      const jtResponseMap = { ...selectedRecommendedJobTitlesMap };

      const newJtList = newJobTitles.map(([jt, tag]) => {
        jtResponseMap[tag] = [...(jtResponseMap[tag] || []), jt];
        return {
          text: jt,
          type: JobTitleTokenType.AIRecommended,
        };
      });
      setSelectedRecommendedJobTitlesMap(jtResponseMap as any);
      const updatedJtList = [...newJtList, ...jobTitles];
      setJobTitles(updatedJtList);
      handleChange(updatedJtList);
    }
  };

  return (
    <Flex vertical>
      <JobTitleInput
        show={isEditMode}
        jobTitles={jobTitles}
        handleModeChange={setIsEditMode}
        customProps={customProps}
        addUserEnteredTag={addUserEnteredTag}
        clearAll={clearAll}
        removeTag={removeTag}
        handleAddRecommendedJobTitles={handleAddRecommendedJobTitles}
        recommendedJobTitles={recommendedJobTitles}
        isRecommendedJobTitlesLoading={isRecommendedJobTitlesLoading}
      />
      <TagsContainer
        value={jobTitles}
        show={!isEditMode && jobTitles.length > 0}
        handleModeChange={setIsEditMode}
        removeTag={removeTag}
      />
    </Flex>
  );
};
