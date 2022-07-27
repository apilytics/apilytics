import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { useContext } from 'hooks/useContext';
import { ONE_DAY } from 'utils/constants';
import { isValidIntervalDays } from 'utils/helpers';

export const useDashboardQuery = (requireSlug?: boolean): void => {
  const { pathname, query, replace } = useRouter();

  const {
    setIntervalDays,
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
  } = useContext();

  // Initialize filters from existing URL parameters.
  useEffect(() => {
    const {
      'interval-days': _intervalDays,
      method,
      endpoint,
      statusCode,
      browser,
      os,
      device,
    } = query;

    const intervalDays = Number(_intervalDays);

    if (isValidIntervalDays(intervalDays)) {
      setIntervalDays(intervalDays);
    } else {
      setIntervalDays(ONE_DAY);
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
