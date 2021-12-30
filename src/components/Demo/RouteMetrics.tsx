import React, { useMemo } from 'react';
import { Bar, BarChart, Label, LabelList, ResponsiveContainer, XAxis, YAxis } from 'recharts';

import { RouteValue } from 'components/Demo/RouteValue';
import { LoadingIndicator } from 'components/shared/LoadingIndicator';
import type { OriginMetrics } from 'types';

interface Props {
  metrics: OriginMetrics;
  loading: boolean;
}

export const RouteMetrics: React.FC<Props> = ({ metrics: { routeData }, loading }) => {
  const data = routeData.sort((a, b) => (a.requests < b.requests ? 1 : -1)).map((c) => c);

  return (
    <div className="bg-zinc-900 rounded-lg flex flex-col p-2 text-secondary">
      {useMemo(
        () =>
          loading ? (
            <div className="grow flex justify-center items-center">
              <LoadingIndicator />
            </div>
          ) : (
            <>
              <div className="p-2">
                <h2 className="text-xl">Requests per route</h2>
              </div>
              <div className="mt-4">
                <ResponsiveContainer height={400}>
                  <BarChart data={data} layout="vertical">
                    <Bar dataKey="requests" fill="#27272a" minPointSize={150}>
                      <LabelList
                        content={
                          <RouteValue
                            formatter={(value?: string | number): string => {
                              if (Number(value) >= 1000) {
                                return `${(Number(value) / 1000).toFixed(1)}k`;
                              } else {
                                return `${value}`;
                              }
                            }}
                          />
                        }
                      />
                    </Bar>
                    <XAxis
                      dataKey="requests"
                      type="number"
                      orientation="top"
                      axisLine={false}
                      tick={false}
                      mirror
                    >
                      <Label
                        value="Requests"
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
