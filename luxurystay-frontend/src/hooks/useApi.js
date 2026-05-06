import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../lib/api';

/**
 * Generic data-fetching hook.
 *
 * @param {string|null} url       - API path. Pass null to skip initial fetch.
 * @param {object}      [options]
 * @param {any}         [options.defaultData]  - Value before first successful fetch.
 * @param {any[]}       [options.deps]         - Re-fetch when these change (in addition to url).
 *
 * Returns { data, loading, error, refetch }
 */
export function useApi(url, { defaultData = null, deps = [] } = {}) {
  const [data,    setData]    = useState(defaultData);
  const [loading, setLoading] = useState(!!url);
  const [error,   setError]   = useState(null);
  const abortRef = useRef(null);

  const fetch = useCallback(async (fetchUrl) => {
    if (!fetchUrl) return;
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    setError(null);
    try {
      const res = await api.get(fetchUrl, { signal: abortRef.current.signal });
      setData(res.data.data);
    } catch (err) {
      if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
        setError(err.response?.data?.message || err.message || 'An error occurred.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch(url);
    return () => abortRef.current?.abort();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, ...deps]);

  const refetch = useCallback(() => fetch(url), [fetch, url]);

  return { data, loading, error, refetch };
}
