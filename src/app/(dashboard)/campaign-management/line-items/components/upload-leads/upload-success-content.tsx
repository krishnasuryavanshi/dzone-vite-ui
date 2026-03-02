import { Translate } from '@/components/i18n';
import { transformPath } from '@/lib/utils/string';
import { Button } from '@/uicomponents';
import React, { FC, useContext } from 'react';
import { LineItemContext } from '../../contexts';

interface IUploadSuccessContentProps {
  show: boolean;
  info?: Record<string, string | number | boolean>;
  onClickViewLeads?: (data: Record<string, string | number | boolean>) => void;
}

const Path = '/campaign-management/leads?batchId={batchId}';

export const UploadSuccessContent: FC<IUploadSuccessContentProps> = ({
  show,
  info,
  onClickViewLeads,
}) => {
  const { value } = useContext(LineItemContext);

  if (!show) {
    return null;
  }

  const path = transformPath(Path, {
    batchId: info?.batchId,
    ...value,
  });

  const handlClickOnViewLeads = () => {
    onClickViewLeads &&
      onClickViewLeads({
        isDialogOpen: false,
        dialogType: 'Progress',
        message: '',
      });
  };

  return (
    <Button
      type='link'
      style={{
        color: '#04CA56',
        border: '1px solid #04CA56',
        padding: '0.5rem 1rem',
        height: '2.625rem',
      }}
      href={path}
      onClick={handlClickOnViewLeads}>
      <Translate i18nKey='Click to view the leads' />
    </Button>
  );
};
