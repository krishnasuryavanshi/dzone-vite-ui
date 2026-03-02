'use client';

import { FC, useEffect, useState } from 'react';
import { Card, Col, Row, Typography, Tag, Space, Descriptions } from 'antd';
import { fetchUser } from '../../ums/users/services';
import { ScreenLoader } from '@/components/shared/loader';
import { User } from 'next-auth';
import { DzBox, DzScrollContainer } from '@/components/layout/v1';
import { ProfileItems } from './profile-items';
import { CLR_BLACK } from '@/lib/constants';
import { Translate } from '@/components/i18n';
import { IUser } from '../../ums/users/lib/types';

const { Title, Text } = Typography;

interface IProfileContainerProps {
  userDetails?: User;
}

export const ProfileContainer: FC<IProfileContainerProps> = ({
  userDetails,
}) => {
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<IUser | null>(null);

  const fetchUserDetails = async (userId: string) => {
    try {
      setLoading(true);
      const { data } = await fetchUser(userId);
      setUserProfile(data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userDetails?.userId) {
      fetchUserDetails(userDetails?.userId);
    }
  }, [userDetails?.userId]);

  if (loading) return <ScreenLoader />;

  return (
    <DzBox className='dz-page-content'>
      <DzScrollContainer vertical scoll='outside'>
        <DzScrollContainer.Sticky>
          <Space
            style={{ color: CLR_BLACK, fontWeight: 600, fontSize: '1.125rem' }}>
            <Translate i18nKey='Your Profile' />
          </Space>
        </DzScrollContainer.Sticky>
        <DzScrollContainer.Scroll>
          <ProfileItems userProfile={userProfile} />
        </DzScrollContainer.Scroll>
      </DzScrollContainer>
    </DzBox>
  );
};
