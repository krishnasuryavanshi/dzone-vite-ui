import { FC, useEffect } from 'react';
import { useLineItemContextStore } from '../../store/use-line-item-context-store';
import { IShowLineItemContainerProps } from './show-line-item-container';

export const ShowLineItemWrapper: FC<IShowLineItemContainerProps> = ({
  lineItemId,
  campaignId,
  lineItemDetails,
  children,
}) => {
  const { setValue, setLineItem } = useLineItemContextStore();

  useEffect(() => {
    setValue((prev: Record<string, string>) => ({
      ...prev,
      lineItemId,
      campaignId,
    }));
  }, [lineItemId, campaignId]);

  useEffect(() => {
    if (lineItemDetails) {
      setLineItem({ ...lineItemDetails });
    }
  }, [lineItemDetails]);

  return <>{children}</>;
};
