import { XIcon } from '@heroicons/react/solid';
import { useRouter } from 'next/router';
import React from 'react';
import type { Origin } from '@prisma/client';

import { BackButton } from 'components/shared/BackButton';
import { Button } from 'components/shared/Button';
import { OriginMenu } from 'components/shared/OriginMenu';
import { Select } from 'components/shared/Select';
import { useOrigin } from 'hooks/useOrigin';
import { usePlausible } from 'hooks/usePlausible';
import { TIME_FRAME_OPTIONS } from 'utils/constants';
import { staticRoutes } from 'utils/router';
import type { TimeFrame } from 'types';

interface Props {
  origin: Origin;
}

export const DashboardOptions: React.FC<Props> = ({ origin: { name, slug } }) => {
  const plausible = usePlausible();
  const { pathname } = useRouter();
  const { timeFrame, setTimeFrame, selectedEndpoint, setSelectedEndpoint } = useOrigin();
  const isDemo = pathname === staticRoutes.demo;

  return (
    <>
      {!isDemo && (
        <BackButton
          linkTo={staticRoutes.origins}
          text="Origins"
          className="btn-sm hidden sm:flex"
        />
      )}
      <div className="flex flex-wrap items-center gap-4 mt-2 mb-4">
        <h6 className="text-white grow">{name}</h6>
        {selectedEndpoint && (
          <Button onClick={(): void => setSelectedEndpoint(null)} endIcon={XIcon}>
            <span className={`text-method-${selectedEndpoint.method.toLowerCase()} mr-2`}>
              {selectedEndpoint.method}
            </span>
            {selectedEndpoint.endpoint}
          </Button>
        )}
        <Select
          value={timeFrame}
          onChange={({ target }): void => setTimeFrame(Number(target.value) as TimeFrame)}
          onClick={(): void => plausible('time-frame-selector-click')}
        >
          {Object.entries(TIME_FRAME_OPTIONS).map(([value, label]) => (
            <option value={value} key={label}>
              {label}
            </option>
          ))}
        </Select>
        {!isDemo && <OriginMenu slug={slug} />}
      </div>
    </>
  );
};
