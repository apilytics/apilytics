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

export const ResponseTimes: React.FC<Props> = ({ metrics: { routeData }, loading }) => {
  const data = routeData
    .map(({ response_time, requests, count_green, count_yellow, count_red, ...routeData }) => {
      const greenRequests = (response_time * (count_green / requests)).toFixed();
      const yellowRequests = (response_time * (count_yellow / requests)).toFixed();
      const redRequests = (response_time * (count_red / requests)).toFixed();

      return {
        ...routeData,
        requests,
        response_time,
        count_green,
        count_yellow,
        count_red,
        greenRequests,
        yellowRequests,
        redRequests,
      };
    })
    .sort((a, b) => b.response_time - a.response_time);

  const renderResponseTimeLabels = (
    <RouteValue formatter={(value?: string | number): string => `${value}ms`} />
  );

  const renderBarChart = (expanded: boolean): JSX.Element => {
    const _data = data.slice(0, expanded ? data.length : 10);
    const height = 100 + _data.length * 35;

    return (
      <ResponsiveContainer height={height}>
        <BarChart data={_data} layout="vertical" barSize={30} reverseStackOrder>
          <Bar dataKey="redRequests" fill="var(--requests-red)" stackId="dist">
            <LabelList dataKey="response_time" content={renderResponseTimeLabels} />
          </Bar>
          <Bar dataKey="yellowRequests" fill="var(--requests-yellow)" stackId="dist" />
          <Bar dataKey="greenRequests" fill="var(--requests-green)" stackId="dist" />
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
      title="Response times ⚡"
      noRequests={!data.length}
      renderBarChart={renderBarChart}
      modalName={MODAL_NAMES.responseTimes}
    />
  );
};
