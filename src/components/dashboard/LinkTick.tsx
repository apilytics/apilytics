import React from 'react';

interface Props {
  // Recharts passes these implicitly.
  payload?: {
    value: string;
  };
  x?: number;
  y?: number;
}

export const LinkTick: React.FC<Props> = ({ payload, x, y }) => {
  if (!payload || !x || !y) {
    return null;
  }

  return (
    <foreignObject x={x} y={y - 13} width="500" height="30">
      <a className="unstyled link text-white hover:text-primary">{String(payload.value)}</a>
    </foreignObject>
  );
};
