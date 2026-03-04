import { Translate } from '@/components/i18n';
import { Button } from '@/uicomponents/button';
import { FC } from 'react';

interface IToastWithActionButtonProps {
  onClick?: () => void;
  buttonText?: string;
  show: boolean;
  variant: 'Success' | 'Failure';
}

export const ToastWithActionButton: FC<IToastWithActionButtonProps> = ({
  onClick,
  buttonText,
  show,
  variant,
}) => {
  if (!show) {
    return null;
  }

  const onhandleClick = () => {
    if (onClick) {
      onClick(); // This will invoke the passed `handleRetryAttempt`
    }
  };

  return (
    <>
      {buttonText ? (
        <Button
          style={{
            color: variant === 'Success' ? '#04CA56' : '#ff602e',
            border: `1px solid ${variant === 'Success' ? '#04CA56' : '#ff602e'}`,
            padding: '0.5rem 1rem',
            height: '2.625rem',
          }}
          onClick={onhandleClick}
        >
          <Translate i18nKey={buttonText} />
        </Button>
      ) : null}
    </>
  );
};
