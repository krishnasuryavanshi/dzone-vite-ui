import { Button, Dropdown } from "@/uicomponents";
import { MoreOutlined } from "@/uicomponents/icons";
import React, { FC } from "react";

import "./record-actions.scss";
import { Link } from "react-router";

interface ILeadsRecordActionsProps {
  lineItemId: string;
  campaignId: string;
  clientId: string;
}

export const LeadsRecordActions: FC<ILeadsRecordActionsProps> = ({
  lineItemId,
  campaignId,
  clientId,
}) => {
  const items = [
    {
      key: "1",
      label: (
        <Link
          to={`/campaign-management/clients/${clientId}/campaigns/${campaignId}/line-items/${lineItemId}`}
        >
          View Line Item
        </Link>
      ),
    },
  ];
  return (
    <Dropdown menu={{ items }} placement="bottomLeft">
      <Button type="default" icon={<MoreOutlined />} />
    </Dropdown>
  );
};
