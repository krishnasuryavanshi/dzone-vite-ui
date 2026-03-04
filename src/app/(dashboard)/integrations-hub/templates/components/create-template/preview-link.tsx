import React, { useState } from 'react';
import { Link } from '@/uicomponents/link';

export interface PreviewLinkProps {
  integrationId?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

import { fetchIntegrationDetailsById } from '../../services/fetch-integration-details-by-id';

export const PreviewLink: React.FC<PreviewLinkProps> = ({
  integrationId,
  style = {},
  children = 'Preview',
}) => {
  const [loading, setLoading] = useState(false);

  const handlePreviewClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (integrationId) {
      setLoading(true);
      try {
        const response = await fetchIntegrationDetailsById(integrationId);
        const url = response?.data?.url || '';
        if (url) {
          window.open(url, '_blank', 'noopener,noreferrer');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const defaultStyle: React.CSSProperties = {
    color: '#323131',
    cursor: 'pointer',
    textDecoration: 'underline',
    fontWeight: 500,
    fontSize: '14px',
    marginLeft: '8px',
    display: 'inline-block',
    verticalAlign: 'middle',
  };

  const isDisabled = !integrationId || loading;
  const mergedStyle: React.CSSProperties = {
    ...defaultStyle,
    ...style,
    color: isDisabled ? '#bfbfbf' : style?.color || defaultStyle.color,
    cursor: isDisabled ? 'not-allowed' : style?.cursor || defaultStyle.cursor,
    pointerEvents: isDisabled ? 'none' : 'auto',
    textDecoration: isDisabled ? 'none' : style?.textDecoration || defaultStyle.textDecoration,
  };

  return (
    <Link style={mergedStyle} onClick={handlePreviewClick} disabled={isDisabled}>
      {loading ? 'Loading...' : children}
    </Link>
  );
};
