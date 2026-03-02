import { DzBox } from '@/components/layout/v1';
import { DZONE_CLR_BLACK } from '@/lib/constants';
import { Input } from '@/uicomponents/form/input';
import { SearchOutlined, CloseCircleOutlined } from '@/uicomponents/icons';
import { FC } from 'react';

interface IPermissionSearchInputProps {
  searchTerm: string;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearSearch: () => void;
}

export const PermissionSearchInput: FC<IPermissionSearchInputProps> = ({
  searchTerm,
  handleSearch,
  clearSearch,
}) => {
  return (
    <DzBox className='dz-serach-dropdown'>
      <Input
        placeholder='Search'
        value={searchTerm}
        suffix={
          searchTerm ? (
            <CloseCircleOutlined
              style={{ color: DZONE_CLR_BLACK, cursor: 'pointer' }}
              onClick={clearSearch}
            />
          ) : (
            <SearchOutlined style={{ color: DZONE_CLR_BLACK }} />
          )
        }
        onChange={handleSearch}
      />
    </DzBox>
  );
};
