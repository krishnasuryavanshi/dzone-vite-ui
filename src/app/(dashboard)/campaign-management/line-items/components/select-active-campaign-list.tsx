'use client';
import { Input, Select } from '@/uicomponents/form/input';
import { Flex, Space } from '@/uicomponents/layout';
import { IActiveCampaignList } from '../lib/types';
import { FC, useState } from 'react';
import { Translate } from '@/components/i18n';
import { Text, Tooltip } from '@/uicomponents';
import { CheckOutlined, InfoCircleOutlined } from '@/uicomponents/icons';
import './select-active-campaign-list.scss';
import { CLR_BLUE_LIGHT } from '@/lib/constants';

interface ISelectActiveCampaignListProps {
  activeCampaignList?: IActiveCampaignList[];
  selectedActiveCampaign: string;
  selectCampaign: (campaign: any) => void;
}
export const SelectActiveCampaignList: FC<ISelectActiveCampaignListProps> = ({
  activeCampaignList,
  selectedActiveCampaign,
  selectCampaign,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(true);

  const filteredCampaignList = activeCampaignList?.filter((campaign) =>
    `${campaign.campaignId} ${campaign.name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  const handleChange = (value: string) => {
    selectCampaign(value);
  };

  return (
    <Flex vertical style={{ paddingLeft: '2.5rem' }} gap='0.5rem'>
      <Flex gap='0.5rem' align='center'>
        <Text style={{ margin: 0, fontWeight: 500 }}>
          <Translate i18nKey='pages.lineItems.label.selectCampaign' />
        </Text>
        <Tooltip
          placement='right'
          overlayStyle={{ whiteSpace: 'nowrap', maxWidth: 'none' }}
          overlayInnerStyle={{
            fontSize: '12px',
            textAlign: 'center',
          }}
          title={<Translate i18nKey='pages.associateClonedItemWithCampaign' />}>
          <InfoCircleOutlined />
        </Tooltip>
      </Flex>
      <Select
        style={{ width: '100%' }}
        className='select-active-campaing-list'
        size='large'
        value={selectedActiveCampaign || undefined}
        placeholder='Select Campaign'
        onClick={(e) => e.stopPropagation()}
        onChange={handleChange}
        onDropdownVisibleChange={(open) => setDropdownVisible(open)}
        dropdownRender={(menu) => (
          <Flex vertical>
            <Input
              placeholder='Type Campaign ID or Name'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ marginBottom: '8px', padding: '8px' }}
            />
            <Space style={{ padding: '8px 16px', fontWeight: 'bold' }}>
              Active Campaigns {filteredCampaignList?.length}
            </Space>
            {menu}
          </Flex>
        )}
        options={filteredCampaignList?.map((campaign) => ({
          label: (
            <Flex
              align='center'
              justify='space-between'
              style={{ width: '100%' }}>
              {`${campaign.campaignId} - ${campaign.name}`}
              {campaign.id === selectedActiveCampaign && dropdownVisible && (
                <CheckOutlined
                  style={{
                    display: 'inline-block',
                    color: `${CLR_BLUE_LIGHT}`,
                  }}
                />
              )}
            </Flex>
          ),
          value: campaign.id,
        }))}
      />
    </Flex>
  );
};
