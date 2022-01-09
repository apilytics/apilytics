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

import { DashboardCardContainer } from 'components/dashboard/DashboardCardContainer';
import { NoRequests } from 'components/dashboard/NoRequests';
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

  const renderBarChart = (): JSX.Element => {
    if (!data.length) {
      return <NoRequests />;
    }

    return (
      <ResponsiveContainer height={400}>
        <BarChart data={data} layout="vertical">
          <Bar
            dataKey="requests"
            fill="rgba(82, 157, 255, 0.25)" // `primary` with 25% opacity.
            minPointSize={150}
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
    <DashboardCardContainer loading={loading} grow>
      <div className="p-2">
        <h2 className="text-xl">Requests per route 📊</h2>
      </div>
      <div className="mt-4 grow flex">{renderBarChart()}</div>
    </DashboardCardContainer>
  );
};
