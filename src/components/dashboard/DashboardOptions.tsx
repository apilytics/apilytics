import { CogIcon } from '@heroicons/react/solid';
import React from 'react';
import type { Origin } from '@prisma/client';
import type { Dispatch, SetStateAction } from 'react';

import { IconButton } from 'components/shared/IconButton';
import { Select } from 'components/shared/Select';
import { TIME_FRAME_OPTIONS } from 'utils/constants';
import { dynamicRoutes } from 'utils/router';
import type { TimeFrame } from 'types';

interface Props {
  timeFrame: TimeFrame;
  setTimeFrame: Dispatch<SetStateAction<TimeFrame>>;
  origin: Origin;
  hideSettingsButton?: boolean;
}

export const DashboardOptions: React.FC<Props> = ({
  origin: { slug },
  timeFrame,
  setTimeFrame,
  hideSettingsButton,
}) => (
  <div className="flex justify-end mb-4">
    <Select
      value={timeFrame}
      onChange={({ target }): void => setTimeFrame(Number(target.value) as TimeFrame)}
    >
      {Object.entries(TIME_FRAME_OPTIONS).map(([value, label]) => (
        <option value={value} key={label}>
          {label}
        </option>
      ))}
    </Select>
    {!hideSettingsButton && (
      <IconButton
        linkTo={dynamicRoutes.originSettings({ slug })}
        icon={CogIcon}
        tooltip="Go to origin settings."
        tooltipProps={{ className: 'tooltip-left' }}
        className="ml-4"
      />
    )}
  </div>
);
