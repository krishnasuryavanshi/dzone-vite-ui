import { Translate } from '@/components/i18n';
import { FormItem } from '@/uicomponents/form';
import { Radio, RadioGroup } from '@/uicomponents/form/input';
import { Row, Col } from '@/uicomponents/layout/grid';
import { useTenantTypeStore } from '@/stores/tenant-store';

interface TenantTypeProps {
  isDisabled?: boolean;
  isRole?: boolean;
}

export const TenantType = ({
  isDisabled = false,
  isRole = false,
}: TenantTypeProps) => {
  const { tenantTypes } = useTenantTypeStore();

  return (
    <Row gutter={16}>
      <Col span={24}>
        <FormItem
          className='input-control form-control-item'
          name={isRole ? 'tenantType' : 'type'}
          label='Tenant Type'
          rules={[{ required: true, message: 'This field is required' }]}>
          <RadioGroup>
            {tenantTypes?.map((type) => (
              <Radio key={type.id} value={type.name} disabled={isDisabled}>
                <Translate i18nKey={type.name} />
              </Radio>
            ))}
          </RadioGroup>
        </FormItem>
      </Col>
    </Row>
  );
};
