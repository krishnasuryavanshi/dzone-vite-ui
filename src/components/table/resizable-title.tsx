import React, { useRef, useState, useCallback } from 'react';

interface ResizableTitleProps {
  onResize: (width: number) => void;
  width: number;
  [key: string]: any; // For other props passed from table
}

/**
 * Resizable column header component for tables
 * Provides drag-to-resize functionality for table columns
 * Uses React synthetic events only
 */
export const ResizableTitle: React.FC<ResizableTitleProps> = (props) => {
  const { onResize, width, ...restProps } = props;
  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    startX: number;
    startWidth: number;
  }>({
    isDragging: false,
    startX: 0,
    startWidth: 0,
  });

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setDragState({
        isDragging: true,
        startX: e.clientX,
        startWidth: width,
      });
    },
    [width],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dragState.isDragging) return;

      const deltaX = e.clientX - dragState.startX;
      const newWidth = dragState.startWidth + deltaX;

      if (onResize && newWidth > 0) {
        onResize(newWidth);
      }
    },
    [dragState, onResize],
  );

  const handleMouseUp = useCallback(() => {
    if (dragState.isDragging) {
      setDragState((prev) => ({ ...prev, isDragging: false }));
    }
  }, [dragState.isDragging]);

  // If no width is provided, render standard header cell
  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <>
      <th
        {...restProps}
        style={{
          ...restProps.style,
          position: 'relative',
        }}
      >
        {restProps.children}
        <div
          className={`column-resize-handle ${dragState.isDragging ? 'resizing' : ''}`}
          onMouseDown={handleMouseDown}
          style={{
            cursor: 'col-resize',
            userSelect: 'none',
          }}
        />
      </th>
      {/* Invisible overlay during drag to capture mouse events */}
      {dragState.isDragging && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            cursor: 'col-resize',
            userSelect: 'none',
          }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      )}
    </>
  );
};
