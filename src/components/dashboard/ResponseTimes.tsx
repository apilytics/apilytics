import React, { useState } from 'react';
import { Bar, BarChart, Label, LabelList, ResponsiveContainer, XAxis, YAxis } from 'recharts';

import { DashboardCardContainer } from 'components/dashboard/DashboardCardContainer';
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
        // green: responseTime * routeData.responseGreen,
        // yellow: responseTime * routeData.responseYellow,
        // red: responseTime * routeData.responseRed,
      })),
  );

  const renderResponseTimeLabels = (
    <RouteValue formatter={(value?: string | number): string => `${value}ms`} />
  );

  return (
    <DashboardCardContainer loading={loading}>
      <div className="p-2">
        <h2 className="text-xl">Response times</h2>
      </div>
      <div className="mt-4">
        <ResponsiveContainer height={400}>
          <BarChart data={data} layout="vertical">
            <Bar
              // dataKey="red"
              dataKey="response_time"
              // fill="#fca5a5"
              fill="rgba(82, 157, 255, 0.25)" // `primary` with 25% opacity.
              stackId="dist"
              // minPointSize={50}
              minPointSize={150}
            >
              <LabelList
                // dataKey="response_time"
                content={renderResponseTimeLabels}
              />
            </Bar>
            {/* <Bar dataKey="yellow" fill="#fde047" stackId="dist" minPointSize={50} />
            <Bar dataKey="green" fill="#bef264" stackId="dist" minPointSize={50} /> */}
            <XAxis
              dataKey="response_time"
              type="number"
              orientation="top"
              axisLine={false}
              tick={false}
              mirror
            >
              <Label value="Response time" fill="var(--base-content)" position="insideTopRight" />
            </XAxis>
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              axisLine={false}
              mirror
              // stroke="black"
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
