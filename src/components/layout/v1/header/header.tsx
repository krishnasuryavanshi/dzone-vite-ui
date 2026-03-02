'use client';
import React, { FC, useEffect, useState } from 'react';
import { UserProfile } from '../../user-profile';
import { HeaderPanel } from './header-panel';
import { Flex } from '@/uicomponents/layout';
import { GlobalSearch } from '../../global-search';

interface IHeaderProps {}

export const Header: FC<IHeaderProps> = () => {
  const [isGlobalSearchDisabled, setIsGlobalSearchDisabled] =
    useState<boolean>(false);

  useEffect(() => {
    setIsGlobalSearchDisabled(true);
  }, []);

  return (
    <HeaderPanel>
      <Flex justify='end' align='center' style={{ width: '100%' }}>
        {/* Commenting this out for now, this will be used in the future */}
        {/* <GlobalSearch isGlobalSearchDisabled={isGlobalSearchDisabled} /> */}
        <UserProfile />
      </Flex>
    </HeaderPanel>
  );
};
