import React, { useEffect, useState } from 'react';
import { useValidationSettingStore } from '../../store';
import { MapFunction } from '@/components/shared';
import { ValidationSettingRuleSection } from './validation-setting-rule-section';
import { DzBox } from '@/components/layout/v1';
import { Col, Row } from '@/uicomponents/layout/grid';

export const ValidationSettingTabItemContent = () => {
  const { getValidationSettingRuleSections, activeRule, leadValidationSettingConfig } =
    useValidationSettingStore();
  const [ruleSections, setRuleSections] = useState<Record<string, any>[]>([]);

  useEffect(() => {
    if (leadValidationSettingConfig && activeRule) {
      const sections = getValidationSettingRuleSections();
      setRuleSections(sections);
    } else {
      setRuleSections([]);
    }
  }, [leadValidationSettingConfig, activeRule]);

  const renderSection = (section: Record<string, any>, index: number) => {
    return (
      <ValidationSettingRuleSection
        name={section.name}
        key={index}
        noBorder={section.name === 'LOOPBACK_PERIOD' || section.noBorder}
      />
    );
  };

  return (
    <DzBox
      style={{
        maxHeight: 'calc(100vh - 20rem)',
        overflowY: 'auto',
      }}
    >
      <Row>
        <Col xl={24} xxl={16}>
          <MapFunction items={ruleSections} renderItem={renderSection} />
        </Col>
      </Row>
    </DzBox>
  );
};
