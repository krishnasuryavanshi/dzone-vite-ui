import { MapFunction } from '@/components/shared';
import { Flex } from '@/uicomponents/layout';
import { Text } from '@/uicomponents/text';
import { useEffect, useState } from 'react';
import { useValidationSettingStore } from '../../store';
import { SectionAttribute } from './section-attribute';

type TargetingValidationSettingSectionProps = {
  name: string;
};

export const TargetingValidationSettingSection = ({
  name,
}: TargetingValidationSettingSectionProps) => {
  const [section, setSection] = useState<Record<string, any> | null>(null);
  const { getValidationSettingRuleSection } = useValidationSettingStore();

  useEffect(() => {
    const sectionDetails = getValidationSettingRuleSection(name);
    if (sectionDetails) {
      setSection(sectionDetails);
    } else {
      setSection(null);
    }
  }, [name]);

  const renderAttribute = (item: Record<string, any>, index: number) => {
    return <SectionAttribute sectionName={name} attribute={item} key={index} />;
  };

  if (!section) {
    return null;
  }

  return (
    <Flex vertical gap={'1rem'}>
      <Flex
        style={{
          background: '#EAF1FF',
          height: '3rem',
          paddingInline: '1rem',
          marginInline: '0.25rem',
        }}
        align='center'>
        <Text strong>{section.description}</Text>
      </Flex>
      <Flex vertical gap='0.5rem' style={{ paddingInline: '1.75rem' }}>
        <MapFunction items={section.attributes} renderItem={renderAttribute} />
      </Flex>
    </Flex>
  );
};
