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

import { EndpointMetricsContainer } from 'components/dashboard/EndpointMetricsContainer';
import { EndpointTooltip } from 'components/dashboard/EndpoinTooltip';
import { EndpointValue } from 'components/dashboard/EndpointValue';
import { MethodPathTick } from 'components/dashboard/MethodPathTick';
import { MODAL_NAMES } from 'utils/constants';
import { truncateString } from 'utils/helpers';
import type { OriginMetrics } from 'types';

interface Props {
  metrics: OriginMetrics;
  loading: boolean;
}

export const EndpointMetrics: React.FC<Props> = ({ metrics: { routeData }, loading }) => {
  const data = routeData.sort((a, b) => b.requests - a.requests).map((c) => c);

  const renderRequestLabels = (
    <EndpointValue
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
    const _data = data
      .slice(0, expanded ? data.length : 15)
      .map((d) => ({ ...d, endpoint: `${d.method} ${d.path}` }));
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
            dataKey="endpoint"
            type="category"
            tickLine={false}
            axisLine={false}
            mirror
            stroke="white"
            tick={<MethodPathTick />}
            padding={{ top: 30, bottom: 20 }}
            tickFormatter={(val: string): string => truncateString(val, 50)}
          >
            <Label value="Endpoints" fill="var(--base-content)" position="insideTopLeft" />
          </YAxis>
          <Tooltip content={EndpointTooltip} cursor={false} />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <EndpointMetricsContainer
      loading={loading}
      title="Requests per endpoint 📊"
      noRequests={!data.length}
      renderBarChart={renderBarChart}
      modalName={MODAL_NAMES.routeMetrics}
    />
  );
};
