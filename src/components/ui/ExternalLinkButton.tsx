

import React from 'react';

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
      onClick={() => window.open(url, '_blank')}
      className="journalit-external-link-button"
    >
      <span ref={iconRef} className="journalit-external-link-button__icon" />
      <span>{label}</span>
    </button>
  );
};
