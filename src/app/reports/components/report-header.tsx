import React from 'react';
import { Typography } from 'antd';

interface ReportHeaderProps {
  title: string;
  subtitle?: string;
}

export const ReportHeader: React.FC<ReportHeaderProps> = ({ title, subtitle }) => {
  return (
    <div style={{ marginBottom: 16 }}>
      <Typography.Title level={4} style={{ margin: 0 }}>
        {title}
      </Typography.Title>
      {subtitle && (
        <Typography.Text type="secondary">{subtitle}</Typography.Text>
      )}
    </div>
  );
};
