import React from 'react';
import { Bar, BarChart, Label, LabelList, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import type { ContentType } from 'recharts/types/component/Label';

import { truncateString } from 'utils/helpers';
import type {
  BrowserData,
  DeviceData,
  EndpointData,
  OSData,
  PercentileData,
  StatusCodeData,
} from 'types';

type Data = EndpointData & StatusCodeData & PercentileData & BrowserData & OSData & DeviceData;

interface Props {
  height: number;
  data: Partial<Data>[];
  dataKey: string;
  secondaryDataKey: string;
  tick?: JSX.Element;
  onLabelClick?: (data: Data) => void;
  renderLabels: ContentType;
  label: string;
  secondaryLabel: string;
}

export const VerticalBarChart: React.FC<Props> = ({
  height,
  data,
  dataKey,
  secondaryDataKey,
  tick,
  onLabelClick,
  renderLabels,
  label,
  secondaryLabel,
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
        <Label value={secondaryLabel} fill="var(--base-content)" position="insideTopRight" />
      </XAxis>
      <YAxis
        dataKey={secondaryDataKey}
        type="category"
        tickLine={false}
        axisLine={false}
        mirror
        stroke="white"
        tick={tick}
        width={200}
        padding={{ top: 30, bottom: 20 }}
        tickFormatter={(val: string): string => truncateString(val, 50)}
        // @ts-ignore: `recharts`doesn't have typings for the click handler.
        onClick={({ index }: { index: number }): void => onLabelClick && onLabelClick(data[index])}
      >
        <Label value={label} fill="var(--base-content)" position="insideTopLeft" />
      </YAxis>
    </BarChart>
  </ResponsiveContainer>
);
