import React from 'react';

interface OrgChartConnectorProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
}

export const OrgChartConnector = ({ from, to }: OrgChartConnectorProps) => {
  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      <line
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        stroke="#94a3b8"
        strokeWidth="2"
      />
    </svg>
  );
};