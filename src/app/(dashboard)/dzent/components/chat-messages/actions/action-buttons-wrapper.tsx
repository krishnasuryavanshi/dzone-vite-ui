import { Hideable } from '@/components/shared';
import { DzRecord } from '@/lib/types';
import { FormInstance } from '@/uicomponents/form';
import { useEffect } from 'react';
import { ActionButtons } from './action-buttons';

type ActionButtonsWrapperProps = {
  options: DzRecord[];
  name: string;
  form: FormInstance;
  handleSubmit?: () => Promise<void>;
};

export const ActionButtonsWrapper = ({
  options,
  name,
  form,
  handleSubmit,
}: ActionButtonsWrapperProps) => {
  useEffect(() => {
    if (options.length > 0) {
      form.setFieldValue(name, options[0]);
    }
  }, [options, form]);

  const handleActionClick = async (action: DzRecord) => {
    form.setFieldValue(name, action);
    if (handleSubmit) {
      await handleSubmit();
    }
  };

  return (
    <Hideable show={options.length > 0}>
      <ActionButtons
        options={options}
        handleActionClick={handleActionClick}
        selected={form.getFieldValue(name)}
      />
    </Hideable>
  );
};
