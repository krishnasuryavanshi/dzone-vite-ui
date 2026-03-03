import React, { FC, SyntheticEvent, useContext } from 'react';
import { Button, Dropdown, Link } from '@/uicomponents';
import { MoreOutlined } from '@/uicomponents/icons';
import { ICampaign } from './lib/types';
import { generateCampaignLinks } from './lib/utils';
import {
  cloneCampaign,
  validateCampaign,
  validateCreateLineItemsAction,
} from './services';
import { showNotification } from '@/services';
import { usePermissionCheck, useQueryState } from '@/lib/hooks';
import { useRouter } from '@/lib/hooks/use-router';
import { CampaignContext } from './context';
import {
  CampaignActionsEnum,
  LineItemActionsEnum,
} from '@/lib/enums/permissions';
import { Link as NextJsLink } from 'react-router-dom';
import { ThreeDotsActionsIcon } from '@/uicomponents/icons/svgs';

interface ICampaignRowActionsProps {
  campaign: ICampaign;
}

type PermissionKeys = `${LineItemActionsEnum}` | `${CampaignActionsEnum}`;

type ItemConfig = {
  key: string;
  permission: PermissionKeys;
  label: React.ReactNode;
};

export const CampaignRowActions: FC<ICampaignRowActionsProps> = ({
  campaign,
}) => {
  const { setQueryState } = useQueryState();
  const { showLoader }: any = useContext(CampaignContext);
  const permissions: Partial<Record<PermissionKeys, boolean>> = {
    [CampaignActionsEnum.View]: usePermissionCheck(CampaignActionsEnum.View),
    [CampaignActionsEnum.Edit]: usePermissionCheck(CampaignActionsEnum.Edit),
    [LineItemActionsEnum.Create]: usePermissionCheck(
      LineItemActionsEnum.Create,
    ),
    [LineItemActionsEnum.View]: usePermissionCheck(LineItemActionsEnum.View),
    [CampaignActionsEnum.Create]: usePermissionCheck(
      CampaignActionsEnum.Create,
    ),
  };
  const listOfLineItemLink = generateCampaignLinks(campaign, 'lineItems');
  const createLineItemLink = generateCampaignLinks(campaign, 'createLineItems');
  const editCampaignLink = generateCampaignLinks(campaign, 'editCampaign');
  const viewCampaignLink = generateCampaignLinks(campaign);
  const router = useRouter();
  const stopPropagation = (e: SyntheticEvent) => e.stopPropagation();

  const cloneCampaignAction = async (e: SyntheticEvent) => {
    e.stopPropagation();
    const data = await cloneCampaign(campaign.id);
    if (data.data) {
      showNotification({ message: data.message });
      setQueryState([{ name: 'page', value: 0 }]);
    }
  };

  const validateCampaignDetails = async (campaignId: string) => {
    showLoader(true);
    try {
      const data = await validateCampaign(campaignId);
      if (data?.data) {
        router.replace(editCampaignLink);
      }
    } catch (error) {
      showNotification({ message: error as string, type: 'error' });
    } finally {
      showLoader(false);
    }
  };

  const validateCreateLineItemAction = async (campaignId: string) => {
    showLoader(true);
    try {
      const data = await validateCreateLineItemsAction(campaignId);
      if (data?.data) {
        router.replace(createLineItemLink);
      }
    } catch (error) {
      showNotification({ message: error as string, type: 'error' });
    } finally {
      showLoader(false);
    }
  };

  const ACTION_MAPPING: Partial<
    Record<
      PermissionKeys,
      (
        campaign: ICampaign,
        stopPropagation: (e: SyntheticEvent) => void,
      ) => React.ReactNode
    >
  > = {
    [CampaignActionsEnum.View]: (campaign, stopPropagation) => (
      <NextJsLink to={viewCampaignLink} onClick={(e) => e.stopPropagation()}>
        View Campaign
      </NextJsLink>
    ),
    [CampaignActionsEnum.Edit]: (campaign, stopPropagation) => (
      <Link
        onClick={(e) => {
          e.stopPropagation();
          validateCampaignDetails(campaign?.id as string);
        }}>
        Edit Campaign
      </Link>
    ),
    [LineItemActionsEnum.Create]: (campaign, stopPropagation) => (
      <Link
        onClick={(e) => {
          e.stopPropagation();
          validateCreateLineItemAction(campaign?.id as string);
        }}>
        Create Line Item
      </Link>
    ),
    [LineItemActionsEnum.View]: (campaign, stopPropagation) => (
      <NextJsLink to={listOfLineItemLink} onClick={stopPropagation}>
        View Line Items
      </NextJsLink>
    ),
    [CampaignActionsEnum.Create]: (campaign, stopPropagation) => (
      <Link onClick={cloneCampaignAction}>Clone Campaign</Link>
    ),
  };

  const getDropdownMenus = (campaign: ICampaign) => {
    const stopPropagation = (e: SyntheticEvent) => e.stopPropagation();

    const itemsConfig: ItemConfig[] = Object.entries(ACTION_MAPPING).map(
      ([key, render]) => ({
        key,
        permission: key as PermissionKeys,
        label: render(campaign, stopPropagation),
      }),
    );

    const filteredMenu = itemsConfig
      .filter((item) => permissions[item.permission])
      .map(({ key, label }) => ({ key, label }));

    return filteredMenu;
  };

  return (
    <Dropdown
      menu={{ items: getDropdownMenus(campaign) }}
      placement='bottomLeft'>
      <Button
        onClick={(e) => e.stopPropagation()}
        icon={<ThreeDotsActionsIcon />}
        type='text'
        className='icon-only-button'
      />
    </Dropdown>
  );
};
