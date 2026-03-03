
import { useEffect } from 'react';
import { useRouter } from '@/lib/hooks/use-router';

export function SetDynamicRoute() {
  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, [router]);

  return <></>;
}