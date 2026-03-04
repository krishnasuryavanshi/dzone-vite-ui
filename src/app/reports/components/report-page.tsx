import React from 'react';
import { Spin, Alert } from 'antd';
import { DzScrollContainer } from '@/components/layout/v1/dz-scoll-container';
import { useReportConfig } from '../hooks';
import { ReportHeader } from './report-header';
import { ReportFilterBar } from './filters/report-filter-bar';
import { WidgetGrid } from './widgets/widget-grid';

interface ReportPageShellProps {
  reportId: string;
}

export const ReportPageShell: React.FC<ReportPageShellProps> = ({ reportId }) => {
  const { data: config, isLoading, error } = useReportConfig(reportId);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 64 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error || !config) {
    return (
      <Alert
        type="error"
        message="Failed to load report"
        description={error?.message ?? 'Report configuration not found'}
        style={{ margin: 24 }}
      />
    );
  }

  return (
    <DzScrollContainer vertical scoll="outside">
      <DzScrollContainer.Sticky>
        <div style={{ padding: '16px 16px 0' }}>
          <ReportHeader title={config.title} subtitle={config.subtitle} />
          <ReportFilterBar filters={config.filters} />
        </div>
      </DzScrollContainer.Sticky>
      <DzScrollContainer.Scroll>
        <div style={{ padding: '0 16px 16px' }}>
          <WidgetGrid widgets={config.widgets} />
        </div>
      </DzScrollContainer.Scroll>
    </DzScrollContainer>
  );
};
