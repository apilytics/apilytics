import React from 'react';
import type { SVGProps } from 'react';
import type { LabelProps } from 'recharts';

interface Props {
  formatter: (value?: string | number) => string;
}

export const BarValue: React.FC<Props & Omit<SVGProps<SVGTextElement>, 'viewBox'> & LabelProps> = ({
  y,
  value,
  formatter,
}) => (
  <g>
    <text
      x="100%"
      y={y}
      dy={16}
      fill="var(--base-content)"
      textAnchor="end"
      dominantBaseline="middle"
    >
      {formatter(value)}
    </text>
  </g>
);
