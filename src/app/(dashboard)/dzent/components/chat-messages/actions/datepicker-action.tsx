import { DzBox } from '@/components/layout/v1';
import { CLR_WHITE } from '@/lib/constants';
import { DzRecord } from '@/lib/types';
import { dateObject, formatDate } from '@/lib/utils';
import { FormInstance } from '@/uicomponents/form';
import { DatePicker } from '@/uicomponents/form/input';
import dayjs, { Dayjs } from 'dayjs';

type DatepickerActionProps = {
  validations?: DzRecord;
  name: string;
  form: FormInstance;
};

export const DatepickerAction = ({
  validations,
  name,
  form,
}: DatepickerActionProps) => {
  const handleDateChange = (_: Dayjs | Dayjs[] | null, dateStr: string | string[] | null) => {
    form.setFieldValue(name, formatDate(dateStr));
  };

  return (
    <DzBox>
      <DatePicker
        style={{ height: '2rem', width: '10rem', background: CLR_WHITE }}
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
        onChange={handleDateChange}
      />
    </DzBox>
  );
};
