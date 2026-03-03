import { Hideable } from '@/components/shared';
import { ArrowLeft } from '@/uicomponents/icons/svgs';
import { Flex, Space } from '@/uicomponents/layout';
import { Link } from 'react-router-dom';
import { FC } from 'react';
import { TemplateStep } from '../../lib/enums';
import { useTemplateStore } from '../../stores';
import { Step2Actions } from './steps/step2-field-mapping/step2-actions';

interface ITemplateHeaderProps {
  existingTemplate: boolean;
  templateId?: string;
}

export const TemplateHeader: FC<ITemplateHeaderProps> = ({
  existingTemplate,
}) => {
  const { currentStep, resetStore, updatedTemplateData } = useTemplateStore();

  const isFieldMappingStep =
    currentStep === TemplateStep.FieldMapping || existingTemplate;
  const lineItemName = updatedTemplateData?.lineItemName || '';

  const getHeaderText = () => {
    if (currentStep === TemplateStep.FieldMapping) {
      return lineItemName ? `Field Mapping : ${lineItemName}` : 'Field Mapping';
    }
    return 'Provide the necessary information to set up a delivery template.';
  };

  return (
    <Flex
      justify='space-between'
      align='center'
      style={{ padding: '0.5rem 1rem', paddingBottom: '0' }}>
      <Flex gap='0.5rem' align='center'>
        <Hideable show={!isFieldMappingStep}>
          <Link to='/integrations-hub/templates' onClick={resetStore}>
            <Flex
              align='center'
              justify='center'
              style={{
                borderRadius: '17px',
                background: '#C8D4F5',
                height: '1.5rem',
                width: '1.5rem',
                cursor: 'pointer',
                paddingTop: '0.25rem',
              }}>
              <ArrowLeft />
            </Flex>
          </Link>
        </Hideable>
        <Space style={{ fontSize: '1rem', color: '#000', fontWeight: 500 }}>
          {getHeaderText()}
        </Space>
      </Flex>
      <Hideable show={isFieldMappingStep}>
        <Step2Actions />
      </Hideable>
    </Flex>
  );
};
