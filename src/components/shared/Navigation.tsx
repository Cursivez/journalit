

import React from 'react';
import { t, TranslationKey } from '../../lang/helpers';


export interface NavigationButtonConfig {
  text: TranslationKey;
  action: () => Promise<void> | void;
  icon?: string;
  disabled?: boolean;
}


interface SharedNavigationProps {
  buttons: NavigationButtonConfig[];
  className?: string;
}

export const Navigation: React.FC<SharedNavigationProps> = ({
  buttons,
  className = 'shared-navigation',
}) => {
  return (
    <div className={className}>
      <div className={`${className}-links`}>
        {buttons.map((button) => (
          <button
            key={`${button.text}-${button.icon ?? 'none'}`}
            className={`${className}-button`}
            onClick={() => void button.action()}
            disabled={button.disabled}
          >
            {button.icon &&
              button.icon !== 'none' &&
              button.icon !== 'right' && (
                <span className="journalit-nav-icon">
                  {button.icon === 'left' ? '←' : button.icon}
                </span>
              )}
            {t(button.text)}
            {button.icon && button.icon === 'right' && (
              <span className="journalit-nav-icon">→</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export {};
