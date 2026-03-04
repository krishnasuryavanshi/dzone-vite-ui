import { DzBox } from '@/components/layout/v1';
import { Input, Select } from '@/uicomponents/form/input';
import { PauseOutlined } from '@/uicomponents/icons';
import { Flex } from '@/uicomponents/layout';
import { Text } from '@/uicomponents/text';
import { debounce } from 'lodash';
import { FC, useEffect, useState } from 'react';
import { DeliveryType } from '../../../lib/enums';
import { ITemplateFieldResponse } from '../../../lib/types';
import { validateDestinationName } from '../../../lib/utils';
import { useTemplateStore } from '../../../stores';
import { ZapierType } from '@/app/(dashboard)/integrations-hub/integrations/lib/constants/zapier-types';

interface IDestinationNameCellProps {
  name: string;
  templateField: ITemplateFieldResponse;
  index: number;
  handleChange: (name: string, templateField: ITemplateFieldResponse, index: number) => void;
  updateErros: (fieldName: string, hasError: boolean) => void;
  isEditTemplateAllowed: boolean;
}

export const DestinationNameCell: FC<IDestinationNameCellProps> = ({
  name,
  templateField,
  handleChange,
  index,
  updateErros,
  isEditTemplateAllowed,
}) => {
  const {
    destinationFieldNames,
    reservedNames,
    deliveryType,
    formFieldMappingOptions,
    updatedTemplateData,
  } = useTemplateStore();
  const sourceType = updatedTemplateData?.type || '';
  const [destinationName, setDestinationName] = useState<string>(name);
  const [restrictedDestinationNames, setRestrictedDestinationNames] = useState<string[]>([]);
  const [reservedDestinationNames, setReservedDestinationNames] = useState<string[]>([]);
  const [error, setError] = useState({ error: false, message: '' });

  const isDisabled = !templateField.visible;

  useEffect(() => {
    setDestinationName(name);
  }, [name]);

  useEffect(() => {
    if (destinationFieldNames?.length) {
      const restrictedNames = destinationFieldNames?.filter(
        (destinationFieldname) => name?.toLowerCase() !== destinationFieldname?.toLowerCase(),
      );
      setRestrictedDestinationNames([...restrictedNames]);
    }
  }, [destinationFieldNames]);

  useEffect(() => {
    if (reservedNames?.length) {
      setReservedDestinationNames([...reservedNames]);
    }
  }, [reservedNames]);

  useEffect(() => {
    if (destinationName === name) return;
    debouncedValidateDestinationName();
  }, [destinationName, restrictedDestinationNames, reservedDestinationNames]);

  const validateDestinationFieldName = () => {
    const validateDestinationError = validateDestinationName(
      destinationName,
      reservedDestinationNames,
      restrictedDestinationNames,
      templateField.name,
      updateErros,
    );
    if (validateDestinationError.error) {
      setError(validateDestinationError);
    } else {
      setError({ error: false, message: '' });
    }
  };

  const debouncedValidateDestinationName = debounce(validateDestinationFieldName, 500);

  const handleInputFocusAway = () => {
    if (!destinationName || destinationName === name || error.error) return;
    handleChange(destinationName, templateField, index);
  };

  const handleSelectChange = (value: string) => {
    setDestinationName(value || '');
    handleChange(value || '', templateField, index);
    updateErros(templateField.name, false);
  };

  // Render dropdown for HubSpot/WebForm/Zapier, textbox for FlatFile and other delivery types
  const renderDestinationField = () => {
    const isFlatFile = deliveryType === DeliveryType.FLAT_FILE;
    const isFTP = deliveryType === DeliveryType.FTP;
    // Check if Zapier type is Zaps (manual entry like FlatFile)
    const isZapierZaps = deliveryType === DeliveryType.ZAPIER && sourceType === ZapierType.ZAPS;

    const showDropdown =
      !isFlatFile &&
      !isFTP &&
      !isZapierZaps && // Don't show dropdown for Zapier Zaps
      [DeliveryType.HUBSPOT, DeliveryType.WEBFORM, DeliveryType.ZAPIER].includes(
        deliveryType as DeliveryType,
      ) &&
      formFieldMappingOptions &&
      formFieldMappingOptions.length > 0;

    if (showDropdown) {
      return (
        <Select
          style={{
            width: '100%',
            height: '2.5rem',
          }}
          disabled={isDisabled || !isEditTemplateAllowed}
          value={destinationName || undefined}
          onChange={handleSelectChange}
          allowClear
        >
          {formFieldMappingOptions.map((option) => (
            <Select.Option key={option.value} value={option.value}>
              {option.label}
            </Select.Option>
          ))}
        </Select>
      );
    } else {
      return (
        <>
          <Input
            style={{
              border: '1px solid #e9e9e9',
              borderRadius: '8px',
              padding: '0.5rem',
              boxShadow: '0px 0px 4px 0px rgba(0, 0, 0, 0.25) inset',
              backgroundColor: '#fff',
              height: '2.5rem',
              borderColor: error.error ? 'red' : '',
              color: '#888888',
            }}
            disabled={isDisabled || !isEditTemplateAllowed}
            value={destinationName}
            onChange={(e) => {
              setDestinationName(e.target.value);
            }}
            onBlur={handleInputFocusAway}
            onPressEnter={handleInputFocusAway}
            status={error.error ? 'error' : ''}
          />
          <Text style={{ color: 'red' }}>{error.message}</Text>
        </>
      );
    }
  };

  return (
    <Flex gap={'2rem'} style={{ width: '100%' }} align='center'>
      <DzBox style={{ flex: 1, padding: '0.5rem 0' }}>{renderDestinationField()}</DzBox>
      <DzBox style={{ width: '2rem' }}>
        <PauseOutlined
          style={{
            strokeWidth: 50,
            stroke: '#888888',
            transform: 'rotate(90deg)',
          }}
        />
      </DzBox>
    </Flex>
  );
};
