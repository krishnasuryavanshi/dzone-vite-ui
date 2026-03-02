import { Translate } from '@/components/i18n';
import { CLR_WHITE, DZONE_CLR_BLACK } from '@/lib/constants';
import { DatabaseOutlined } from '@/uicomponents/icons';
import { Flex } from '@/uicomponents/layout';
import { Title } from '@/uicomponents/title';

export const DictionaryModalHeader = () => {
  return (
    <Flex gap='1.25rem' align='center'>
      <DatabaseOutlined
        style={{
          color: `${CLR_WHITE}`,
          background: `${DZONE_CLR_BLACK}`,
          padding: '0.75rem',
          borderRadius: '50%',
          fontSize: '1rem',
        }}
      />
      <Flex vertical>
        <Title level={4} style={{ margin: 0 }}>
          <Translate i18nKey='pages.templates.label.heading' />
        </Title>
        <Title level={5} style={{ margin: 0, fontWeight: 400 }}>
          <Translate i18nKey='pages.templates.label.subHeading' />
        </Title>
      </Flex>
    </Flex>
  );
};
