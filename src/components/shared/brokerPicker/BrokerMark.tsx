

import React from 'react';
import type { BrokerLogo } from '../../../services/onboarding/brokerLogos.generated';
import { cssVars } from '../../../styles/inlineStylePolicy';

type BrokerMarkSize = 'lg' | 'md';

interface BrokerMarkProps {
  label: string;
  logo?: BrokerLogo;
  
  icon?: React.ReactNode;
  size?: BrokerMarkSize;
}

const brokerMonogram = (label: string): string => {
  const words = label.split(/\s+/).filter(Boolean);
  const letters =
    words.length >= 2
      ? words[0][0] + words[1][0]
      : label.replace(/[^a-z0-9]/gi, '').slice(0, 2);
  return letters.toUpperCase();
};

export const BrokerMark: React.FC<BrokerMarkProps> = ({
  label,
  logo,
  icon,
  size = 'lg',
}) => (
  <span
    className={`journalit-broker-mark journalit-broker-mark--${size}${!icon && logo && !logo.monochrome ? ' has-logo' : ''}`}
    aria-hidden="true"
  >
    {icon ??
      (logo?.monochrome ? (
        <span
          className="journalit-broker-mark__mono"
          style={cssVars({ '--journalit-broker-mark': `url("${logo.uri}")` })}
        />
      ) : logo ? (
        <img src={logo.uri} alt="" />
      ) : (
        brokerMonogram(label)
      ))}
  </span>
);
