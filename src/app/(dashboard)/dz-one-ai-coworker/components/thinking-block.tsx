import { Flex } from '@/uicomponents/layout';
import { Text } from '@/uicomponents/text';
import { FC, useState, useEffect, useRef, useCallback } from 'react';
import { ThinkingHeader } from './thinking-header';
import { Hideable } from '@/components/shared';
import { TIME } from '../lib/constants';
import { COLORS } from '../lib/constants/colors';

interface ThinkingBlockProps {
  content?: string;
  steps?: string[];
  duration?: number;
  isActive: boolean;
}

export const ThinkingBlock: FC<ThinkingBlockProps> = ({ content, steps, duration, isActive }) => {
  const [elapsed, setElapsed] = useState(0);
  const [finalDuration, setFinalDuration] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const elapsedRef = useRef(0);
  const wasActiveRef = useRef(false);

  useEffect(() => {
    if (isActive) {
      setElapsed(0);
      elapsedRef.current = 0;
      setFinalDuration(null);
      setIsExpanded(true);
      wasActiveRef.current = true;
    } else if (wasActiveRef.current) {
      setFinalDuration(elapsedRef.current);
      setIsExpanded(false);
    }
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setElapsed((prev) => {
        const newValue = prev + TIME.TIMER_INTERVAL;
        elapsedRef.current = newValue;
        return newValue;
      });
    }, TIME.TIMER_INTERVAL);

    return () => clearInterval(interval);
  }, [isActive]);

  const displayTime = isActive ? elapsed : (finalDuration ?? duration ?? 0);
  const seconds = Math.floor(displayTime / TIME.MS_PER_SECOND);

  const headerText = isActive ? 'Thinking...' : 'Thought for';

  const handleToggle = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  return (
    <Flex
      vertical
      style={{
        width: '100%',
        backgroundColor: COLORS.GRAY_LIGHT,
        border: `1px solid ${COLORS.BORDER}`,
        borderRadius: '0.5rem',
        marginBottom: '0.5rem',
      }}
    >
      <ThinkingHeader
        isActive={isActive}
        headerText={headerText}
        seconds={seconds}
        onToggle={handleToggle}
      />
      <Hideable show={isExpanded}>
        <Flex
          vertical
          gap='0.25rem'
          style={{
            padding: '0 0.75rem 0.75rem 0.75rem',
          }}
        >
          {isActive
            ? // During thinking: show only the latest step
              steps &&
              steps.length > 0 && (
                <Text
                  style={{
                    fontSize: '0.8125rem',
                    color: COLORS.GRAY_MEDIUM,
                  }}
                >
                  {steps[steps.length - 1]}
                </Text>
              )
            : // After thinking: show all steps
              steps?.map((step, index) => (
                <Text
                  key={index}
                  style={{
                    fontSize: '0.8125rem',
                    color: COLORS.GRAY_MEDIUM,
                  }}
                >
                  {step}
                </Text>
              ))}
          <Hideable show={!!content}>
            <Text
              style={{
                fontFamily: 'monospace',
                fontSize: '0.8125rem',
                whiteSpace: 'pre-wrap',
                color: COLORS.GRAY_MEDIUM,
              }}
            >
              {content}
            </Text>
          </Hideable>
        </Flex>
      </Hideable>
    </Flex>
  );
};
