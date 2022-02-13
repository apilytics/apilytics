import type { ParsedUrlQuery } from 'querystring';

import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { useOrigin } from 'hooks/useOrigin';
import { TIME_FRAME_OPTIONS } from 'utils/constants';
import type { TimeFrame } from 'types';

export const useDashboardQuery = (): void => {
  const { replace, pathname, query: _query } = useRouter();

  const {
    setTimeFrame,
    selectedMethod,
    setSelectedMethod,
    selectedEndpoint,
    setSelectedEndpoint,
    selectedStatusCode,
    setSelectedStatusCode,
    selectedBrowser,
    setSelectedBrowser,
    selectedOs,
    setSelectedOs,
    selectedDevice,
    setSelectedDevice,
  } = useOrigin();

  // Initialize filters from existing URL parameters.
  useEffect(() => {
    const { timeFrame, method, endpoint, statusCode, browser, os, device } =
      _query as ParsedUrlQuery;

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

    if (browser && typeof browser === 'string') {
      setSelectedBrowser(browser);
    }

    if (os && typeof os === 'string') {
      setSelectedOs(os);
    }

    if (device && typeof device === 'string') {
      setSelectedDevice(device);
    }

    // Ignore: We only want to run this effect once the query changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_query]);

  // Update the current URL parameters with the selected filters on the dashboard.
  useEffect(() => {
    const query: ParsedUrlQuery = {};

    if (_query.slug) {
      query.slug = _query.slug;
    }

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

    if (selectedBrowser) {
      query.browser = selectedBrowser;
    }

    if (selectedOs) {
      query.os = selectedOs;
    }

    if (selectedDevice) {
      query.device = selectedDevice;
    }

    replace({ pathname, query }, undefined, { shallow: true });

    // Ignore: The `replace` method must be left out to prevent an infinite loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedEndpoint,
    selectedMethod,
    selectedStatusCode,
    selectedBrowser,
    selectedOs,
    selectedDevice,
  ]);
};
