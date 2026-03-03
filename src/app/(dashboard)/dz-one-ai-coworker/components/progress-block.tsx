
import { Collapse } from '@/uicomponents';
import { CheckCircleOutlined, LoadingOutlined } from '@/uicomponents/icons';
import { Flex } from '@/uicomponents/layout';
import { Text } from '@/uicomponents/text';
import { FC, useState, useEffect, useCallback, useMemo } from 'react';
import { TIME } from '../lib/constants';
import { COLORS } from '../lib/constants/colors';

interface ProgressBlockProps {
  steps: string[];
  duration?: number;
  isActive: boolean;
}

export const ProgressBlock: FC<ProgressBlockProps> = ({
  steps,
  duration,
  isActive,
}) => {
  const [elapsed, setElapsed] = useState(0);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    if (!isActive) {
      setIsExpanded(false);
      return;
    }

    const interval = setInterval(() => {
      setElapsed((prev) => prev + TIME.TIMER_INTERVAL);
    }, TIME.TIMER_INTERVAL);

    return () => clearInterval(interval);
  }, [isActive]);

  const displayTime = isActive ? elapsed : duration || 0;
  const seconds = Math.floor(displayTime / TIME.MS_PER_SECOND);

  const headerText = isActive
    ? `Processing... ${seconds}s`
    : `Processed in ${seconds}s`;

  const handleCollapseChange = useCallback((keys: string | string[]) => {
    setIsExpanded(Array.isArray(keys) ? keys.includes('1') : keys === '1');
  }, []);

  const items = useMemo(
    () => [
      {
        key: '1',
        label: (
          <Flex align='center' gap='0.5rem'>
            {isActive ? (
              <LoadingOutlined style={{ color: COLORS.GRAY_DARK }} />
            ) : (
              <CheckCircleOutlined style={{ color: COLORS.SUCCESS }} />
            )}
            <Text strong style={{ color: COLORS.TEXT_PRIMARY }}>
              {headerText}
            </Text>
          </Flex>
        ),
        children: (
          <Flex vertical gap='0.25rem'>
            {steps.map((step, index) => (
              <Text
                key={index}
                style={{
                  fontSize: '0.8125rem',
                  color: COLORS.GRAY_MEDIUM,
                }}>
                {step}
              </Text>
            ))}
          </Flex>
        ),
      },
    ],
    [isActive, headerText, steps],
  );

  return (
    <Collapse
      size='small'
      activeKey={isExpanded ? ['1'] : []}
      onChange={handleCollapseChange}
      items={items}
      style={{
        backgroundColor: COLORS.GRAY_LIGHT,
        border: `1px solid ${COLORS.BORDER}`,
        marginBottom: '0.5rem',
      }}
    />
  );
};
