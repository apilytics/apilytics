import React from 'react';

import type { MetricStats } from 'types';

interface Props extends MetricStats {
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
}) => (
  <>
    <h6 className="text-white mt-4">{title}:</h6>
    <p>
      Average:{' '}
      <span className="font-bold text-white">
        {avg}
        {unit}
      </span>
    </p>
    <ul className="list-none">
      <li>
        p50:{' '}
        <span className="font-bold text-white">
          {p50}
          {unit}
        </span>
      </li>
      <li>
        p75:{' '}
        <span className="font-bold text-white">
          {p75}
          {unit}
        </span>
      </li>
      <li>
        p90:{' '}
        <span className="font-bold text-white">
          {p90}
          {unit}
        </span>
      </li>
      <li>
        p95:{' '}
        <span className="font-bold text-white">
          {p95}
          {unit}
        </span>
      </li>
      <li>
        p99:{' '}
        <span className="font-bold text-white">
          {p99}
          {unit}
        </span>
      </li>
    </ul>
  </>
);
