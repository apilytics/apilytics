import React from 'react';

interface Props {
  // Recharts passes these implicitly.
  payload?: {
    value: string;
  };
  x?: number;
  y?: number;
}

export const MethodPathTick: React.FC<Props> = ({ payload, x, y }) => {
  if (!payload || !x || !y) {
    return null;
  }

  const [method, path] = payload.value.split(' ');

  return (
    <foreignObject x={x} y={y - 15} width="400" height="100">
      <span className={`text-method-${method.toLowerCase()}`}>{method}</span>{' '}
      <span className="text-white">{path}</span>
    </foreignObject>
  );
};
