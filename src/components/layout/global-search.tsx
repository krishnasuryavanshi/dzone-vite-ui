import React, { FC } from 'react';
import { DzSerachDropdown } from '../shared/custom/dz-serach-dropdown';
import './global-search.scss';

interface Props {
  isGlobalSearchDisabled: boolean;
}

export const GlobalSearch: FC<Props> = ({ isGlobalSearchDisabled }) => {
  return (
    <>
      <DzSerachDropdown
        className={`global-search-input ${isGlobalSearchDisabled ? 'disabled' : ''}`}
        placeholder={'Search'}
        show={true}
        isGlobalSearchDisabled={isGlobalSearchDisabled}
        isGlobalSearchPadding={true}
      />
    </>
  );
};
