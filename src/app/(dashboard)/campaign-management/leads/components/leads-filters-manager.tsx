import { saveFileFromBlob } from '@/lib/utils';
import { Filters } from '@/lib/utils/table';
import { showNotification } from '@/services';
import { Flex } from '@/uicomponents/layout';
import { FC, useState } from 'react';
import { ILead, ILeadsExportMetadata } from '../lib/types';
import { filtersArray } from '../lib/utils/get-filtered-arrays';
import {
  exportFilteredLeads,
  fetchExportLeadsMetadata,
  fetchFilteredLeadsCount,
} from '../services';
import { LeadsActions } from './leads-actions';
import { hasActiveFilters } from '@/lib/utils';
import { CLR_BLACK } from '@/lib/constants';
import { Translate } from '@/components/i18n';
import { Text } from '@/uicomponents/text';

interface ILeadsFiltersManagerProps {
  handleClearFilters: () => void;
  filteredInfo: Filters<ILead>;
  disableExportButton: boolean;
  isSearchDisabled: boolean;
  isFilterDisabled: boolean;
  isRefreshDisabled: boolean;
}

export const LeadsFiltersManager: FC<ILeadsFiltersManagerProps> = ({
  handleClearFilters,
  filteredInfo,
  isFilterDisabled,
  isRefreshDisabled,
  isSearchDisabled,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportMetadata, setExportMetadata] = useState<ILeadsExportMetadata[]>(
    [],
  );

  const filteredLeadArray = filtersArray(filteredInfo);

  const handleExportLeads = async (resource: string) => {
    const { data, headers } = await exportFilteredLeads(
      resource,
      filteredLeadArray,
    );
    if (data) {
      const fileName = headers.get('content-disposition').split('filename=')[1];
      saveFileFromBlob(
        data,
        fileName.replaceAll('"', ''),
        headers.get('content-type'),
      );
    }
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      let exportLeadsApisMetadata = exportMetadata;
      const exportCount = await fetchFilteredLeadsCount(filteredLeadArray);
      const count = exportCount?.rowCount;
      showNotification({
        message: exportCount?.message,
        messageHeader: exportCount?.messageHeader,
      });
      if (exportLeadsApisMetadata?.length === 0) {
        const exportLeadsMetadata = await fetchExportLeadsMetadata();
        setExportMetadata(exportLeadsMetadata);
        exportLeadsApisMetadata = exportLeadsMetadata;
      }
      const exportEndpointObject = exportLeadsApisMetadata.find((metadata) => {
        return count < metadata.upToCount;
      });
      if (exportEndpointObject) {
        handleExportLeads(exportEndpointObject.Endpoint);
      }
    } catch (error) {
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Flex justify='space-between' align='center'>
      <Text style={{ color: CLR_BLACK, fontWeight: 600, fontSize: '1.125rem' }}>
        <Translate i18nKey='Leads' />
      </Text>
      <Flex align='center' gap={'0.75rem'}>
        <LeadsActions
          onExport={handleExport}
          onClearFilters={handleClearFilters}
          isExporting={isExporting}
          isSearchDisabled={isSearchDisabled}
          isFilterDisabled={isFilterDisabled}
          isRefreshDisabled={isRefreshDisabled}
          hasActiveFilters={hasActiveFilters(filteredInfo)}
        />
      </Flex>
    </Flex>
  );
};
