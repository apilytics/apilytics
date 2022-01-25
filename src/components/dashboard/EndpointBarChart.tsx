import React from 'react';
import { Bar, BarChart, Label, LabelList, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import type { ContentType } from 'recharts/types/component/Label';

import { MethodAndEndpointTick } from 'components/dashboard/MethodAndEndpointTick';
import { truncateString } from 'utils/helpers';
import type { EndpointData } from 'types';

interface Props {
  height: number;
  data: EndpointData[];
  dataKey: string;
  onLabelClick: (data: EndpointData) => void;
  renderLabels: ContentType;
  label: string;
}

export const EndpointBarChart: React.FC<Props> = ({
  height,
  data,
  dataKey,
  onLabelClick,
  renderLabels,
  label,
}) => (
  <ResponsiveContainer height={height}>
    <BarChart data={data} layout="vertical" barSize={30}>
      <Bar
        dataKey={dataKey}
        fill="rgba(82, 157, 255, 0.15)" // `primary` with 15% opacity.
      >
        <LabelList content={renderLabels} />
      </Bar>
      <XAxis
        dataKey={dataKey}
        type="number"
        orientation="top"
        axisLine={false}
        tick={false}
        mirror
        domain={[0, (dataMax: number): number => dataMax * 1.2]} // Prevent bars from overlapping labels.
      >
        <Label value={label} fill="var(--base-content)" position="insideTopRight" />
      </XAxis>
      <YAxis
        dataKey="methodAndEndpoint"
        type="category"
        tickLine={false}
        axisLine={false}
        mirror
        stroke="white"
        tick={<MethodAndEndpointTick />}
        padding={{ top: 30, bottom: 20 }}
        tickFormatter={(val: string): string => truncateString(val, 50)}
        // @ts-ignore: `recharts`doesn't have typings for the click handler.
        onClick={({ index }: { index: number }): void => onLabelClick(data[index])}
      >
        <Label value="Endpoints" fill="var(--base-content)" position="insideTopLeft" />
      </YAxis>
    </BarChart>
  </ResponsiveContainer>
);
