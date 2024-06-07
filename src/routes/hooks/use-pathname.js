import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
// ----------------------------------------------------------------------
import { useProfiling } from 'src/routes/hooks/use-profiling'

export function usePathname() {

  const { pathname } = useLocation();

  const crown = useProfiling();

  useEffect(() => {
      console.log(crown)
  }, [pathname]);

  return useMemo(() => pathname, [pathname]);
}
