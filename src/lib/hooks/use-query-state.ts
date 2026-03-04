import { usePathname, useRouter, useSearchParams } from '@/lib/hooks/use-router';
import { useCallback, useEffect, useState } from 'react';

export function useQueryState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState<Record<string, string>>(
    Object.fromEntries(searchParams.entries()),
  );

  useEffect(() => {
    setQuery(Object.fromEntries(searchParams.entries()));
  }, [searchParams]);

  const createQueryString = useCallback(
    (queries: { name: string; value: string | number }[], replace: boolean = false) => {
      const params = new URLSearchParams(replace ? '' : searchParams.toString());
      queries.forEach((query) => {
        params.set(query.name, query.value as string);
      });

      return params.toString();
    },
    [searchParams],
  );

  const addNewQueryParams = (
    queries: { name: string; value: string | number }[],
    replace: boolean = false,
  ) => {
    router.push(pathname + '?' + createQueryString(queries, replace));
  };

  return { queryState: query, setQueryState: addNewQueryParams };
}
