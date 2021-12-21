import React from 'react';
import { Bar, BarChart, Label, LabelList, ResponsiveContainer, XAxis, YAxis } from 'recharts';

import { RouteValue } from 'components';
import type { RouteData } from 'types';

interface Props {
  routesData: RouteData[];
}

export const ResponseTimes: React.FC<Props> = ({ routesData }) => {
  const data = routesData
    .sort((a, b) => (a.responseTime < b.responseTime ? 1 : -1))
    .map(({ responseTime, ...routesData }) => ({
      ...routesData,
      responseTime,
      green: responseTime * routesData.responseGreen,
      yellow: responseTime * routesData.responseYellow,
      red: responseTime * routesData.responseRed,
    }));

  return (
    <div className="bg-zinc-900 rounded-lg flex flex-col p-4 text-secondary">
      <div className="p-2">
        <h2 className="text-xl">Response times</h2>
      </div>
      <div className="mt-4">
        <ResponsiveContainer height={400}>
          <BarChart data={data} layout="vertical">
            <Bar dataKey="red" fill="#fca5a5" stackId="dist" minPointSize={50}>
              <LabelList
                dataKey="responseTime"
                content={
                  <RouteValue formatter={(value?: string | number): string => `${value}ms`} />
                }
              />
            </Bar>
            <Bar dataKey="yellow" fill="#fde047" stackId="dist" minPointSize={50} />
            <Bar dataKey="green" fill="#bef264" stackId="dist" minPointSize={50} />
            <XAxis
              dataKey="responseTime"
              type="number"
              orientation="top"
              axisLine={false}
              tick={false}
              mirror
            >
              <Label
                value="Response time"
                fill="var(--color-secondary)"
                position="insideTopRight"
              />
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
              <Label value="Routes" fill="var(--color-secondary)" position="insideTopLeft" />
            </YAxis>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
