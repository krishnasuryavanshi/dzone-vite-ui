import { FC, PropsWithChildren } from 'react';
import { useTemplateStore } from '../../../stores';
import { FieldDrawerContainer } from './field-drawer-container';

interface IFieldDrawerWrapperProps extends PropsWithChildren {}

export const FieldDrawerWrapper: FC<IFieldDrawerWrapperProps> = ({}) => {
  const { selectedFieldIndex, isFieldDrawerOpen, closeFieldDrawer } = useTemplateStore();

  if (selectedFieldIndex === -1 || !isFieldDrawerOpen) {
    return null;
  }
  return (
    <FieldDrawerContainer
      index={selectedFieldIndex}
      isFieldDrawerOpen={isFieldDrawerOpen}
      closeFieldDrawer={closeFieldDrawer}
    />
  );
};
