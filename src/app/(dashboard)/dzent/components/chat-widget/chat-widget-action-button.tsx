import { Button } from '@/uicomponents/button';
import React from 'react';

import './chat-widget-action-button.scss';
import { LoadingOutlined } from '@/uicomponents/icons';
import { Tooltip } from '@/uicomponents/index';
import { HtmlContent } from '../chat-messages/instructions';
import { CLR_BLACK, CLR_WHITE } from '@/lib/constants';

type ChatWidgetActionButtonProps = {
  onClick?: () => void;
  focused?: boolean;
  label: string;
  className?: string;
  loading?: boolean;
  tooltip?: string;
};

export const ChatWidgetActionButton = ({
  onClick,
  focused,
  label,
  className,
  loading,
  tooltip,
}: ChatWidgetActionButtonProps) => {
  return (
    <Tooltip
      placement='topLeft'
      color={CLR_WHITE}
      style={{ color: CLR_BLACK }}
      title={
        tooltip ? (
          <HtmlContent
            style={{
              maxWidth: '20rem',
              maxHeight: '25rem',
              overflowY: 'auto',
            }}
            htmlStr={tooltip}
            color={CLR_BLACK}
          />
        ) : null
      }>
      <Button
        size='small'
        className={
          'action-button gradient-action gradient-action-button chat-widget-action-button' +
          (focused ? ' focused' : '') +
          (loading ? ' loading' : '') +
          (className ? ` ${className}` : '')
        }
        onClick={onClick}
        disabled={loading}>
        {loading ? <LoadingOutlined /> : ''}
        {label}
      </Button>
    </Tooltip>
  );
};
