

import React from 'react';


export const SignedStrokeGradientStops = ({
  transitionOffset,
  positiveColor,
  negativeColor,
}: {
  transitionOffset: number;
  positiveColor: string;
  negativeColor: string;
}) => {
  if (transitionOffset <= 0.1) {
    
    return (
      <>
        <stop offset="0%" stopColor={negativeColor} />
        <stop offset="100%" stopColor={negativeColor} />
      </>
    );
  }
  if (transitionOffset >= 99.9) {
    
    return (
      <>
        <stop offset="0%" stopColor={positiveColor} />
        <stop offset="100%" stopColor={positiveColor} />
      </>
    );
  }
  
  return (
    <>
      <stop offset="0%" stopColor={positiveColor} />
      <stop
        offset={`${Math.max(0.1, transitionOffset - 0.1)}%`}
        stopColor={positiveColor}
      />
      <stop
        offset={`${Math.min(99.9, transitionOffset + 0.1)}%`}
        stopColor={negativeColor}
      />
      <stop offset="100%" stopColor={negativeColor} />
    </>
  );
};


export const SeriesShadowFilter = ({ id }: { id: string }) => (
  <filter id={id} height="120%">
    <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.1" />
  </filter>
);


export const SeriesGlowFilter = ({ id }: { id: string }) => (
  <filter id={id} height="130%">
    <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
    <feColorMatrix
      in="blur"
      mode="matrix"
      values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
      result="glow"
    />
    <feComposite in="SourceGraphic" in2="glow" operator="over" />
  </filter>
);
