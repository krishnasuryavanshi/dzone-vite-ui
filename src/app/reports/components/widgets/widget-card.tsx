import React from 'react';
import { Card, Tooltip } from 'antd';
import { BellOutlined, RobotOutlined, MoreOutlined } from '@ant-design/icons';
import { WidgetConfig } from '../../lib/types';
import './widget-card.scss';

interface WidgetCardProps {
  config: WidgetConfig;
  children: React.ReactNode;
}

const actionIconMap: Record<string, React.ReactNode> = {
  notification: <BellOutlined />,
  ai: <RobotOutlined />,
  more: <MoreOutlined />,
};

export const WidgetCard: React.FC<WidgetCardProps> = ({ config, children }) => {
  const actions = config.actions?.map((action) => (
    <Tooltip key={action.type} title={action.tooltip}>
      <span className="widget-action-icon">{actionIconMap[action.type]}</span>
    </Tooltip>
  ));

  return (
    <Card
      className="report-widget-card"
      title={config.title}
      extra={actions && <div style={{ display: 'flex', gap: 12 }}>{actions}</div>}
      style={{ minHeight: config.layout.minHeight }}
    >
      {children}
    </Card>
  );
};
