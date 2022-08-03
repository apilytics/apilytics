import { PlusIcon, XIcon } from '@heroicons/react/solid';
import { useRouter } from 'next/router';
import React from 'react';
import type { ChangeEvent } from 'react';

import { VersionInfo } from 'components/dashboard/VersionInfo';
import { Button } from 'components/shared/Button';
import { OriginMenu } from 'components/shared/OriginMenu';
import { Select } from 'components/shared/Select';
import { useContext } from 'hooks/useContext';
import { usePlausible } from 'hooks/usePlausible';
import { INTERVAL_DAYS, ORIGIN_ROLES } from 'utils/constants';
import { getFlagEmoji, truncateString } from 'utils/helpers';
import { dynamicRoutes, staticRoutes } from 'utils/router';
import type { ApilyticsPackage, IntervalDays } from 'types';

interface Props {
  apilyticsPackage?: ApilyticsPackage;
}

export const DashboardOptions: React.FC<Props> = ({ apilyticsPackage }) => {
  const plausible = usePlausible();
  const { pathname, query, replace } = useRouter();
  const isDemo = pathname === staticRoutes.demo;

  const {
    slug,
    origin,
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
  } = useContext();

  const { name, userRole, userCount, dynamicRouteCount, excludedRouteCount } = origin ?? {};

  const handleIntervalDaysChange = ({ target }: ChangeEvent<HTMLSelectElement>): void => {
    const val = Number(target.value) as IntervalDays;
    setIntervalDays(val);
    query['interval-days'] = String(val);
    replace({ pathname, query });
  };

  const renderGeoLocationValue = (value: string): string =>
    selectedCountryCode ? `${getFlagEmoji(selectedCountryCode)} ${value}` : value;

  return (
    <div className="mt-2 mb-4 flex flex-wrap items-center justify-start gap-4">
      <h6 className="-mr-2 text-white">
        {name}
        {userRole && (
          <div className="badge badge-primary badge-outline ml-2 capitalize">{userRole}</div>
        )}
      </h6>
      {!!apilyticsPackage && <VersionInfo apilyticsPackage={apilyticsPackage} />}
      {selectedMethod && (
        <Button onClick={(): void => setSelectedMethod(undefined)} endIcon={XIcon}>
          <span className={`text-method-${selectedMethod.toLowerCase()}`}>{selectedMethod}</span>
        </Button>
      )}
      {selectedEndpoint && (
        <Button onClick={(): void => setSelectedEndpoint(undefined)} endIcon={XIcon}>
          {truncateString(selectedEndpoint, 50)}
        </Button>
      )}
      {selectedStatusCode && (
        <Button onClick={(): void => setSelectedStatusCode(undefined)} endIcon={XIcon}>
          {selectedStatusCode}
        </Button>
      )}
      {selectedBrowser && (
        <Button onClick={(): void => setSelectedBrowser(undefined)} endIcon={XIcon}>
          {selectedBrowser}
        </Button>
      )}
      {selectedOs && (
        <Button onClick={(): void => setSelectedOs(undefined)} endIcon={XIcon}>
          {selectedOs}
        </Button>
      )}
      {selectedDevice && (
        <Button onClick={(): void => setSelectedDevice(undefined)} endIcon={XIcon}>
          {selectedDevice}
        </Button>
      )}
      {selectedCountry && (
        <Button
          onClick={(): void => {
            setSelectedCountry(undefined);
            setSelectedCountryCode(undefined);
          }}
          endIcon={XIcon}
        >
          {renderGeoLocationValue(selectedCountry)}
        </Button>
      )}
      {selectedRegion && (
        <Button
          onClick={(): void => {
            setSelectedRegion(undefined);
            setSelectedCountryCode(undefined);
          }}
          endIcon={XIcon}
        >
          {renderGeoLocationValue(selectedRegion)}
        </Button>
      )}
      {selectedCity && (
        <Button
          onClick={(): void => {
            setSelectedCity(undefined);
            setSelectedCountryCode(undefined);
          }}
          endIcon={XIcon}
        >
          {renderGeoLocationValue(selectedCity)}
        </Button>
      )}
      <Select
        value={intervalDays}
        onChange={handleIntervalDaysChange}
        onClick={(): void => plausible('time-frame-selector-click')}
        className="ml-auto"
      >
        {INTERVAL_DAYS.map(({ value, label }) => (
          <option value={value} key={label}>
            {label}
          </option>
        ))}
      </Select>
      {origin?.userRole && [ORIGIN_ROLES.OWNER, ORIGIN_ROLES.ADMIN].includes(origin.userRole) && (
        <Button
          className="btn-outline btn-primary hidden sm:flex"
          linkTo={dynamicRoutes.originUsers({ slug })}
          endIcon={PlusIcon}
        >
          Invite users
        </Button>
      )}
      {!isDemo && (
        <OriginMenu
          slug={slug}
          userRole={userRole}
          userCount={userCount}
          dynamicRouteCount={dynamicRouteCount}
          excludedRouteCount={excludedRouteCount}
        />
      )}
    </div>
  );
};
