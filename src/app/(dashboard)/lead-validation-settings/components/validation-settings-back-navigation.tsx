import { DzBox } from '@/components/layout/v1';
import { Text } from '@/uicomponents';
import { ArrowLeft } from '@/uicomponents/icons/svgs';
import { Flex } from '@/uicomponents/layout';
import { useRouter } from '@/lib/hooks/use-router';
import { useValidationSettingStore } from '../store';
import { useQueryState } from '@/lib/hooks/use-query-state';
import { getNavigationUrl } from '../lib/utils';
import { DZONE_CLR_GRAY_DARK } from '@/lib/constants';

export const ValidationSettingsBackNavigation = ({
  isEditing,
}: {
  isEditing: boolean;
}) => {
  const router = useRouter();
  const { settingMetadata } = useValidationSettingStore();
  const { queryState } = useQueryState();

  const handleBackNavigation = () => {
    const lineItemId = settingMetadata?.lineItemId;
    const redirectTo = queryState['redirectTo'];
    const redirectUrl = getNavigationUrl(lineItemId, redirectTo);
    router.push(redirectUrl);
  };

  return (
    <Flex gap={'0.5rem'}>
      <Flex
        onClick={handleBackNavigation}
        align='center'
        justify='center'
        style={{
          borderRadius: '17px',
          background: DZONE_CLR_GRAY_DARK,
          height: '1.5rem',
          width: '1.5rem',
          cursor: 'pointer',
          paddingTop: '0.25rem',
        }}>
        <ArrowLeft />
      </Flex>
      <DzBox>
        <Text strong>Configure Validation Settings</Text>
      </DzBox>
    </Flex>
  );
};
