import type { ParsedUrlQuery } from 'querystring';

import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { useOrigin } from 'hooks/useOrigin';

export const useDashboardQuery = (url?: string): void => {
  const { replace, pathname: _pathname, query } = useRouter();
  const pathname = url ?? _pathname;

  const {
    selectedMethod,
    setSelectedMethod,
    selectedEndpoint,
    setSelectedEndpoint,
    selectedStatusCode,
    setSelectedStatusCode,
  } = useOrigin();

  // Initialize filters from existing URL parameters.
  useEffect(() => {
    const { method, endpoint, statusCode } = query as ParsedUrlQuery;

    if (method && typeof method === 'string') {
      setSelectedMethod(method);
    }

    if (endpoint && typeof endpoint === 'string') {
      setSelectedEndpoint(endpoint);
    }

    if (statusCode && typeof statusCode === 'string') {
      setSelectedStatusCode(statusCode);
    }
    // Ignore: We only want to run this effect once the query changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // Update the current URL parameters with the selected filters on the dashboard.
  useEffect(() => {
    const query: ParsedUrlQuery = {};

    if (selectedMethod) {
      query.method = selectedMethod;
    }

    if (selectedEndpoint) {
      query.endpoint = selectedEndpoint;
    }

    if (selectedStatusCode) {
      query.statusCode = String(selectedStatusCode);
    }

    replace({ pathname, query }, undefined, { shallow: true });

    // Ignore: The router object must be left out to prevent an infinite loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEndpoint, selectedMethod, selectedStatusCode]);
};
