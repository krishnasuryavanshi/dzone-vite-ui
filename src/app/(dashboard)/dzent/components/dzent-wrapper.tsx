import { DzBox } from '@/components/layout/v1';
import { Col, Row } from '@/uicomponents/layout/grid';
import { CSSProperties } from 'react';
import { DZENT_BG_WHITE } from '@/lib/constants/color-constants';
import { ChatWidgetContainer } from './chat-widget';
import { DZentContainerProps } from './dzent-container';

import { DzentSidebar } from './dzent-sidebar';

const CommonStyles: CSSProperties = {
  height: '100%',
  position: 'relative',
  backgroundColor: DZENT_BG_WHITE,
  borderRadius: '0.5rem',
};

export const DzentWrapper = ({ action }: DZentContainerProps) => {
  return (
    <DzBox className='dzent-wrapper show-scroll' style={{ height: '100%' }}>
      <Row gutter={[10, 10]} style={{ height: '100%' }}>
        <Col xs={0} sm={0} md={8} xl={6}>
          <DzentSidebar />
        </Col>
        <Col xs={24} sm={24} md={16} xl={18}>
          <DzBox style={CommonStyles}>
            <ChatWidgetContainer />
          </DzBox>
        </Col>
      </Row>
    </DzBox>
  );
};
