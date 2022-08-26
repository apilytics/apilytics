import clsx from 'clsx';
import React from 'react';

import type { VerticalBarData } from 'types';

interface Props {
  data: VerticalBarData[];
  valueKey: keyof VerticalBarData;
  onBarClick?: (data: VerticalBarData) => void;
  renderValue: (data: VerticalBarData) => JSX.Element | string;
  renderLabel: (data: VerticalBarData) => JSX.Element | string;
  leftLabel: string;
  rightLabel: string;
}

export const VerticalBarChart: React.FC<Props> = ({
  data,
  valueKey,
  renderValue,
  renderLabel,
  leftLabel,
  rightLabel,
  onBarClick,
}) => {
  const maxValue = data.length
    ? Number(
        data.concat().sort((a, b) => Number(b[valueKey]) - Number(a[valueKey]))[0]?.[valueKey] ?? 0,
      )
    : 0;

  return (
    <div className="flex grow flex-col p-2">
      <div className="flex justify-between">
        <p>{leftLabel}</p>
        <p>{rightLabel}</p>
      </div>
      {data.length ? (
        data.map((item, index) => (
          <div
            className={clsx('relative my-1 flex items-center py-1', onBarClick && 'cursor-pointer')}
            onClick={(): void => onBarClick && onBarClick(item)}
            key={`bar-${index}`}
          >
            <div className="flex grow justify-between gap-2 px-1">
              <span className="break-all">{renderLabel(item)}</span>
              <span>{renderValue(item)}</span>
            </div>
            <div
              className="pointer-events-none absolute h-full rounded-md"
              style={{
                width: `${((Number(item[valueKey]) / maxValue) * 100).toFixed()}%`,
                backgroundColor: 'rgba(82, 157, 255, 0.15)',
              }}
            />
          </div>
        ))
      ) : (
        <div className="flex items-center justify-center py-20">
          <p>No metrics available.</p>
        </div>
      )}
    </div>
  );
};
