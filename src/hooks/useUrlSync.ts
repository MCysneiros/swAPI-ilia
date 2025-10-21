import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface UseUrlSyncParams {
  page: number;
  search: string;
  defaultPage?: number;
}

export function useUrlSync({
  page,
  search,
  defaultPage = 1,
}: UseUrlSyncParams) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (page !== defaultPage) {
      params.set('page', String(page));
    } else {
      params.delete('page');
    }

    const normalizedSearch = search.trim();
    if (normalizedSearch) {
      params.set('search', normalizedSearch);
    } else {
      params.delete('search');
    }

    const newQuery = params.toString();
    if (newQuery !== searchParams.toString()) {
      const href = newQuery ? `${pathname}?${newQuery}` : pathname;
      router.replace(href, { scroll: false });
    }
  }, [page, search, pathname, router, searchParams, defaultPage]);
}
