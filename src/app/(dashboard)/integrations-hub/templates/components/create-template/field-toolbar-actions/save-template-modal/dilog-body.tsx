import { Translate } from '@/components/i18n';
import { Button, Text, Title } from '@/uicomponents';
import { Flex } from '@/uicomponents/layout';
import { FC, useState } from 'react';
import { DilogOption } from './dilog-option';
import { DzBox } from '@/components/layout/v1';

interface IDilogBodyProps {
  handleClose: () => void;
  handleUpdate: (isUpdate: boolean) => void;
}

export const DilogBody: FC<IDilogBodyProps> = ({
  handleClose,
  handleUpdate,
}) => {
  const [activity, setActivity] = useState<'save' | 'update'>('save');

  const handleProceed = () => {
    if (activity === 'update') {
      handleUpdate(true);
    } else {
      handleUpdate(false);
    }
  };

  return (
    <DzBox style={{ padding: '0 2.75rem', marginTop: '1rem' }}>
      <Flex vertical gap={'0.5rem'}>
        <Title level={5} style={{ fontWeight: 400 }}>
          <Translate i18nKey='Save Options' />
        </Title>
        <DilogOption isActive={activity === 'save'}>
          <Flex vertical gap={'0.5rem'} onClick={() => setActivity('save')}>
            <Flex align='center'>
              <Title
                level={5}
                style={{ margin: 0, fontWeight: 500, paddingRight: '0.25rem' }}>
                <Translate i18nKey='Save as New Template' />
              </Title>

              <Text
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 400,
                  color: '#707070',
                }}>
                (<Translate i18nKey='Recommended' />)
              </Text>
            </Flex>
            <Text style={{ fontSize: '0.875rem', fontWeight: 400 }}>
              <Translate i18nKey='Create a new template with the updates made. This will not impact the existing templates and the deliveries across existing line items.' />
            </Text>
          </Flex>
        </DilogOption>
        <DilogOption isActive={activity === 'update'}>
          <Flex vertical gap={'0.5rem'} onClick={() => setActivity('update')}>
            <Title level={5} style={{ margin: 0, fontWeight: 500 }}>
              <Translate i18nKey='Update Existing Template' />
            </Title>
            <Text style={{ fontSize: '0.875rem', fontWeight: 400 }}>
              <Translate i18nKey='Apply the changes to the existing template. The changes will impact the existing lead deliveries across all the line items that use this template. ' />
            </Text>
          </Flex>
        </DilogOption>
        <Flex justify='flex-end' gap={'1rem'} style={{ marginTop: '2rem' }}>
          <Button onClick={handleClose}>
            <Translate i18nKey='Cancel' />
          </Button>
          <Button type='primary' onClick={handleProceed}>
            <Translate i18nKey='Proceed to Save' />
          </Button>
        </Flex>
      </Flex>
    </DzBox>
  );
};
