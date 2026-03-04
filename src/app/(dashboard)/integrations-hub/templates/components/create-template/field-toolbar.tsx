import { Translate } from '@/components/i18n';
import { DzBox } from '@/components/layout/v1';
import { Flex } from '@/uicomponents/layout';
import { Text } from '@/uicomponents/text';
import { FC } from 'react';
import { useTemplateStore } from '../../stores';
import { ExportSampleAction } from './field-toolbar-actions';
import { DZONE_CLR_BLACK, DZONE_CLR_GRAY_4 } from '@/lib/constants';

interface IFieldToolbarProps {
  templateId?: string;
}

export const FieldToolbar: FC<IFieldToolbarProps> = () => {
  const { visibleFieldsCount } = useTemplateStore();

  return (
    <DzBox
      className='dz-field-toolbar'
      dzOneBox
      style={{
        padding: '0.5rem',
        marginBottom: '0.5rem',
        background: DZONE_CLR_GRAY_4,
      }}
    >
      <Flex justify='space-between'>
        <Flex gap={'0.5rem'} align='center'>
          <Text style={{ color: DZONE_CLR_BLACK }}>
            {visibleFieldsCount} <Translate i18nKey='pages.templates.label.fieldsVisible' />
          </Text>
          <ExportSampleAction />
        </Flex>
        {/* <Button
          type='primary'
          size='small'
          disabled
          style={{ display: 'flex', gap: '0.25rem' }}>
          <DirectInboxIcon
            style={{
              filter: 'grayscale(100%) brightness(0.5)',
              opacity: 0.6,
            }}
          />
          Send Test Data
        </Button> */}
      </Flex>
    </DzBox>
  );
};
