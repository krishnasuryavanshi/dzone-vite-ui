import { Translate } from '@/components/i18n';
import { DZONE_CLR_BLACK } from '@/lib/constants';
import { Button } from '@/uicomponents/index';
import Link from 'next/link';
import React, { FC } from 'react';

const CreateNewTemplateLink = '/integrations-hub/templates/create';

interface ICreateNewTemplateActionProps {}

export const CreateNewTemplateAction: FC<
  ICreateNewTemplateActionProps
> = ({}) => {
  return (
    <Link href={CreateNewTemplateLink}>
      <Button
        style={{
          display: 'flex',
          alignItems: 'center',
          borderRadius: '0.3125rem',
          background:
            'linear-gradient(white, white) padding-box, linear-gradient(109deg, #FFB8EC 4.89%, #F3D6FF 51.39%, #7D88FF 97.01%) border-box',
          border: '1.5px solid transparent',
          height: '2.25rem',
          color: DZONE_CLR_BLACK,
        }}>
        <Translate i18nKey='pages.templates.label.newTemplate' />
      </Button>
    </Link>
  );
};
