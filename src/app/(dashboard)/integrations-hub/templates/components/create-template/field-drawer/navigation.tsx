import { DzBox } from '@/components/layout/v1';
import { DZONE_CLR_BLACK } from '@/lib/constants';
import { LeftOutlined, RightOutlined } from '@/uicomponents/icons';
import { Flex } from '@/uicomponents/layout';
import { Col, Row } from '@/uicomponents/layout/grid';
import { Text } from '@/uicomponents/text';
import { FC } from 'react';

interface INavigationProps {
  totalFields: number;
  currentFieldNumber: number;
  handleNext: () => void;
  handlePrev: () => void;
}

export const Navigation: FC<INavigationProps> = ({
  totalFields,
  currentFieldNumber,
  handleNext,
  handlePrev,
}) => {
  return (
    <DzBox
      style={{
        backgroundColor: '#EFF4FD',
        borderRadius: '8px',
        padding: '0.375rem',
        width: 'fit-content',
      }}>
      <Flex
        gap={'0.5rem'}
        align='center'
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <Row
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
          <Col>
            <Text
              style={{
                fontSize: '0.875rem',
                fontWeight: 'normal',
                color: `${DZONE_CLR_BLACK}`,
                textAlign: 'center',
              }}>
              Field{' '}
              <span style={{ fontWeight: '600' }}>{currentFieldNumber}</span> of{' '}
              {totalFields} visible Fields
            </Text>
          </Col>
          <Col>
            <Flex gap={'0.25rem'} align='center'>
              <LeftOutlined
                disabled={currentFieldNumber === 1}
                onClick={() => {
                  currentFieldNumber > 1 && handlePrev();
                }}
                style={{
                  stroke: `${DZONE_CLR_BLACK}`,
                  strokeWidth: '50',
                  fontSize: '0.625rem',
                  cursor: 'pointer',
                  background: '#fff',
                  padding: '0.25rem',
                  borderRadius: '0.25rem',
                }}
              />
              <RightOutlined
                disabled={currentFieldNumber === totalFields}
                onClick={() => {
                  currentFieldNumber < totalFields && handleNext();
                }}
                style={{
                  stroke: `${DZONE_CLR_BLACK}`,
                  strokeWidth: '50',
                  fontSize: '0.625rem',
                  cursor: 'pointer',
                  background: '#fff',
                  padding: '0.25rem',
                  borderRadius: '0.25rem',
                }}
              />
            </Flex>
          </Col>
        </Row>
      </Flex>
    </DzBox>
  );
};
