import React from 'react';
import { Bar, BarChart, Label, LabelList, ResponsiveContainer, XAxis, YAxis } from 'recharts';

import { DashboardCardContainer } from 'components/dashboard/DashboardCardContainer';
import { RouteValue } from 'components/dashboard/RouteValue';
import type { OriginMetrics } from 'types';

interface Props {
  metrics: OriginMetrics;
  loading: boolean;
}

export const RouteMetrics: React.FC<Props> = ({ metrics: { routeData }, loading }) => {
  const data = routeData.sort((a, b) => (a.requests < b.requests ? 1 : -1)).map((c) => c);

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

  return (
    <DashboardCardContainer loading={loading}>
      <div className="p-2">
        <h2 className="text-xl">Requests per route</h2>
      </div>
      <div className="mt-4">
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
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardCardContainer>
  );
};
