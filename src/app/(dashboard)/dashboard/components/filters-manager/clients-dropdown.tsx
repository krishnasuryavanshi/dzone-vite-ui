import { DzDropdown } from "@/components/shared/custom";
import React, { FC, useEffect, useState } from "react";
import { IFilterClient } from "../../lib/types";
import { getSelectedItems } from "../../lib/utils";
import { debounce } from "lodash";

interface IClientsDropdownProps {
  availableClients?: IFilterClient[];
  selectedClients?: string[];
  handleSelectionChange?: (data: {
    type: string;
    selectedItems: string[];
  }) => void;
}

export const ClientsDropdown: FC<IClientsDropdownProps> = ({
  availableClients,
  selectedClients,
  handleSelectionChange,
}) => {
  const [clients, setClients] = useState<IFilterClient[]>();

  useEffect(() => {
    setClients(availableClients as IFilterClient[]);
  }, [availableClients]);

  const handleClientSelection = (data: any) => {
    const selectedItems = getSelectedItems(
      selectedClients as string[],
      data.selectedKeys
    );
    handleSelectionChange &&
      handleSelectionChange({ type: "selectedClients", selectedItems });
  };

  const handleSeach = (value: string) => {
    setClients(
      availableClients?.filter(
        (client) =>
          client.key === 'all' ||
          client.name.toLowerCase().includes(value.toLowerCase()) ||
          client.clientId.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const debouncedSearch = debounce(handleSeach, 500);

  return (
    <DzDropdown
      className="dz-dropdown filter-dropdown filter-dropdown-clients"
      items={clients}
      label="pages.clients.title"
      selectedItems={selectedClients}
      onSelect={handleClientSelection}
      handleSearch={debouncedSearch}
    >
      {(selectedClients?.includes("all") && "All Clients") ||
        (selectedClients?.length === 0 && "No Client") ||
        (selectedClients?.length === 1 && "1 Client") ||
        (selectedClients?.length && `${selectedClients?.length} Clients`)}
    </DzDropdown>
  );
};
