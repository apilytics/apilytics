import React, { useMemo } from 'react';
import { Bar, BarChart, Label, LabelList, ResponsiveContainer, XAxis, YAxis } from 'recharts';

import { RouteValue } from 'components/Demo/RouteValue';
import { LoadingIndicator } from 'components/shared/LoadingIndicator';
import type { OriginMetrics } from 'types';

interface Props {
  metrics: OriginMetrics;
  loading: boolean;
}

// TODO: All of the commented parts are needed when we enable the color coding of the response times.
export const ResponseTimes: React.FC<Props> = ({ metrics: { routeData }, loading }) => {
  const data = routeData
    .sort((a, b) => (a.response_time < b.response_time ? 1 : -1))
    .map(({ response_time, ...routeData }) => ({
      ...routeData,
      response_time,
      // green: responseTime * routeData.responseGreen,
      // yellow: responseTime * routeData.responseYellow,
      // red: responseTime * routeData.responseRed,
    }));

  return (
    <div className="bg-zinc-900 rounded-lg flex flex-col p-4 text-secondary">
      {useMemo(
        () =>
          loading ? (
            <div className="grow flex justify-center items-center">
              <LoadingIndicator />
            </div>
          ) : (
            <>
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
                      fill="#27272a"
                      stackId="dist"
                      // minPointSize={50}
                      minPointSize={150}
                    >
                      <LabelList
                        // dataKey="response_time"
                        content={
                          <RouteValue
                            formatter={(value?: string | number): string => `${value}ms`}
                          />
                        }
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
                      // stroke="black"
                      stroke="var(--color-secondary)"
                      padding={{ top: 30, bottom: 20 }}
                    >
                      <Label
                        value="Routes"
                        fill="var(--color-secondary)"
                        position="insideTopLeft"
                      />
                    </YAxis>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          ),
        [data, loading],
      )}
    </div>
  );
};
