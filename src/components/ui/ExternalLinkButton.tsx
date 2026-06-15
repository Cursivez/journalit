

import React from 'react';
import { openExternalUrl } from '../../utils/externalLinks';

interface ExternalLinkButtonProps {
  url: string;
  label: string;
  iconRef: React.RefObject<HTMLSpanElement | null>;
}

export const ExternalLinkButton: React.FC<ExternalLinkButtonProps> = ({
  url,
  label,
  iconRef,
}) => {
  return (
    <button
      onClick={() => openExternalUrl(url)}
      className="journalit-external-link-button"
    >
      <span ref={iconRef} className="journalit-external-link-button__icon" />
      <span>{label}</span>
    </button>
  );
};
