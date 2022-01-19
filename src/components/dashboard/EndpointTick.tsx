import React from 'react';

interface Props {
  // Recharts passes these implicitly.
  payload?: {
    value: string;
  };
  x?: number;
  y?: number;
}

export const EndpointTick: React.FC<Props> = ({ payload, x, y }) => {
  if (!payload || !x || !y) {
    return null;
  }

  const [method, path] = payload.value.split(' ');

  return (
    <foreignObject x={x} y={y - 12} width="400" height="30">
      <span className={`text-method-${method.toLowerCase()} pointer-events-none`}>{method}</span>{' '}
      <span className="text-white pointer-events-none">{path}</span>
    </foreignObject>
  );
};
