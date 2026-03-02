import { Translate } from '@/components/i18n';
import { DzBox } from '@/components/layout/v1';
import { Hideable } from '@/components/shared';
import { Button } from '@/uicomponents/button';
import { DzentAiIcon } from '@/uicomponents/icons/svgs';
import { Flex } from '@/uicomponents/layout';
import { Text } from '@/uicomponents/text';
import { CloseOutlined } from '@ant-design/icons';
import Link from 'next/link';
import React, { useState } from 'react';

export const AiCampaignCreate = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Hideable show={isOpen}>
      <DzBox
        style={{
          right: 0,
          bottom: 0,
          position: 'fixed',
          zIndex: 1000,
          backgroundColor: '#fff',
          border: '1px solid #235AED',
          borderRadius: '10px 10px 0 0',
          padding: '0.75rem',
          width: '40rem',
        }}>
        <Flex justify='space-between' gap={'3rem'}>
          <Flex
            gap='0.75rem'
            style={{ paddingLeft: '0.5rem', paddingBlock: '0.75rem' }}>
            <DzBox>
              <DzentAiIcon />
            </DzBox>
            <Flex vertical gap='1.25rem'>
              <Flex>
                <Text style={{ color: '#235AED', fontSize: '1.125rem' }}>
                  <Translate i18nKey="Want to save time? Let AI create your campaign, just tell us what you need, and we'll take care of the rest." />
                </Text>
              </Flex>
              <Flex gap='0.5rem'>
                <Link href='/dzent' onClick={() => setIsOpen(false)}>
                  <Button type='primary' style={{ boxShadow: 'none' }}>
                    <Translate i18nKey='Yes, switch to AI Assistant' />
                  </Button>
                </Link>
                <Button onClick={() => setIsOpen(false)}>
                  <Translate i18nKey='No, I will continue manually' />
                </Button>
              </Flex>
            </Flex>
          </Flex>
          <DzBox style={{ cursor: 'pointer' }} onClick={() => setIsOpen(false)}>
            <CloseOutlined style={{ fontSize: '1.5rem', color: '#EDEDED' }} />
          </DzBox>
        </Flex>
      </DzBox>
    </Hideable>
  );
};
