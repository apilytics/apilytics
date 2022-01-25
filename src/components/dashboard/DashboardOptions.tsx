import { useRouter } from 'next/router';
import React from 'react';
import type { Origin } from '@prisma/client';
import type { Dispatch, SetStateAction } from 'react';

import { BackButton } from 'components/shared/BackButton';
import { OriginMenu } from 'components/shared/OriginMenu';
import { Select } from 'components/shared/Select';
import { usePlausible } from 'hooks/usePlausible';
import { TIME_FRAME_OPTIONS } from 'utils/constants';
import { staticRoutes } from 'utils/router';
import type { TimeFrame } from 'types';

interface Props {
  timeFrame: TimeFrame;
  setTimeFrame: Dispatch<SetStateAction<TimeFrame>>;
  origin: Origin;
  demo?: boolean;
}

export const DashboardOptions: React.FC<Props> = ({
  origin: { slug },
  timeFrame,
  setTimeFrame,
}) => {
  const plausible = usePlausible();
  const { pathname } = useRouter();

  return (
    <div className="flex flex-wrap items-center mb-4 gap-4">
      <div className="grow">
        <BackButton linkTo={staticRoutes.origins} text="Origins" />
      </div>
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
      {pathname !== staticRoutes.demo && <OriginMenu slug={slug} />}
    </div>
  );
};
