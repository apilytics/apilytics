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

// TODO: All of the commented parts are needed when we enable the color coding of the response times.
export const ResponseTimes: React.FC<Props> = ({ metrics: { routeData }, loading }) => {
  // The data must be kept in state for the labels to work: https://github.com/recharts/recharts/issues/829#issuecomment-458815276
  const [data] = useState(() =>
    routeData
      .sort((a, b) => (a.response_time < b.response_time ? 1 : -1))
      .map(({ response_time, ...routeData }) => ({
        ...routeData,
        response_time,
        greenRequests: (response_time * (routeData.count_green / routeData.requests)).toFixed(),
        yellowRequests: (response_time * (routeData.count_yellow / routeData.requests)).toFixed(),
        redRequests: (response_time * (routeData.count_red / routeData.requests)).toFixed(),
      })),
  );

  const renderResponseTimeLabels = (
    <RouteValue formatter={(value?: string | number): string => `${value}ms`} />
  );

  const renderBarChart = (): JSX.Element => {
    if (!data.length) {
      return <NoRequests />;
    }

    return (
      <ResponsiveContainer height={400}>
        <BarChart data={data} layout="vertical">
          <Bar dataKey="redRequests" fill="var(--requests-red)" stackId="dist" minPointSize={50}>
            <LabelList dataKey="response_time" content={renderResponseTimeLabels} />
          </Bar>
          <Bar
            dataKey="yellowRequests"
            fill="var(--requests-yellow)"
            stackId="dist"
            minPointSize={50}
          />
          <Bar
            dataKey="greenRequests"
            fill="var(--requests-green)"
            stackId="dist"
            minPointSize={50}
          />
          <XAxis
            dataKey="response_time"
            type="number"
            orientation="top"
            axisLine={false}
            tick={false}
            mirror
            domain={[0, (dataMax: number): number => dataMax * 1.2]} // Prevent bars from overlapping response time labels.
          >
            <Label value="Response time" fill="var(--base-content)" position="insideTopRight" />
          </XAxis>
          <YAxis
            dataKey="name"
            type="category"
            tickLine={false}
            axisLine={false}
            mirror
            stroke="black"
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
        <h2 className="text-xl">Response times ⚡</h2>
      </div>
      <div className="mt-4 grow flex">{renderBarChart()}</div>
    </DashboardCardContainer>
  );
};
