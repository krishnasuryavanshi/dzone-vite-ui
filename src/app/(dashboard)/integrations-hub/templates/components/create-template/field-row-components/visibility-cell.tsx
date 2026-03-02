import { Switch } from '@/uicomponents';
import { FC, useEffect, useState } from 'react';
import { ITemplateFieldResponse } from '../../../lib/types';

interface IVisibilityCellProps {
  templateField: ITemplateFieldResponse;
  handleVisibilityChange: (
    isVisible: boolean,
    templateField: ITemplateFieldResponse,
  ) => void;
  isEditTemplateAllowed: boolean;
}

export const VisibilityCell: FC<IVisibilityCellProps> = ({
  templateField,
  handleVisibilityChange,
  isEditTemplateAllowed,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (templateField) {
      setIsVisible(!!templateField.visible);
    } else {
      setIsVisible(false);
    }
  }, [templateField]);

  const onChange = (checked: boolean) => {
    setIsVisible(checked);
    handleVisibilityChange(checked, templateField);
  };

  return (
    <Switch
      checked={isVisible}
      onChange={onChange}
      disabled={!isEditTemplateAllowed}
      className={`action-item-switch ${isEditTemplateAllowed ? 'checked' : ''}`}
    />
  );
};
