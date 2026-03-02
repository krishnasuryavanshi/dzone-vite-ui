import { Translate } from '@/components/i18n';
import { Flex } from '@/uicomponents/layout';
import { Text } from '@/uicomponents/text';
import { Tooltip } from 'antd';
import React, { FC } from 'react';

interface IFilterMenuItemLabelProps {
  name: string;
  id?: string;
  all?: boolean;
  count?: number;
}

export const FilterMenuItemLabel: FC<IFilterMenuItemLabelProps> = ({
  name,
  id,
  all,
  count,
}) => {
  return (
    <Tooltip
      placement="right"
      title={<Translate i18nKey={name} />}
      arrow={false}>
      <Flex
        vertical
        className="dz-dropdown-menu-item">
        <Text
          style={{ fontSize: '0.875rem', color: '#000', fontWeight: '400' }}
          className="ellipsis-text">
          {all && count ? (
            <AllLabel
              name={name}
              count={count}
            />
          ) : (
            <Translate i18nKey={name} />
          )}
        </Text>
        <Text
          style={{ fontSize: '0.75rem', color: '#000', fontWeight: '300' }}
          className="ellipsis-text">
          {id}
        </Text>
      </Flex>
    </Tooltip>
  );
};

const AllLabel = ({ name, count }: { name: string; count?: number }) => (
  <Flex justify="space-between">
    <Text style={{ fontSize: '0.875rem', color: '#000', fontWeight: '400' }}>
      <Translate i18nKey={name} />
    </Text>
    <Text style={{ fontSize: '0.875rem', color: '#000', fontWeight: '400' }}>
      {count}
    </Text>
  </Flex>
);
