import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import {
  fetchDestinationDropdownFields,
  fetchHubspotFormFields,
  fetchWebformFormFields,
} from '../services';

interface DestinationFieldsResult {
  dropdownOptions: { label: string; value: string }[] | null;
  formFieldsData: Record<string, any>[] | null;
}

async function fetchAllDestinationFields(
  deliveryType: string,
  integrationId: string,
  deliveryObjectId?: string,
  zapierType?: string,
): Promise<DestinationFieldsResult> {
  let dropdownOptions: { label: string; value: string }[] | null = null;
  let formFieldsData: Record<string, any>[] | null = null;

  // Fetch dropdown options (skip for Zapier "Zaps" type)
  if (!(deliveryType === 'Zapier' && zapierType === 'Zaps')) {
    const dropdownResponse = await fetchDestinationDropdownFields(
      deliveryType,
      integrationId,
      deliveryObjectId,
    );
    if (dropdownResponse?.data) {
      dropdownOptions = dropdownResponse.data.map((field: { value: string; name: string }) => ({
        label: field.name,
        value: field.value,
      }));
    }
  }

  // Fetch form fields to get confidence values
  let formFieldsResponse: Record<string, any> | null = null;

  if (deliveryType === 'HubSpot' && deliveryObjectId) {
    formFieldsResponse = await fetchHubspotFormFields(
      deliveryType,
      integrationId,
      deliveryObjectId,
    );
  } else if (deliveryType === 'WebForm') {
    formFieldsResponse = await fetchWebformFormFields(deliveryType, integrationId);
  } else if (deliveryType === 'Zapier') {
    if (zapierType && zapierType !== 'Zaps') {
      formFieldsResponse = await fetchWebformFormFields(deliveryType, integrationId);
    }
  }

  if (formFieldsResponse?.data && Array.isArray(formFieldsResponse.data)) {
    formFieldsData = formFieldsResponse.data;
  }

  return { dropdownOptions, formFieldsData };
}

export function useDestinationFieldsQuery(
  deliveryType: string,
  integrationId: string,
  deliveryObjectId?: string,
  zapierType?: string,
  enabled = true,
) {
  return useQuery({
    queryKey: queryKeys.templates.destinationFields({
      deliveryType,
      integrationId,
      deliveryObjectId,
      zapierType,
    }),
    queryFn: () =>
      fetchAllDestinationFields(deliveryType, integrationId, deliveryObjectId, zapierType),
    enabled: !!deliveryType && !!integrationId && enabled,
  });
}
