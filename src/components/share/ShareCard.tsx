import React from 'react';
import { LOGO_DATA_URI } from '../../assets/logoData';
import { cssVars } from '../../styles/inlineStylePolicy';
import {
  shareEagerMediaProps,
  shareHideDollarAmountsProps,
} from '../../services/share/brandedCapture';

export const ShareCard = React.forwardRef<
  HTMLDivElement,
  {
    children: React.ReactNode;
    hideDollarAmounts: boolean;
    className?: string;
  }
>(function ShareCard({ children, hideDollarAmounts, className = '' }, ref) {
  return (
    <div
      ref={ref}
      className={`journalit-share-card ${className}`}
      {...shareEagerMediaProps}
      {...(hideDollarAmounts ? shareHideDollarAmountsProps : {})}
      style={cssVars({ '--journalit-share-logo': `url("${LOGO_DATA_URI}")` })}
    >
      {children}
      <div className="journalit-share-card-footer">
        <span className="journalit-share-card-mark" aria-hidden="true" />
        <span className="journalit-share-card-url">journalit.co</span>
      </div>
    </div>
  );
});
