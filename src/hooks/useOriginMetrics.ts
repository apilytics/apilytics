import dayjs from 'dayjs';
import { useEffect } from 'react';

import { useContext } from 'hooks/useContext';
import { useFetch } from 'hooks/useFetch';
import { dynamicApiRoutes } from 'utils/router';
import type { OriginMetrics } from 'types';

const REQUEST_TIME_FORMAT = 'YYYY-MM-DD:HH:mm';

interface UseOriginMetrics<T> {
  data: T | undefined;
  loading: boolean;
  notFound: boolean;
}

export const useOriginMetrics = (
  stat: 'endpoint' | 'general' | 'geoLocation' | 'misc' | 'timeFrame',
): UseOriginMetrics<OriginMetrics[`${typeof stat}Data`]> => {
  const {
    slug,
    timeFrame,
    selectedMethod: method = '',
    selectedEndpoint: endpoint = '',
    selectedStatusCode: statusCode = '',
    selectedBrowser: browser = '',
    selectedOs: os = '',
    selectedDevice: device = '',
    selectedCountry: country = '',
    selectedRegion: region = '',
    selectedCity: city = '',
  } = useContext();
  const { data, loading, notFound, fetcher: fetchMetrics } = useFetch<T>();

  useEffect(() => {
    if (slug) {
      const from = dayjs().subtract(timeFrame, 'day').format(REQUEST_TIME_FORMAT);
      const to = dayjs().format(REQUEST_TIME_FORMAT);

      const url = dynamicApiRoutes.originMetrics({
        slug,
        stat,
        from,
        to,
        method,
        endpoint,
        statusCode,
        browser,
        os,
        device,
        country,
        region,
        city,
      });

      fetchMetrics({ url });
    }
  }, [
    slug,
    stat,
    timeFrame,
    method,
    endpoint,
    statusCode,
    browser,
    os,
    device,
    country,
    region,
    city,
    fetchMetrics,
  ]);

  return {
    data,
    loading,
    notFound,
  };
};
