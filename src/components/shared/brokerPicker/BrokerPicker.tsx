

import React, { useState } from 'react';
import { Search } from '../icons/ObsidianIcon';
import type { BrokerLogo } from '../../../services/onboarding/brokerLogos.generated';
import { BrokerMark } from './BrokerMark';

export interface BrokerPickerItem {
  id: string;
  label: string;
  logo?: BrokerLogo;
  
  icon?: React.ReactNode;
  
  badge?: { icon: React.ReactNode; label: string };
  
  pinned?: boolean;
  
  expanded?: boolean;
}

interface BrokerPickerProps {
  items: BrokerPickerItem[];
  onSelect: (item: BrokerPickerItem) => void;
  searchPlaceholder: string;
  selectedId?: string;
  disabled?: boolean;
  autoFocusSearch?: boolean;
  className?: string;
}

export const BrokerPicker: React.FC<BrokerPickerProps> = ({
  items,
  onSelect,
  searchPlaceholder,
  selectedId,
  disabled = false,
  autoFocusSearch = false,
  className,
}) => {
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim().toLowerCase();

  
  
  
  const wordStartMatches: BrokerPickerItem[] = [];
  const midWordMatches: BrokerPickerItem[] = [];
  const pinned: BrokerPickerItem[] = [];
  for (const item of items) {
    if (item.pinned) {
      pinned.push(item);
      continue;
    }
    const index = normalizedQuery
      ? item.label.toLowerCase().indexOf(normalizedQuery)
      : 0;
    if (index < 0) continue;
    if (index === 0 || /\W/.test(item.label[index - 1])) {
      wordStartMatches.push(item);
    } else {
      midWordMatches.push(item);
    }
  }
  const unpinnedMatches = [...wordStartMatches, ...midWordMatches];
  const visible = [...unpinnedMatches, ...pinned];

  return (
    <div
      className={`journalit-broker-picker${className ? ` ${className}` : ''}`}
    >
      
      <div className="journalit-broker-picker__search">
        <Search size={16} aria-hidden="true" />
        <input
          type="search"
          value={query}
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
          disabled={disabled}
          
          
          autoFocus={autoFocusSearch}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key !== 'Enter' || unpinnedMatches.length !== 1) return;
            event.preventDefault();
            onSelect(unpinnedMatches[0]);
          }}
        />
      </div>

      <ul className="journalit-broker-picker__tiles">
        {visible.map((item) => {
          const isSelected = item.id === selectedId;
          return (
            <li key={item.id}>
              <button
                type="button"
                className={`journalit-broker-picker__tile${item.pinned ? ' is-pinned' : ''}${isSelected || item.expanded ? ' is-selected' : ''}`}
                disabled={disabled}
                aria-pressed={
                  item.expanded === undefined ? isSelected : undefined
                }
                aria-expanded={item.expanded}
                onClick={() => onSelect(item)}
              >
                <BrokerMark
                  label={item.label}
                  logo={item.logo}
                  icon={item.icon}
                  size="lg"
                />
                <span className="journalit-broker-picker__label">
                  {item.label}
                </span>
                {item.badge && (
                  <span
                    className="journalit-broker-picker__badge"
                    role="img"
                    aria-label={item.badge.label}
                  >
                    {item.badge.icon}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
