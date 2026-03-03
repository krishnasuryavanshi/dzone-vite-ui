
import { DzRecord } from '@/lib/types';
import { hasUnsavedChanges } from '@/lib/utils';
import { createContext, FC, PropsWithChildren, useState } from 'react';

type UnsavedDataWarningContextType = {
  setSourceObject: (source: any) => void;
  setTargetObject: (target: any) => void;
  updateTargetObject: (target: any) => void;

  actions: DzRecord | null;
  actionsData: DzRecord | null;

  setActionsObject: (actions: DzRecord | null) => void;
  setActionsDataObject: (actionsData: DzRecord | null) => void;

  clear: () => void;
  hasUnsavedData: () => boolean;
};

export const UnsavedDataWarningContext =
  createContext<UnsavedDataWarningContextType>(
    {} as UnsavedDataWarningContextType,
  );

type UnsavedDataWarningContextProviderProps = {};

export const UnsavedDataWarningContextProvider: FC<
  PropsWithChildren<UnsavedDataWarningContextProviderProps>
> = ({ children }) => {
  const [source, setSource] = useState<any>(null);
  const [target, setTarget] = useState<any>(null);

  const [actions, setActions] = useState<DzRecord | null>(null);
  const [actionsData, setActionsData] = useState<DzRecord | null>(null);

  const setSourceObject = (sourceObj: any) => {
    setSource(sourceObj);
    setTarget(sourceObj);
  };

  const setTargetObject = (targetObj: any) => {
    setTarget(targetObj);
  };

  const updateTargetObject = (targetObj: any) => {
    setTarget({ ...target, ...targetObj });
  };

  const setActionsObject = (actionsObj: DzRecord | null) => {
    setActions(actionsObj);
  };

  const setActionsDataObject = (actionsDataObj: DzRecord | null) => {
    setActionsData(actionsDataObj);
  };

  const clear = () => {
    setSource(null);
    setTarget(null);
    setActions(null);
    setActionsData(null);
  };

  const hasUnsavedData = () => {
    return hasUnsavedChanges(source, target);
  };

  return (
    <UnsavedDataWarningContext.Provider
      value={{
        setSourceObject,
        setTargetObject,
        updateTargetObject,

        actions,
        actionsData,
        setActionsObject,
        setActionsDataObject,
        clear,
        hasUnsavedData,
      }}>
      {children}
    </UnsavedDataWarningContext.Provider>
  );
};
