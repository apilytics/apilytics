import type { ParsedUrlQuery } from 'querystring';

import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { useOrigin } from 'hooks/useOrigin';
import { TIME_FRAME_OPTIONS } from 'utils/constants';
import type { TimeFrame } from 'types';

export const useDashboardQuery = (url?: string): void => {
  const { replace, pathname: _pathname, query: _query } = useRouter();
  const pathname = url ?? _pathname;

  const {
    setTimeFrame,
    selectedMethod,
    setSelectedMethod,
    selectedEndpoint,
    setSelectedEndpoint,
    selectedStatusCode,
    setSelectedStatusCode,
  } = useOrigin();

  // Initialize filters from existing URL parameters.
  useEffect(() => {
    const { timeFrame, method, endpoint, statusCode } = _query as ParsedUrlQuery;

    if (timeFrame && typeof timeFrame === 'string') {
      const _timeFrame = Object.entries(TIME_FRAME_OPTIONS).find(
        ([_, val]) => val === timeFrame,
      )?.[0];

      if (_timeFrame) {
        setTimeFrame(Number(_timeFrame) as TimeFrame);
      }
    }

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
  }, [_query]);

  // Update the current URL parameters with the selected filters on the dashboard.
  useEffect(() => {
    const query: ParsedUrlQuery = {};

    if (_query.timeFrame) {
      query.timeFrame = _query.timeFrame;
    }

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

    // Ignore: The `replace` method must be left out to prevent an infinite loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEndpoint, selectedMethod, selectedStatusCode]);
};
