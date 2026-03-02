import { useSession } from 'next-auth/react';
import { User } from 'next-auth';
import { ProfileContainer } from './components/profile-container';

export default function ProfilePage() {
  const { data: session } = useSession();
  const userDetails = session?.user as User;
  return <ProfileContainer userDetails={userDetails} />;
}
