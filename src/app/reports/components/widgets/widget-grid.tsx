import React from 'react';
import { Row, Col } from 'antd';
import { WidgetConfig } from '../../lib/types';
import { WidgetCard } from './widget-card';
import { WidgetRenderer } from './widget-renderer';

interface WidgetGridProps {
  widgets: WidgetConfig[];
}

export const WidgetGrid: React.FC<WidgetGridProps> = ({ widgets }) => {
  return (
    <Row gutter={[16, 16]}>
      {widgets.map((widget) => (
        <Col key={widget.id} span={widget.layout.colSpan}>
          <WidgetCard config={widget}>
            <WidgetRenderer config={widget} />
          </WidgetCard>
        </Col>
      ))}
    </Row>
  );
};
