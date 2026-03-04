import { DzBox } from '@/components/layout/v1';
import { MapFunction } from '@/components/shared';
import { DzRecord } from '@/lib/types';
import { Flex } from '@/uicomponents/layout';
import { useEffect, useState } from 'react';
import { useValidationSettingStore } from '../../store';
import { TargetingValidationSettingSection } from './targeting-validation-setting-section';

export const TargetingValidationSettingSections = () => {
  const [sections, setSections] = useState<DzRecord[]>([]);
  const { getValidationSettingRuleSections, activeRule } = useValidationSettingStore();

  useEffect(() => {
    if (activeRule) {
      const sections = getValidationSettingRuleSections();
      setSections(sections);
    } else {
      setSections([]);
    }
  }, [activeRule]);

  const renderSection = (section: DzRecord) => {
    return <TargetingValidationSettingSection name={section.name} key={section.name} />;
  };

  return (
    <DzBox
      className='targeting-validation-settings'
      style={{ maxHeight: 'calc(100vh - 20rem)', overflowY: 'auto' }}
    >
      <Flex vertical gap='1rem'>
        <MapFunction items={sections} renderItem={renderSection} />
      </Flex>
    </DzBox>
  );
};
