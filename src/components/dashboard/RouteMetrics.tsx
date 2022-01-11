import React, { useState } from 'react';
import {
  Bar,
  BarChart,
  Label,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { RouteMetricsContainer } from 'components/dashboard/RouteMetricsContainer';
import { RouteTooltip } from 'components/dashboard/RouteTooltip';
import { RouteValue } from 'components/dashboard/RouteValue';
import type { OriginMetrics } from 'types';

interface Props {
  metrics: OriginMetrics;
  loading: boolean;
}

export const RouteMetrics: React.FC<Props> = ({ metrics: { routeData }, loading }) => {
  // The data must be kept in state for the labels to work: https://github.com/recharts/recharts/issues/829#issuecomment-458815276
  const [data] = useState(() =>
    routeData.sort((a, b) => (a.requests < b.requests ? 1 : -1)).map((c) => c),
  );

  const renderRequestLabels = (
    <RouteValue
      formatter={(value?: string | number): string => {
        if (Number(value) >= 1000) {
          return `${(Number(value) / 1000).toFixed(1)}k`;
        } else {
          return `${value}`;
        }
      }}
    />
  );

  const renderBarChart = (expanded: boolean): JSX.Element => {
    const _data = data.slice(0, expanded ? data.length : 10);
    const height = Math.max(300, _data.length * 45);

    return (
      <ResponsiveContainer height={height}>
        <BarChart data={_data} layout="vertical" barSize={30}>
          <Bar
            dataKey="requests"
            fill="rgba(82, 157, 255, 0.25)" // `primary` with 25% opacity.
          >
            <LabelList content={renderRequestLabels} />
          </Bar>
          <XAxis
            dataKey="requests"
            type="number"
            orientation="top"
            axisLine={false}
            tick={false}
            mirror
            domain={[0, (dataMax: number): number => dataMax * 1.2]} // Prevent bars from overlapping request labels.
          >
            <Label value="Requests" fill="var(--base-content)" position="insideTopRight" />
          </XAxis>
          <YAxis
            dataKey="name"
            type="category"
            tickLine={false}
            axisLine={false}
            mirror
            stroke="var(--base-content)"
            padding={{ top: 30, bottom: 20 }}
          >
            <Label value="Routes" fill="var(--base-content)" position="insideTopLeft" />
          </YAxis>
          <Tooltip content={RouteTooltip} cursor={false} />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <RouteMetricsContainer
      loading={loading}
      title="Requests per route 📊"
      noRequests={!data.length}
      renderBarChart={renderBarChart}
    />
  );
};
