import React from 'react';
import type { SVGProps } from 'react';
import type { LabelProps } from 'recharts';

interface Props {
  formatter: (value?: string | number) => string;
}

export const RouteValue: React.FC<
  Props & Omit<SVGProps<SVGTextElement>, 'viewBox'> & LabelProps
> = ({ y, value, formatter }) => (
  <g>
    <text
      x="100%"
      y={y}
      dy={16}
      fill="var(--color-secondary)"
      textAnchor="end"
      dominantBaseline="middle"
    >
      {formatter(value)}
    </text>
  </g>
);
