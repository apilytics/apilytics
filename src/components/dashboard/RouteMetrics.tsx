import React from 'react';
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
import { MODAL_NAMES } from 'utils/constants';
import { truncateString } from 'utils/helpers';
import type { OriginMetrics } from 'types';

interface Props {
  metrics: OriginMetrics;
  loading: boolean;
}

export const RouteMetrics: React.FC<Props> = ({ metrics: { routeData }, loading }) => {
  const data = routeData.sort((a, b) => b.requests - a.requests).map((c) => c);

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
    const height = 100 + _data.length * 35;

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
            stroke="white"
            padding={{ top: 30, bottom: 20 }}
            tickFormatter={(val: string): string => truncateString(val, 15)}
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
      modalName={MODAL_NAMES.routeMetrics}
    />
  );
};
