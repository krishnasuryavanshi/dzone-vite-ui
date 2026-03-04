import { FC } from 'react';
import { Space } from 'antd';
import { ScreenLoader } from '@/components/shared/loader';
import { User } from '@/lib/types/auth.types';
import { DzBox, DzScrollContainer } from '@/components/layout/v1';
import { ProfileItems } from './profile-items';
import { CLR_BLACK } from '@/lib/constants';
import { Translate } from '@/components/i18n';
import { useProfileQuery } from '../hooks/use-profile-query';

interface IProfileContainerProps {
  userDetails?: User;
}

export const ProfileContainer: FC<IProfileContainerProps> = ({ userDetails }) => {
  const { data: profileResult, isLoading } = useProfileQuery(
    userDetails?.userId || '',
    !!userDetails?.userId,
  );

  if (isLoading) return <ScreenLoader />;

  return (
    <DzBox className='dz-page-content'>
      <DzScrollContainer vertical scoll='outside'>
        <DzScrollContainer.Sticky>
          <Space style={{ color: CLR_BLACK, fontWeight: 600, fontSize: '1.125rem' }}>
            <Translate i18nKey='Your Profile' />
          </Space>
        </DzScrollContainer.Sticky>
        <DzScrollContainer.Scroll>
          <ProfileItems userProfile={profileResult?.data ?? null} />
        </DzScrollContainer.Scroll>
      </DzScrollContainer>
    </DzBox>
  );
};
