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
    <foreignObject x={x} y={y - 13} width="500" height="30">
      <a className="unstyled text-white hover:text-primary">
        <span className={`text-method-${method.toLowerCase()} cursor-pointer`}>{method}</span>{' '}
        <span className="link">{endpoint}</span>
      </a>
    </foreignObject>
  );
};
