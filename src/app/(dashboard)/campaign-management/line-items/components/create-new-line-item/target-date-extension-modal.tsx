'use client';

import React from 'react';
import { Modal } from '@/uicomponents/modal';
import { Button } from '@/uicomponents/button';
import { Text } from '@/uicomponents/text';
import { Flex, Space } from '@/uicomponents/layout';
import { CalendarOutlined, InfoCircleOutlined } from '@ant-design/icons';
import styles from './target-date-extension-modal.module.css';

interface ITargetDateExtensionModalProps {
  open: boolean;
  currentStartDate: string;
  currentDeliveryDate: string;
  newStartDate: string;
  suggestedDeliveryDate: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const TargetDateExtensionModal: React.FC<
  ITargetDateExtensionModalProps
> = ({
  open,
  currentStartDate,
  currentDeliveryDate,
  newStartDate,
  suggestedDeliveryDate,
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      closable={true}
      maskClosable={false}
      width={520}
      className={styles.modalWrapper}>
      <Space direction='vertical' size={0} className={styles.modalContent}>
        {/* Header */}
        <Space className={styles.header} size='small'>
          <Flex align='center' gap='0.5rem'>
            <InfoCircleOutlined className={styles.headerIcon} />
            <Text className={styles.headerTitle}>
              Target Start Date Extension
            </Text>
          </Flex>
        </Space>

        {/* Body */}
        <Space direction='vertical' className={styles.body} size='large'>
          <Text className={styles.description}>
            The new Target Start Date is after the current Target Delivery Start
            Date. This requires updating the delivery date to maintain proper
            lead delivery scheduling.
          </Text>

          {/* Date Comparison */}
          <Flex
            justify='space-between'
            align='center'
            className={styles.dateComparison}>
            <Space direction='vertical' className={styles.dateBlock}>
              <Text className={styles.dateLabel}>Current Dates</Text>
              <Flex vertical gap='0.25rem'>
                <Flex align='center' gap='0.5rem'>
                  <CalendarOutlined className={styles.dateIcon} />
                  <Text className={styles.dateText}>
                    <Space className={styles.dateTitle}>Start:</Space>{' '}
                    {currentStartDate}
                  </Text>
                </Flex>
                <Flex align='center' gap='0.5rem'>
                  <CalendarOutlined className={styles.dateIcon} />
                  <Text className={styles.dateText}>
                    <Space className={styles.dateTitle}>Delivery:</Space>{' '}
                    {currentDeliveryDate}
                  </Text>
                </Flex>
              </Flex>
            </Space>

            <Text className={styles.arrow}>→</Text>

            <Space direction='vertical' className={styles.dateBlock}>
              <Text className={styles.dateLabel}>Proposed Dates</Text>
              <Flex vertical gap='0.25rem'>
                <Flex align='center' gap='0.5rem'>
                  <CalendarOutlined className={styles.dateIcon} />
                  <Text className={styles.dateText}>
                    <Space className={styles.dateTitle}>Start:</Space>{' '}
                    {newStartDate}
                  </Text>
                </Flex>
                <Flex align='center' gap='0.5rem'>
                  <CalendarOutlined className={styles.dateIcon} />
                  <Text className={styles.dateText}>
                    <Space className={styles.dateTitle}>Delivery:</Space>{' '}
                    {suggestedDeliveryDate}
                  </Text>
                </Flex>
              </Flex>
            </Space>
          </Flex>

          <Flex align='flex-start' gap='0.75rem' className={styles.note}>
            <InfoCircleOutlined className={styles.noteIcon} />
            <Text className={styles.noteText}>
              The suggested Target Delivery Start Date is 7 days after the new
              Target Start Date.
            </Text>
          </Flex>
        </Space>

        {/* Footer */}
        <Flex justify='flex-end' gap='1rem' className={styles.footer}>
          <Button onClick={onCancel} disabled={isLoading}>
            Keep Current Dates
          </Button>
          <Button
            type='primary'
            onClick={onConfirm}
            loading={isLoading}
            className={styles.confirmButton}>
            Update Dates
          </Button>
        </Flex>
      </Space>
    </Modal>
  );
};
