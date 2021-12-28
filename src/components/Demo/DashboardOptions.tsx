import React from 'react';
import type { Dispatch, SetStateAction } from 'react';

import { Select } from 'components/shared/Select';
import {
  LAST_3_MONTHS_VALUE,
  LAST_6_MONTHS_VALUE,
  LAST_7_DAYS_VALUE,
  LAST_12_MONTHS_VALUE,
  LAST_30_DAYS_VALUE,
} from 'utils/constants';
import type { TimeFrame } from 'types';

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
  selectedSource: string;
  setSelectedSource: Dispatch<SetStateAction<string>>;
  sourceOptions: string[];
  timeFrame: TimeFrame;
  setTimeFrame: Dispatch<SetStateAction<TimeFrame>>;
}

export const DashboardOptions: React.FC<Props> = ({
  selectedSource,
  setSelectedSource,
  sourceOptions,
  timeFrame,
  setTimeFrame,
}) => (
  <div className="flex items-center justify-between">
    <Select value={selectedSource} onChange={({ target }): void => setSelectedSource(target.value)}>
      {sourceOptions.map((source) => (
        <option value={source} key={source}>
          {source}
        </option>
      ))}
    </Select>
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
