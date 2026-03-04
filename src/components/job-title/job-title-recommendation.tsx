import { Dropdown } from '@/uicomponents';
import { LoadingOutlined } from '@/uicomponents/icons';
import { AiPen } from '@/uicomponents/icons/svgs';
import { FC, useEffect, useState } from 'react';
import {
  JobTitleRecommendationContent,
  JobTitleRecommendationDropdownContainer,
  NoRecommendations,
} from './job-title-recommendation-dropdown-content';

interface IJobTitleRecommendationProps {
  show: boolean;
  isLoading: boolean;
  handleAddRecommendedJobTitles: (selectedRecommendedJobTitles: string[]) => void;
  recommendedJobTitles: Record<string, any>[];
  existingjobTitles: Record<string, string>[];
  disabled?: boolean;
}

export const JobTitleRecommendation: FC<IJobTitleRecommendationProps> = ({
  show,
  isLoading,
  handleAddRecommendedJobTitles,
  recommendedJobTitles,
  existingjobTitles,
  disabled,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedRecommendedJobTitles, setSelectedRecommendedJobTitles] = useState<string[]>([]);
  const [recommendedJobTitlesCount, setRecommendedJobTitlesCount] = useState(0);
  const [existingJTList, setExistingJTList] = useState<string[]>([]);

  useEffect(() => {
    if (recommendedJobTitles.length > 0) {
      const count = recommendedJobTitles.reduce((acc, item) => acc + item.children.length, 0);
      if (count < recommendedJobTitlesCount) {
        setOpen(false);
      } else {
        setOpen(true);
      }
      setRecommendedJobTitlesCount(count);
    }
  }, [recommendedJobTitles]);

  useEffect(() => {
    const existingJTList = existingjobTitles?.map((jt) => jt?.text) || [];
    setExistingJTList(existingJTList);
    const alreadySelectedFromRecommendationsValues = recommendedJobTitles.flatMap((item) =>
      item.children
        .filter((child: any) => existingJTList.includes(child.label))
        .map((child: any) => child.value),
    );
    setSelectedRecommendedJobTitles(alreadySelectedFromRecommendationsValues);
  }, [existingjobTitles]);

  const handleAdd = () => {
    handleAddRecommendedJobTitles(selectedRecommendedJobTitles);
  };

  const handleOpenChange = (open: boolean) => {
    if (disabled) {
      setOpen(false);
      return;
    }
    setOpen(open);
  };

  const handleCheckboxChange = (checkedValues: string[]) => {
    setSelectedRecommendedJobTitles(checkedValues);
  };

  const handleSelectAllChange = (selectedValues: string[]) => {
    setSelectedRecommendedJobTitles(selectedValues);
  };

  const renderDropdown = () => {
    return (
      <JobTitleRecommendationDropdownContainer>
        <JobTitleRecommendationContent
          show={recommendedJobTitles.length > 0}
          existingJTList={existingJTList}
          recommendedJobTitles={recommendedJobTitles}
          selectedRecommendedJobTitles={selectedRecommendedJobTitles}
          recommendedJobTitlesCount={recommendedJobTitlesCount}
          onAdd={handleAdd}
          onCheckboxChange={handleCheckboxChange}
          handleSelectAllChange={handleSelectAllChange}
          onUnselectAll={() => setSelectedRecommendedJobTitles([])}
        />
        <NoRecommendations onClose={() => setOpen(false)} show={!recommendedJobTitles.length} />
      </JobTitleRecommendationDropdownContainer>
    );
  };

  if (!show) return null;

  if (isLoading) return <LoadingOutlined style={{ fontSize: '2rem' }} />;

  return (
    <Dropdown
      open={open}
      onOpenChange={handleOpenChange}
      dropdownRender={renderDropdown}
      arrow={true}
      trigger={['click']}
      placement='bottomLeft'
      disabled={disabled}
    >
      <AiPen />
    </Dropdown>
  );
};
