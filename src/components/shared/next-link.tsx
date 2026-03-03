import { useUnsavedDataStore } from '@/stores/unsaved-data-store';
import { Link } from 'react-router';
import { useRouter } from '@/lib/hooks/use-router';
import { FC, MouseEvent, useState } from 'react';
import { Translate } from '../i18n';
import { UnsavedDataWarningConfirmDialog } from './unsaved-data-warning-confirm-dialog';

interface INextLinkProps {
  link: string;
  label: string;
  checkForUnsavedData?: boolean;
}

export const NextLink: FC<INextLinkProps> = ({
  link,
  label,
  checkForUnsavedData = true,
}) => {
  const router = useRouter();
  const [openUnsavedDataWarningModal, setOpenUnsavedDataWarningModal] =
    useState(false);
  const { actions, actionsData, hasUnsavedData, clear } =
    useUnsavedDataStore();

  const handleClick = async (e: MouseEvent<HTMLAnchorElement>) => {
    // Allow modifier keys and non-primary clicks to pass through for native browser behavior
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) {
      return;
    }

    e.preventDefault();

    if (checkForUnsavedData && hasUnsavedData()) {
      setOpenUnsavedDataWarningModal(true);
      return;
    }
    proceedNavigation();
  };

  const proceedNavigation = () => {
    handleClose();
    router.push(link);
    clear();
  };

  const handleClose = () => {
    setOpenUnsavedDataWarningModal(false);
  };

  return (
    <>
      <Link onClick={handleClick} to={link}>
        <Translate i18nKey={label} />
      </Link>
      <UnsavedDataWarningConfirmDialog
        actions={actions}
        actionsData={actionsData}
        isOpened={openUnsavedDataWarningModal}
        onProceed={proceedNavigation}
        onCancel={handleClose}
      />
    </>
  );
};
