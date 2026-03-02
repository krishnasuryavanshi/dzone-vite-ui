'use client';

import { useState, useCallback, DragEvent } from 'react';

interface UseDragAndDropOptions {
  onDrop: (files: File[]) => void;
  acceptedTypes?: string[];
  disabled?: boolean;
}

interface UseDragAndDropReturn {
  isDragging: boolean;
  dragHandlers: {
    onDragEnter: (e: DragEvent<HTMLElement>) => void;
    onDragLeave: (e: DragEvent<HTMLElement>) => void;
    onDragOver: (e: DragEvent<HTMLElement>) => void;
    onDrop: (e: DragEvent<HTMLElement>) => void;
  };
}

export const useDragAndDrop = ({
  onDrop,
  acceptedTypes,
  disabled = false,
}: UseDragAndDropOptions): UseDragAndDropReturn => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);

  const isFileTypeAccepted = useCallback(
    (file: File): boolean => {
      if (!acceptedTypes || acceptedTypes.length === 0) {
        return true;
      }
      const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
      const fileMimeType = file.type.toLowerCase();
      return acceptedTypes.some((type) => {
        const normalizedType = type.toLowerCase().trim();
        return (
          normalizedType === fileExtension ||
          normalizedType === fileMimeType ||
          (normalizedType.includes('/') &&
            fileMimeType.startsWith(normalizedType.replace('/*', '/')))
        );
      });
    },
    [acceptedTypes],
  );

  const handleDragEnter = useCallback(
    (e: DragEvent<HTMLElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      setDragCounter((prev) => prev + 1);
      if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
        setIsDragging(true);
      }
    },
    [disabled],
  );

  const handleDragLeave = useCallback(
    (e: DragEvent<HTMLElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      setDragCounter((prev) => {
        const newCounter = prev - 1;
        if (newCounter === 0) {
          setIsDragging(false);
        }
        return newCounter;
      });
    },
    [disabled],
  );

  const handleDragOver = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      setDragCounter(0);

      if (disabled) return;

      const files = Array.from(e.dataTransfer.files);
      const acceptedFiles = files.filter(isFileTypeAccepted);

      if (acceptedFiles.length > 0) {
        onDrop(acceptedFiles);
      }
    },
    [disabled, isFileTypeAccepted, onDrop],
  );

  return {
    isDragging,
    dragHandlers: {
      onDragEnter: handleDragEnter,
      onDragLeave: handleDragLeave,
      onDragOver: handleDragOver,
      onDrop: handleDrop,
    },
  };
};
