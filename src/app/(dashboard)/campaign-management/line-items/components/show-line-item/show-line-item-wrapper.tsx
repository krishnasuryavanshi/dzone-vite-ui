import { FC, useContext, useEffect } from 'react';
import { LineItemContext } from '../../contexts';
import { IShowLineItemContainerProps } from './show-line-item-container';

export const ShowLineItemWrapper: FC<IShowLineItemContainerProps> = ({
  lineItemId,
  campaignId,
  lineItemDetails,
  children,
}) => {
  const { setValue, setLineItem } = useContext(LineItemContext);

  useEffect(() => {
    setValue((prev: Record<string, any>) => ({
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
