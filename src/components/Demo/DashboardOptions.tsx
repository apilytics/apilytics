import React from 'react';
import type { Dispatch, SetStateAction } from 'react';

import { Select } from 'components';
import {
  LAST_3_MONTHS_VALUE,
  LAST_6_MONTHS_VALUE,
  LAST_7_DAYS_VALUE,
  LAST_12_MONTHS_VALUE,
  LAST_30_DAYS_VALUE,
} from 'utils';
import type { RequestSource, TimeFrame } from 'types';

const LAST_7_DAYS_LABEL = 'Last 7 days';
const LAST_30_DAYS_LABEL = 'Last 30 days';
const LAST_3_MONTHS_LABEL = 'Last 3 months';
const LAST_6_MONTHS_LABEL = 'Last 6 months';
const LAST_12_MONTHS_LABEL = 'Last 12 months';

const TIME_FRAME_OPTIONS = {
  [LAST_7_DAYS_LABEL]: LAST_7_DAYS_VALUE,
  [LAST_30_DAYS_LABEL]: LAST_30_DAYS_VALUE,
  [LAST_3_MONTHS_LABEL]: LAST_3_MONTHS_VALUE,
  [LAST_6_MONTHS_LABEL]: LAST_6_MONTHS_VALUE,
  [LAST_12_MONTHS_LABEL]: LAST_12_MONTHS_VALUE,
};

interface Props {
  apiName?: string;
  sourceName: string;
  setSourceName: Dispatch<SetStateAction<string>>;
  sources: RequestSource[];
  timeFrame: TimeFrame;
  setTimeFrame: Dispatch<SetStateAction<TimeFrame>>;
}

export const DashboardOptions: React.FC<Props> = ({
  apiName = 'apilytics.io',
  sourceName,
  setSourceName,
  sources,
  timeFrame,
  setTimeFrame,
}) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center">
      <h1 className="text-white text-2xl">{apiName}</h1>
      <Select
        value={sourceName}
        onChange={({ target }): void => setSourceName(target.value)}
        containerProps={{ className: 'ml-4' }}
      >
        {sources.map(({ name }) => (
          <option value={name} key={name}>
            {name}
          </option>
        ))}
      </Select>
    </div>
    <Select
      value={timeFrame}
      onChange={({ target }): void => setTimeFrame(Number(target.value) as TimeFrame)}
    >
      {Object.entries(TIME_FRAME_OPTIONS).map(([label, value]) => (
        <option value={value} key={label}>
          {label}
        </option>
      ))}
    </Select>
  </div>
);
