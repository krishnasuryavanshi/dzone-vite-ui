
import React, { useEffect, useState, useRef } from 'react';
import { Tag, Tooltip } from '@/uicomponents';
import { Text } from '@/uicomponents/text';
import { Flex } from '@/uicomponents/layout';

interface TruncatedTagListProps {
  items: Array<{ label: string; value: string }> | string[];
  onViewAll: () => void;
  maxLines?: number;
  renderItem?: (
    item: { label: string; value: string },
    index: number,
  ) => React.ReactNode;
}

export const TruncatedTagList: React.FC<TruncatedTagListProps> = ({
  items,
  onViewAll,
  maxLines = 2,
  renderItem,
}) => {
  const [visibleItems, setVisibleItems] = useState<
    Array<{ label: string; value: string }>
  >([]);
  const [showViewMore, setShowViewMore] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hiddenRef = useRef<HTMLDivElement>(null);

  const normalizedItems = React.useMemo(() => {
    return items.map((item) =>
      typeof item === 'string' ? { label: item, value: item } : item,
    );
  }, [items]);

  useEffect(() => {
    if (!containerRef.current || !hiddenRef.current) return;

    const calculateVisible = () => {
      if (!hiddenRef.current) return;

      // Reset to show all items in hidden div to measure
      const hiddenContainer = hiddenRef.current;
      const maxHeight = maxLines * 42; // Approximately 42px per line with gaps for better spacing

      // Start with all items
      let itemsToShow = normalizedItems.length;

      // Check if height exceeds max
      if (hiddenContainer.scrollHeight > maxHeight) {
        // Binary search to find optimal number of items
        let left = 0;
        let right = normalizedItems.length;

        while (left < right) {
          const mid = Math.floor((left + right + 1) / 2);
          setVisibleItems(normalizedItems.slice(0, mid));

          // Wait for render
          setTimeout(() => {
            if (hiddenContainer.scrollHeight <= maxHeight) {
              left = mid;
            } else {
              right = mid - 1;
            }
          }, 0);
        }

        itemsToShow = left - 1; // Reserve space for "View More"
        setShowViewMore(true);
      } else {
        setShowViewMore(false);
      }

      setVisibleItems(normalizedItems.slice(0, itemsToShow));
    };

    // Simple approach: estimate based on average tag width
    const estimateVisibleItems = () => {
      const containerWidth = containerRef.current?.offsetWidth || 800;
      const avgTagWidth = 120; // Average width including margins
      const itemsPerLine = Math.floor(containerWidth / avgTagWidth);
      const maxItems = itemsPerLine * maxLines;

      if (normalizedItems.length > maxItems) {
        setVisibleItems(normalizedItems.slice(0, maxItems - 1)); // Leave room for "View More"
        setShowViewMore(true);
      } else {
        setVisibleItems(normalizedItems);
        setShowViewMore(false);
      }
    };

    estimateVisibleItems();

    const handleResize = () => estimateVisibleItems();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [normalizedItems, maxLines]);

  const tagStyle: React.CSSProperties = {
    backgroundColor: '#EAF1FF',
    border: 'none',
    borderRadius: '0.625rem',
    padding: '0.375rem 0.75rem',
    display: 'inline-block',
    fontSize: '0.875rem',
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: 'normal',
    color: '#707070',
    margin: 0,
    maxWidth: '20rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxHeight: '3.2rem',
  };

  if (normalizedItems.length === 0) {
    return null;
  }

  // Calculate max height based on lines (approximately 36px per line with original tag size)
  const maxHeight = `${maxLines * 2.25}rem`;

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <div
        style={{
          maxHeight,
          overflow: 'hidden',
        }}>
        <Flex wrap='wrap' gap='0.5rem' align='center'>
          {renderItem
            ? visibleItems.map((item, index) => renderItem(item, index))
            : visibleItems.map((item) => (
                <Tooltip key={item.value} title={item.label}>
                  <Tag style={tagStyle}>{item.label}</Tag>
                </Tooltip>
              ))}
          {showViewMore && (
            <Text
              onClick={onViewAll}
              style={{
                cursor: 'pointer',
                color: '#235AED',
                fontSize: '0.875rem',
                fontWeight: 500,
                whiteSpace: 'nowrap',
                textDecoration: 'underline',
              }}>
              View More
            </Text>
          )}
        </Flex>
      </div>
      {/* Hidden container for measurement */}
      <div
        ref={hiddenRef}
        style={{
          position: 'absolute',
          visibility: 'hidden',
          top: 0,
          left: 0,
          right: 0,
          pointerEvents: 'none',
        }}>
        <Flex wrap='wrap' gap='0.5rem'>
          {normalizedItems.map((item) => (
            <Tag key={item.value} style={tagStyle}>
              {item.label}
            </Tag>
          ))}
        </Flex>
      </div>
    </div>
  );
};
