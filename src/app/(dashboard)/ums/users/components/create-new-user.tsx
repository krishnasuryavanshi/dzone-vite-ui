import { Translate } from '@/components/i18n';
import { CLR_BLACK } from '@/lib/constants';
import { Button } from '@/uicomponents/button';
import { Link } from 'react-router';

export const CreateNewUser = () => {
  return (
    <Link to='/ums/users/create'>
      <Button
        style={{
          display: 'flex',
          alignItems: 'center',
          borderRadius: '0.3125rem',
          background:
            'linear-gradient(white, white) padding-box, linear-gradient(109deg, #FFB8EC 4.89%, #F3D6FF 51.39%, #7D88FF 97.01%) border-box',
          border: '1.5px solid transparent',
          color: CLR_BLACK,
          height: '2.25rem',
        }}>
        <Translate i18nKey='Invite new user' />
      </Button>
    </Link>
  );
};
