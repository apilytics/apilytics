import React from 'react';

interface Props {
  // Recharts passes these implicitly.
  payload?: {
    value: string;
  };
  x?: number;
  y?: number;
}

export const MethodAndEndpointTick: React.FC<Props> = ({ payload, x, y }) => {
  if (!payload || !x || !y) {
    return null;
  }

  const [method, endpoint] = payload.value.split(' ');

  return (
    <foreignObject x={x} y={y - 13} width="500" height="30" className="pointer-events-none">
      <span className={`text-method-${method.toLowerCase()}`}>{method}</span>{' '}
      <span className="text-white">{endpoint}</span>
    </foreignObject>
  );
};
