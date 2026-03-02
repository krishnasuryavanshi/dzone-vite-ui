'use client';
import { ReactNode, createContext, useEffect, useState } from 'react';
import { ILineItem, ILineItemContext, IStatusPicklist } from '../lib/types';
import { fetchStatusPicklist } from '../services';

const defaultContextValue: ILineItemContext = {
  value: {},
  setValue: () => {},
  lineItem: {} as ILineItem,
  setLineItem: () => {},
  isLoading: false,
  showLoader: (loader: boolean) => {},
  updateList: undefined,
  setUpdateList: () => {},
  statusList: [],
};

const LineItemContext = createContext<ILineItemContext>(defaultContextValue);

const LineItemContextProvider = ({ children }: { children: ReactNode }) => {
  const [value, setValue] = useState<Record<string, string>>({});
  const [lineItem, setLineItem] = useState<ILineItem>({} as ILineItem);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [updateList, setUpdateList] = useState<ILineItem | undefined>(
    undefined,
  );
  const [statusList, setStatusList] = useState<IStatusPicklist[]>([]);

  const fetchStatusData = async () => {
    const data = await fetchStatusPicklist();
    setStatusList(data as unknown as IStatusPicklist[]);
  };

  useEffect(() => {
    fetchStatusData();
  }, []);

  const showLoader = (loader: boolean) => {
    setIsLoading(loader);
  };

  return (
    <LineItemContext.Provider
      value={{
        value,
        setValue,
        lineItem,
        setLineItem,
        isLoading,
        showLoader,
        updateList,
        setUpdateList,
        statusList,
      }}>
      {children}
    </LineItemContext.Provider>
  );
};

export { LineItemContext, LineItemContextProvider };
