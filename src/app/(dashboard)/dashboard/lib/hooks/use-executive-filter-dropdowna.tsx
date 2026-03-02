import { useEffect, useState } from 'react';

export interface IExecutiveFilterDropdowns {
    
  submit: number;
  reset: number;
}

export function useExecutiveFilterDropdowns({
  submit,
  reset,
}: IExecutiveFilterDropdowns) {
  const [selectedUnit, setSelectedUnit] = useState<string[]>(['Revenue'])
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<string[]>(['MTD'])

  const submitAction = (iniatialState: boolean = false) => {
  };

  useEffect(() => {
    submitAction(true);
  }, [reset]);

  useEffect(submitAction, [submit]);

  const handleSelectionChange = (data: {
    type: string;
    selectedItems: string[];
  }) => {
    const setMethod =
      (data.type === "selectedTimeFrame" && setSelectedTimeFrame) ||
      (data.type === 'selectedUnit' && setSelectedUnit)

    setMethod &&
      setMethod(data.selectedItems.length ? data.selectedItems : ['all']);
  };

  return {
    selectedTimeFrame,
    selectedUnit,
    handleSelectionChange,
   
  };
}
