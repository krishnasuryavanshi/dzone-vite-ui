import { Translate } from '@/components/i18n';
import { NextLink } from '@/components/shared';
import { FC } from 'react';

interface IMenuLinkProps {
  label: string;
  link?: string;
}

export const MenuLink: FC<IMenuLinkProps> = ({ label, link }) => {
  if (!link) {
    return <Translate i18nKey={label} />;
  }
  return <NextLink link={link} label={label} />;
};
