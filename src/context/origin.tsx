import { useRouter } from 'next/router';
import { useState } from 'react';

import type { IntervalDays, OriginContextType, OriginData } from 'types';

export const _useOriginContext = (): OriginContextType => {
  const {
    query: { slug: _slug, showApiKey: _showApiKey },
  } = useRouter();

  const slug = String(_slug ?? '');
  const showApiKey = String(_showApiKey ?? '');

  const [intervalDays, setIntervalDays] = useState<IntervalDays>();
  const [origin, setOrigin] = useState<OriginData | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string>();
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>();
  const [selectedStatusCode, setSelectedStatusCode] = useState<string>();
  const [selectedBrowser, setSelectedBrowser] = useState<string>();
  const [selectedOs, setSelectedOs] = useState<string>();
  const [selectedDevice, setSelectedDevice] = useState<string>();
  const [selectedCountry, setSelectedCountry] = useState<string>();
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>();
  const [selectedRegion, setSelectedRegion] = useState<string>();
  const [selectedCity, setSelectedCity] = useState<string>();

  return {
    slug,
    showApiKey,
    origin,
    setOrigin,
    intervalDays,
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
    selectedCountry,
    setSelectedCountry,
    selectedCountryCode,
    setSelectedCountryCode,
    selectedRegion,
    setSelectedRegion,
    selectedCity,
    setSelectedCity,
  };
};
