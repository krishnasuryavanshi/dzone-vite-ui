'use client';

import { DzBox } from '@/components/layout/v1';
import { Link } from '@/uicomponents';
import {
  FC,
  PropsWithChildren,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';

interface ITruncatedTextProps extends PropsWithChildren {
  lines?: number;
  symbol?: ReactNode | string;
  handleExpand?: () => void;
}

export const TruncatedText: FC<ITruncatedTextProps> = ({
  children,
  lines = 2,
  symbol = 'more',
  handleExpand,
}) => {
  const [isOverflow, setIsOverflow] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    const element = textRef.current as any;
    const isTextOverflowing = element.scrollHeight > element.clientHeight;
    setIsOverflow(isTextOverflowing);
  }, [children, lines]);

  const onExpand = () => {
    handleExpand && handleExpand();
  };

  return (
    <DzBox className='truncated-text'>
      <div
        style={{
          display: '-webkit-box',
          overflow: 'hidden',
          wordWrap: 'break-word',
          wordBreak: 'break-word',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: lines,
          textOverflow: 'ellipsis',
          whiteSpace: 'normal',
        }}
        ref={textRef}
        data-testid='truncated-text'>
        {children}
      </div>
      {isOverflow && (
        <Link
          className='expand-link'
          style={{ cursor: 'pointer' }}
          onClick={onExpand}>
          {symbol}
        </Link>
      )}
    </DzBox>
  );
};
