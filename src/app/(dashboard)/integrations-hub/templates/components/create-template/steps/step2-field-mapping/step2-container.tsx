import { Flex } from '@/uicomponents/layout';
import { FC } from 'react';
import { FieldDrawerWrapper } from '../../field-drawer';
import { FieldList } from '../../field-list';
import { FieldToolbar } from '../../field-toolbar';
import { Step2HeaderInfo } from './step2-header-info';

interface IStep2ContainerProps {
  templateId?: string;
}

export const Step2Container: FC<IStep2ContainerProps> = ({ templateId }) => {
  return (
    <Flex vertical style={{ padding: '1rem', paddingTop: '0' }}>
      {/* Template info summary (readonly) */}
      <Step2HeaderInfo />

      {/* Field mapping section */}
      <Flex vertical>
        <FieldToolbar templateId={templateId} />
        <FieldList templateId={templateId} />
        <FieldDrawerWrapper />
      </Flex>
    </Flex>
  );
};
