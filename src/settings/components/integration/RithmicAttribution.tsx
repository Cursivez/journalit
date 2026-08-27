

import React from 'react';
import {
  getPoweredByOmneMark,
  getTradingPlatformByRithmicMark,
} from './rithmicAttributionArtwork';
import {
  POWERED_BY_OMNE_NAME,
  RITHMIC_ATTRIBUTION_NOTICES,
  RITHMIC_ATTRIBUTION_REGION_LABEL,
  TRADING_PLATFORM_BY_RITHMIC_NAME,
} from './rithmicAttributionContent';

export const RithmicAttribution: React.FC = () => (
  <section
    className="journalit-rithmic-attribution"
    aria-label={RITHMIC_ATTRIBUTION_REGION_LABEL}
  >
    <div className="journalit-rithmic-attribution__marks">
      <img
        className="journalit-rithmic-attribution__mark"
        src={getTradingPlatformByRithmicMark()}
        alt={TRADING_PLATFORM_BY_RITHMIC_NAME}
        width={863}
        height={115}
        decoding="async"
      />
      <img
        className="journalit-rithmic-attribution__mark"
        src={getPoweredByOmneMark()}
        alt={POWERED_BY_OMNE_NAME}
        width={230}
        height={35}
        decoding="async"
      />
    </div>
    <div className="journalit-rithmic-attribution__notices">
      {RITHMIC_ATTRIBUTION_NOTICES.map((notice) => (
        <p className="journalit-rithmic-attribution__notice" key={notice}>
          {notice}
        </p>
      ))}
    </div>
  </section>
);

RithmicAttribution.displayName = 'RithmicAttribution';
