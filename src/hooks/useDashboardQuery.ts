import type { ParsedUrlQuery } from 'querystring';

import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { useOrigin } from 'hooks/useOrigin';
import { TIME_FRAME_OPTIONS } from 'utils/constants';
import type { TimeFrame } from 'types';

export const useDashboardQuery = (requireSlug?: boolean): void => {
  const { pathname, query, replace } = useRouter();

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
      query as ParsedUrlQuery;

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
  }, [query]);

  // Update the current URL parameters with the selected filters on the dashboard.
  useEffect(() => {
    if (selectedMethod) {
      query.method = selectedMethod;
    } else {
      delete query.method;
    }

    if (selectedEndpoint) {
      query.endpoint = selectedEndpoint;
    } else {
      delete query.endpoint;
    }

    if (selectedStatusCode) {
      query.statusCode = String(selectedStatusCode);
    } else {
      delete query.statusCode;
    }

    if (selectedBrowser) {
      query.browser = selectedBrowser;
    } else {
      delete query.browser;
    }

    if (selectedOs) {
      query.os = selectedOs;
    } else {
      delete query.os;
    }

    if (selectedDevice) {
      query.device = selectedDevice;
    } else {
      delete query.device;
    }

    // Prevent redirection when the query parameters have not yet been loaded.
    if (requireSlug && !query.slug) {
      return;
    } else {
      replace({ pathname, query });
    }

    // Ignore: The router object must be left out to prevent an infinite loop.
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
