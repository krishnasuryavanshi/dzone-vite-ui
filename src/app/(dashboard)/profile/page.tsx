import { useSession } from '@/lib/hooks/use-session';
import { User } from '@/lib/types/auth.types';
import { ProfileContainer } from './components/profile-container';

export default function ProfilePage() {
  const { data: session } = useSession();
  const userDetails = session?.user as User;
  return (
    <>
      <title>Profile | DZ One</title>
      <ProfileContainer userDetails={userDetails} />
    </>
  );
}
