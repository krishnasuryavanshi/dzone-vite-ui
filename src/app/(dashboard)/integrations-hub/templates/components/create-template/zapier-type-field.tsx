import { FormItem } from '@/uicomponents/form';
import { Select } from '@/uicomponents/form/input/select';
import { Col } from '@/uicomponents/layout/grid';
import { ZAPIER_TYPE_OPTIONS } from '@/app/(dashboard)/integrations-hub/integrations/lib/constants/zapier-types';
import { REQUIRED_FIELD } from '@/app/(dashboard)/campaign-management/lib/constants';

interface ZapierTypeFieldProps {
  templateId?: string;
  isEditTemplateAllowed: boolean;
  onTypeChange: (value: string) => void;
  zapierType?: string;
}

export const ZapierTypeField: React.FC<ZapierTypeFieldProps> = ({
  templateId,
  isEditTemplateAllowed,
  onTypeChange,
  zapierType,
}) => {
  return (
    <Col span={8}>
      <FormItem
        className='input-control form-control-item'
        name='zapierType'
        label='Source Type'
        rules={[{ required: true, message: REQUIRED_FIELD }]}
      >
        <Select
          placeholder='Select Type'
          style={{ width: '100%' }}
          onChange={onTypeChange}
          disabled={Boolean(templateId && !isEditTemplateAllowed)}
          allowClear
          value={zapierType || undefined}
        >
          {ZAPIER_TYPE_OPTIONS.map((option) => (
            <Select.Option key={option.value} value={option.value}>
              {option.label}
            </Select.Option>
          ))}
        </Select>
      </FormItem>
    </Col>
  );
};
