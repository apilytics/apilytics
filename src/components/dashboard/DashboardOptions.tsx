import { XIcon } from '@heroicons/react/solid';
import { useRouter } from 'next/router';
import React from 'react';
import type { Origin } from '@prisma/client';
import type { ChangeEvent } from 'react';

import { VersionInfo } from 'components/dashboard/VersionInfo';
import { Button } from 'components/shared/Button';
import { OriginMenu } from 'components/shared/OriginMenu';
import { Select } from 'components/shared/Select';
import { useOrigin } from 'hooks/useOrigin';
import { usePlausible } from 'hooks/usePlausible';
import { TIME_FRAME_OPTIONS } from 'utils/constants';
import { truncateString } from 'utils/helpers';
import { staticRoutes } from 'utils/router';
import type { ApilyticsPackage, TimeFrame } from 'types';

interface Props {
  origin: Origin;
  apilyticsPackage?: ApilyticsPackage;
}

export const DashboardOptions: React.FC<Props> = ({ origin: { name, slug }, apilyticsPackage }) => {
  const plausible = usePlausible();
  const { pathname, query, replace } = useRouter();
  const isDemo = pathname === staticRoutes.demo;

  const {
    timeFrame,
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

  const handleTimeFrameChange = ({ target }: ChangeEvent<HTMLSelectElement>): void => {
    const val = Number(target.value) as TimeFrame;
    setTimeFrame(val);
    query.timeFrame = TIME_FRAME_OPTIONS[val];
    replace({ pathname, query });
  };

  return (
    <div className="mt-2 mb-4 flex flex-wrap items-center justify-start gap-4">
      <h6 className="-mr-2 text-white">{name}</h6>
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
      <Select
        value={timeFrame}
        onChange={handleTimeFrameChange}
        onClick={(): void => plausible('time-frame-selector-click')}
        className="ml-auto"
      >
        {Object.entries(TIME_FRAME_OPTIONS).map(([value, label]) => (
          <option value={value} key={label}>
            {label}
          </option>
        ))}
      </Select>
      {!isDemo && <OriginMenu slug={slug} />}
    </div>
  );
};
