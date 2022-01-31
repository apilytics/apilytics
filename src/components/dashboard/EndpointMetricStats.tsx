import React from 'react';

import type { NullableMetricStats } from 'types';

interface Props extends NullableMetricStats {
  title: string;
  unit: 'ms' | 'kB';
}

export const EndpointMetricStats: React.FC<Props> = ({
  title,
  unit,
  avg,
  p50,
  p75,
  p90,
  p95,
  p99,
}) => {
  const renderValue = (val: number | null): JSX.Element => (
    <span className="font-bold text-white">{val === null ? 'unknown' : `${val}${unit}`}</span>
  );

  return (
    <>
      <h6 className="text-white mt-4">{title}:</h6>
      <p>Average: {renderValue(avg)}</p>
      <ul className="list-none">
        <li>p50: {renderValue(p50)}</li>
        <li>p75: {renderValue(p75)}</li>
        <li>p90: {renderValue(p90)}</li>
        <li>p95: {renderValue(p95)}</li>
        <li>p99: {renderValue(p99)}</li>
      </ul>
    </>
  );
};
