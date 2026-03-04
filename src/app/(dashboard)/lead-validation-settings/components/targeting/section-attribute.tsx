import { DzBox } from '@/components/layout/v1';
import { TargetingInclusion, TargetingSwitch } from './inputs';
import { JobTitle } from '@/components/job-title';
import { Col, Row } from '@/uicomponents/layout/grid';

import './section-attribute.scss';

type SectionAttributeProps = {
  attribute: Record<string, any>;
  sectionName: string;
};
export const SectionAttribute = ({ sectionName, attribute }: SectionAttributeProps) => {
  const renderInput = () => {
    if (attribute.type === 'inclusion') {
      return <TargetingInclusion sectionName={sectionName} attribute={attribute} />;
    } else if (attribute.type === 'job_title') {
      return <JobTitle onChange={() => {}} />;
    } else if (
      [
        'switch_suppression_inclusion',
        'switch_chips_inclusion',
        'switch_chips',
        'switch_dropdown_custom',
        'switch_dropdown_searchable',
      ].includes(attribute.type)
    ) {
      return <TargetingSwitch sectionName={sectionName} attribute={attribute} />;
    }
    return null;
  };

  return (
    <Row>
      <Col xs={24} sm={24} md={24} xl={24} xxl={16}>
        <DzBox
          style={{
            border: '1px solid #E5EBF1',
            borderRadius: '0.25rem',
          }}
          className='section-attributes-container'
        >
          {renderInput()}
        </DzBox>
      </Col>
    </Row>
  );
};
