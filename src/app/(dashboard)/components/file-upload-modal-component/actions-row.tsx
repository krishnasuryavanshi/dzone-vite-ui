import { Translate } from '@/components/i18n';
import { Button } from '@/uicomponents/index';
import { Flex } from '@/uicomponents/layout';
import { FC } from 'react';
import { FileTypeSelection } from '../../lib/enums';
import { DZONE_CLR_BLACK } from '@/lib/constants';

interface IActionsRowProps {
  enableSave: boolean;
  handleCancel: () => void;
  handleSave: () => void;
  fileTypeSelection: string;
  isUploading?: boolean;
}

export const ActionsRow: FC<IActionsRowProps> = ({
  enableSave,
  handleCancel,
  handleSave,
  fileTypeSelection,
  isUploading = false,
}) => {
  return (
    <Flex justify='end' gap={'1rem'} style={{ marginTop: '2rem' }}>
      <Button
        style={{ border: `1px solid ${DZONE_CLR_BLACK}` }}
        size='small'
        onClick={handleCancel}
        disabled={isUploading}>
        <Translate i18nKey='Cancel' />
      </Button>
      <Button
        disabled={!enableSave || isUploading}
        type='primary'
        size='small'
        onClick={handleSave}
        className='dz-btn-action-1'
        loading={isUploading}>
        <Translate
          i18nKey={
            fileTypeSelection === FileTypeSelection.Leads ? 'Save' : 'Upload'
          }
        />
      </Button>
    </Flex>
  );
};
