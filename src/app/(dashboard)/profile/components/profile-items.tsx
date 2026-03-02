'use client';

import { DzBox } from '@/components/layout/v1';
import { Flex, Space } from '@/uicomponents/layout';
import { Tag } from 'antd';
import { FC } from 'react';
import { Text } from '@/uicomponents/text';
import {
  UserNameIcon,
  EmailAddressIcon,
  TenantTypeIcon,
  UserRoleIcon,
  OrganisationsIcon,
} from '@/uicomponents/icons/svgs';
import { IUser } from '../../ums/users/lib/types';
import styles from './profile-items.module.css';

interface IProfileItemsProps {
  userProfile: IUser | null;
}

export const ProfileItems: FC<IProfileItemsProps> = ({ userProfile }) => {
  // Capitalize first letter of each name
  const capitalizeFirstLetter = (str: string | undefined) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const fullName = `${capitalizeFirstLetter(userProfile?.firstName?.trim())} ${capitalizeFirstLetter(userProfile?.lastName)}`;

  return (
    <DzBox className={styles.profileCard}>
      <Flex vertical gap='1rem' className={styles.fieldContainer}>
        {/* Name Field */}
        <Flex gap='0.5rem' vertical className={styles.fieldContainer}>
          <Flex className={styles.fieldHeader}>
            <UserNameIcon />
            <Text className={styles.fieldLabel}>Name</Text>
          </Flex>
          <Space className={styles.fieldValue}>
            <Text className={styles.fieldText}>{fullName.trim()}</Text>
          </Space>
        </Flex>

        {/* Email Address Field */}
        <Flex gap='0.5rem' vertical className={styles.fieldContainer}>
          <Flex className={styles.fieldHeader}>
            <EmailAddressIcon />
            <Text className={styles.fieldLabel}>Email Address</Text>
          </Flex>
          <Space className={styles.fieldValue}>
            <Text className={styles.fieldText}>{userProfile?.username}</Text>
          </Space>
        </Flex>

        {/* Tenant Type Field */}
        <Flex gap='0.5rem' vertical className={styles.fieldContainer}>
          <Flex className={styles.fieldHeader}>
            <TenantTypeIcon />
            <Text className={styles.fieldLabel}>Tenant Type</Text>
          </Flex>
          <Space className={styles.fieldValue}>
            <Text className={styles.fieldText}>{userProfile?.type}</Text>
          </Space>
        </Flex>

        {/* Roles Assigned Field */}
        <Flex gap='0.5rem' vertical className={styles.fieldContainer}>
          <Flex className={styles.fieldHeader}>
            <UserRoleIcon />
            <Text className={styles.fieldLabel}>Roles Assigned</Text>
          </Flex>
          <Flex className={styles.tagContainer}>
            {userProfile?.roles?.map((role: any) => (
              <Tag key={role.id || role} className={styles.tag}>
                {role.name || role}
              </Tag>
            )) || []}
          </Flex>
        </Flex>

        {/* Associated Organisation Field */}
        <Flex gap='0.5rem' vertical className={styles.fieldContainer}>
          <Flex className={styles.fieldHeader}>
            <OrganisationsIcon />
            <Text className={styles.fieldLabel}>Associated Organisation</Text>
          </Flex>
          <Flex className={styles.tagContainer}>
            {userProfile?.organizations?.map((org: any) => (
              <Tag key={org.id || org} className={styles.tag}>
                {org.name || org}
              </Tag>
            )) || []}
          </Flex>
        </Flex>
      </Flex>
    </DzBox>
  );
};
