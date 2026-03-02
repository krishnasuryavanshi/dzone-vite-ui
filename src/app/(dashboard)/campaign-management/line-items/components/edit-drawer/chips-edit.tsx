import React, { useState, useEffect } from 'react';
import { Typography, Checkbox } from 'antd';
import { Flex } from '@/uicomponents/layout';
import { DzBox } from '@/components/layout/v1';
import { Tag } from '@/uicomponents/tag';
import { Input } from '@/uicomponents/form/input';
import { Button } from '@/uicomponents/button';
import { PlusCircleOutlined } from '@ant-design/icons';
import { showNotification } from '@/services/notification';
import { JobTitleTokenType } from '../../lib/enums';
import { fetchRecommendations } from '../../services';
import { AiPen } from '@/uicomponents/icons/svgs';
import { Dropdown } from '@/uicomponents';
import { LoadingOutlined } from '@/uicomponents/icons';
import {
  splitChipValues,
  containsDelimiter,
  shouldCreateChip,
  processPastedText,
} from '@/lib/utils/chip-utils';

const { Text } = Typography;

// Styles as objects for reuse
const styles = {
  recommendationDropdownContainer: {
    background: 'white',
    boxShadow: '0 3px 0.375rem rgba(0, 0, 0, 0.16)',
    borderRadius: '0.5rem',
    padding: '1rem',
    width: '22rem',
    maxWidth: '90vw',
  },
  recommendationHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem',
    paddingBottom: '0.5rem',
    borderBottom: '1px solid #f0f0f0',
  },
  recommendationTitle: {
    fontWeight: 600,
    color: '#333',
  },
  recommendationNote: {
    fontSize: '0.9rem',
    color: '#555',
    marginBottom: '0.75rem',
    lineHeight: 1.4,
  },
  recommendationsList: {
    maxHeight: '18.75rem',
    overflowY: 'auto',
    marginBottom: '0.75rem',
  },
  recommendationGroup: {
    marginBottom: '0.75rem',
  },
  recommendationGroupTitle: {
    fontWeight: 500,
    marginBottom: '0.375rem',
  },
  selectAllContainer: {
    borderTop: '1px solid #f0f0f0',
    paddingTop: '0.75rem',
    marginTop: '0.5rem',
    display: 'flex',
    justifyContent: 'space-between',
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '1rem',
    gap: '0.5rem',
  },
  noRecommendationsContainer: {
    padding: '1rem',
    textAlign: 'center' as const,
    color: '#666',
  },
};

interface Chip {
  id: string;
  label: string;
  type?: string;
}

interface ChipsEditProps {
  values: Chip[];
  onChange: (chips: Chip[]) => void;
  label: string;
  placeholder?: string;
}

export const ChipsEdit: React.FC<ChipsEditProps> = ({
  values,
  onChange,
  label,
  placeholder = 'Add New',
}) => {
  const [inputValue, setInputValue] = useState('');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [recommendedJobTitles, setRecommendedJobTitles] = useState<
    Record<string, any>[]
  >([]);
  const [isRecommendedJobTitlesLoading, setIsRecommendedJobTitlesLoading] =
    useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedRecommendations, setSelectedRecommendations] = useState<
    string[]
  >([]);

  const isJobTitleField =
    label.toLowerCase().includes('job title') ||
    label.toLowerCase().includes('jobtitle');

  useEffect(() => {
    // Update selected recommendations when values change
    if (recommendedJobTitles.length > 0) {
      const existingLabels = values.map((v) => v.label.toLowerCase());

      // Update already selected items
      const alreadySelectedValues = recommendedJobTitles.flatMap((item) =>
        (item.children || [])
          .filter((child: any) =>
            existingLabels.includes((child.label || '').toLowerCase()),
          )
          .map((child: any) => child.value),
      );

      setSelectedRecommendations(alreadySelectedValues);
    }
  }, [values, recommendedJobTitles]);

  /** Process multiple values from comma-separated input */
  const processMultipleValues = (input: string) => {
    const existingLabels = values.map((chip) => chip.label);
    const { newValues, duplicates } = processPastedText(input, existingLabels);

    const newChips: Chip[] = newValues.map((value) => ({
      id: value,
      label: value,
      type: isJobTitleField ? JobTitleTokenType.UserEntered : undefined,
    }));

    if (newChips.length > 0) {
      onChange([...values, ...newChips]);

      // Fetch recommendations for the first new job title if applicable
      if (isJobTitleField && newChips[0]) {
        fetchRecommendedJobTitles(newChips[0].label);
      }
    }

    if (duplicates.length > 0) {
      showNotification({
        message: `The following values already exist: ${duplicates.join(', ')}`,
        type: 'error',
      });
    }

    return newChips.length > 0;
  };

  /** Add new chip manually */
  const handleAddNew = () => {
    if (!inputValue.trim()) return;

    // Check if input contains delimiters
    if (containsDelimiter(inputValue)) {
      const added = processMultipleValues(inputValue);
      if (added) {
        setInputValue('');
      }
      return;
    }

    // Single value processing
    const exists = values.some(
      (chip) => chip.label.toLowerCase() === inputValue.trim().toLowerCase(),
    );

    if (exists) {
      showNotification({
        message: `${inputValue.trim()} already exists`,
        type: 'error',
      });
      return;
    }

    const newChip: Chip = {
      id: inputValue.trim(),
      label: inputValue.trim(),
      type: isJobTitleField ? JobTitleTokenType.UserEntered : undefined,
    };

    onChange([...values, newChip]);
    if (isJobTitleField) {
      fetchRecommendedJobTitles(inputValue.trim());
    }
    setInputValue('');
  };

  /** Handle paste event */
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');

    // Check if pasted text contains multiple values
    if (containsDelimiter(pastedText)) {
      const added = processMultipleValues(pastedText);
      if (added) {
        setInputValue('');
      }
    } else {
      // Single value - let default paste behavior continue
      setInputValue(pastedText.trim());
    }
  };

  /** Remove chip */
  const handleRemove = (chip: Chip) => {
    onChange(values.filter((val) => val.id !== chip.id));
  };

  const fetchRecommendedJobTitles = async (tag: string) => {
    setIsRecommendedJobTitlesLoading(true);
    try {
      const jtRecommendations = await fetchRecommendations('job_title', tag);
      if (!jtRecommendations) return;

      let extractedRecommendations = [];

      if (Array.isArray(jtRecommendations)) {
        extractedRecommendations = jtRecommendations;
      } else {
        extractedRecommendations = [jtRecommendations];
      }

      setRecommendedJobTitles(extractedRecommendations);
      setDropdownOpen(true);
    } catch (error) {
    } finally {
      setIsRecommendedJobTitlesLoading(false);
    }
  };

  const handleCheckboxChange = (checkedValues: string[]) => {
    setSelectedRecommendations(checkedValues);
  };

  const handleSelectAllChange = () => {
    // If some are selected, select all. If all are selected, unselect all.
    const allValues = recommendedJobTitles.flatMap((item) =>
      (item.children || []).map((child: any) => child.value),
    );

    if (selectedRecommendations.length < allValues.length) {
      setSelectedRecommendations(allValues);
    } else {
      setSelectedRecommendations([]);
    }
  };

  const handleAddSelectedRecommendations = () => {
    // Get labels for the selected values
    const selectedLabels: Record<string, string> = {};

    recommendedJobTitles.forEach((item) => {
      (item.children || []).forEach((child: any) => {
        if (selectedRecommendations.includes(child.value)) {
          selectedLabels[child.value] = child.label || '';
        }
      });
    });

    // Create new chips for selected recommendations
    const existingLabels = values.map((v) => v.label.toLowerCase());

    const newChips = selectedRecommendations
      .filter(
        (value) =>
          selectedLabels[value] &&
          !existingLabels.includes(selectedLabels[value].toLowerCase()),
      )
      .map((value) => ({
        id: selectedLabels[value],
        label: selectedLabels[value],
        type: JobTitleTokenType.AIRecommended,
      }));

    if (newChips.length) {
      onChange([...values, ...newChips]);
    }

    setDropdownOpen(false);
  };

  const handleDropdownOpenChange = (open: boolean) => {
    setDropdownOpen(open);
  };

  const renderDropdown = () => {
    if (isRecommendedJobTitlesLoading) {
      return (
        <DzBox style={styles.recommendationDropdownContainer}>
          <Flex justify='center' align='center' style={{ padding: '1.5rem' }}>
            <LoadingOutlined style={{ fontSize: '2rem' }} />
          </Flex>
        </DzBox>
      );
    }

    if (!recommendedJobTitles.length) {
      return (
        <DzBox style={styles.recommendationDropdownContainer}>
          <Flex
            justify='center'
            align='center'
            style={styles.noRecommendationsContainer}>
            No recommendations available
          </Flex>
        </DzBox>
      );
    }

    // Get all possible values for Select All logic
    const allValues = recommendedJobTitles.flatMap((item) =>
      (item.children || []).map((child: any) => child.value),
    );

    const isAllSelected =
      selectedRecommendations.length === allValues.length &&
      allValues.length > 0;

    // Get existing labels to filter out already added items
    const existingLabels = values.map((v) => v.label.toLowerCase());

    return (
      <DzBox style={styles.recommendationDropdownContainer}>
        <Flex
          justify='space-between'
          align='center'
          style={styles.recommendationHeader}>
          <Text strong style={styles.recommendationTitle}>
            Suggestions
          </Text>
          <Button
            type='link'
            onClick={() => setSelectedRecommendations([])}
            style={{ padding: 0 }}>
            Unselect All
          </Button>
        </Flex>

        <Text style={styles.recommendationNote}>
          Note: Please consider selecting the similar job titles suggested below
          to ensure that no valuable leads are rejected during validation
          process.
        </Text>

        <Flex justify='space-between' style={styles.selectAllContainer}>
          <Checkbox
            checked={isAllSelected}
            onChange={handleSelectAllChange}
            style={{ fontWeight: 600 }}>
            Select All
          </Checkbox>
        </Flex>

        <Flex
          vertical
          style={styles.recommendationsList as React.CSSProperties}>
          {recommendedJobTitles.map((group, groupIndex) => {
            if (!group.name || !group.children || !group.children.length)
              return null;

            return (
              <DzBox
                key={`group-${groupIndex}`}
                style={styles.recommendationGroup}>
                <Text strong style={styles.recommendationGroupTitle}>
                  {group.name}
                </Text>
                <Checkbox.Group
                  value={selectedRecommendations}
                  onChange={handleCheckboxChange}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.375rem',
                  }}>
                  {group.children.map((item: any) => {
                    const isAlreadyAdded = existingLabels.includes(
                      (item.label || '').toLowerCase(),
                    );

                    return (
                      <Checkbox
                        key={item.value}
                        value={item.value}
                        disabled={isAlreadyAdded}
                        style={{ marginLeft: 0 }}>
                        {item.label}
                      </Checkbox>
                    );
                  })}
                </Checkbox.Group>
              </DzBox>
            );
          })}
        </Flex>

        <Flex justify='flex-end' gap='0.5rem' style={styles.buttonsContainer}>
          <Button onClick={() => setDropdownOpen(false)}>Cancel</Button>
          <Button
            type='primary'
            onClick={handleAddSelectedRecommendations}
            disabled={selectedRecommendations.length === 0}>
            Add
          </Button>
        </Flex>
      </DzBox>
    );
  };

  return (
    <DzBox>
      {/* Input + buttons */}
      <Flex
        align='center'
        justify='space-between'
        gap='0.5rem'
        style={{ marginBottom: '1rem' }}>
        <Input
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => {
            const value = e.target.value;

            // Check if user typed a delimiter
            if (containsDelimiter(value)) {
              // Process multiple values immediately
              const added = processMultipleValues(value);
              if (added) {
                setInputValue('');
              } else {
                // If no new values added, keep the last part after delimiter
                const values = splitChipValues(value);
                const lastPart = values[values.length - 1] || '';
                setInputValue(lastPart);
              }
            } else {
              setInputValue(value);
            }
          }}
          onPressEnter={handleAddNew}
          onPaste={handlePaste}
          onKeyDown={(e) => {
            // Handle Tab and Enter keys for chip creation
            if (shouldCreateChip(e.key) && inputValue.trim()) {
              e.preventDefault();
              handleAddNew();
            }
          }}
          style={{ border: 'none', boxShadow: 'none' }}
        />
        <Flex gap='0.5rem' align='center'>
          {isJobTitleField && (
            <Dropdown
              open={dropdownOpen}
              onOpenChange={handleDropdownOpenChange}
              dropdownRender={renderDropdown}
              arrow={true}
              trigger={['click']}
              placement='bottomLeft'>
              <Button
                onClick={() => {
                  if (inputValue.trim() && !isRecommendedJobTitlesLoading) {
                    fetchRecommendedJobTitles(inputValue.trim());
                  }
                }}
                style={{
                  border: 'none',
                  background: 'transparent',
                  padding: 0,
                }}
                title='Get suggestions'
                disabled={isRecommendedJobTitlesLoading}>
                {isRecommendedJobTitlesLoading ? (
                  <LoadingOutlined
                    style={{ fontSize: '1.25rem', color: '#4F46E5' }}
                  />
                ) : (
                  <AiPen style={{ fontSize: '1.25rem', color: '#4F46E5' }} />
                )}
              </Button>
            </Dropdown>
          )}
        </Flex>
      </Flex>

      {/* Selected chips */}
      <DzBox
        style={{
          borderRadius: '0.375rem',
          padding: '1rem',
          background: '#F9FAFB',
        }}>
        <Flex wrap='wrap' gap='0.5rem'>
          {values.map((chip) => (
            <Tag
              key={chip.id}
              closable
              onClose={() => handleRemove(chip)}
              style={{
                backgroundColor:
                  hoveredItem === chip.id ? '#EBF3FE' : '#FFFFFF',
                border: '1px solid #D1D5DB',
                borderRadius: '4px',
                padding: '0.25rem 0.5rem',
              }}
              onMouseEnter={() => setHoveredItem(chip.id)}
              onMouseLeave={() => setHoveredItem(null)}>
              {chip.label}
            </Tag>
          ))}
        </Flex>
      </DzBox>
    </DzBox>
  );
};
