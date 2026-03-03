import { DzBox } from '@/components/layout/v1';
import { CLR_WHITE } from '@/lib/constants';
import { DzRecord } from '@/lib/types';
import { FormInstance } from '@/uicomponents/form';
import { RangePicker } from '@/uicomponents/form/input';
import React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { dateObject, formatDate } from '@/lib/utils';

type DaterangePickerActionProps = {
  validations?: DzRecord;
  name: string;
  form: FormInstance;
};

export const DaterangePickerAction = ({
  validations,
  name,
  form,
}: DaterangePickerActionProps) => {
  const handleRangeChange = (
    dates: [Dayjs | null, Dayjs | null] | null,
    dateStrings: [string, string],
  ) => {
    form.setFieldValue(name, {
      startDate: formatDate(dateStrings[0]),
      endDate: formatDate(dateStrings[1]),
    });
  };

  return (
    <DzBox>
      <RangePicker
        style={{ height: '2rem', width: '20rem', background: CLR_WHITE }}
        format={'DD MMM, YYYY'}
        minDate={
          validations?.minDate
            ? dateObject(validations.minDate)
            : dateObject('1970-01-01')
        }
        maxDate={
          validations?.maxDate
            ? dateObject(validations.maxDate)
            : dateObject('2070-01-01')
        }
        onChange={handleRangeChange}
      />
    </DzBox>
  );
};
