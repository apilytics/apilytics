import React from 'react';

interface Props {
  // Recharts passes these implicitly.
  payload?: {
    value: string;
  };
  x?: number;
  y?: number;
}

export const StatusCodeTick: React.FC<Props> = ({ payload, x, y }) => {
  if (!payload || !x || !y) {
    return null;
  }

  const statusCode = String(payload.value);

  return (
    <foreignObject x={x} y={y - 13} width="500" height="30">
      <a className={`text-${statusCode.charAt(0)}xx unstyled link text-white hover:text-primary`}>
        {statusCode}
      </a>
    </foreignObject>
  );
};
