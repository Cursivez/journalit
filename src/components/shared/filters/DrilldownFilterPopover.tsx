import React from 'react';
import { t } from '../../../lang/helpers';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  type ObsidianIconComponent,
} from '../icons/ObsidianIcon';

export const DrilldownFilterPanel: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className="journalit-drilldown-filter__panel">{children}</div>;

export const DrilldownFilterPanelHeader: React.FC<{
  title: string;
  onBack: () => void;
}> = ({ title, onBack }) => (
  <div className="journalit-drilldown-filter__panel-header">
    <button
      type="button"
      className="journalit-drilldown-filter__back clickable-icon"
      onClick={onBack}
      aria-label={t('home.filters.back')}
    >
      <ChevronLeft size={15} aria-hidden="true" />
    </button>
    <span>{title}</span>
  </div>
);

const DrilldownFilterCheck: React.FC<{ checked: boolean }> = ({ checked }) => (
  <span
    className={`journalit-drilldown-filter__check${checked ? ' journalit-drilldown-filter__check--active' : ''}`}
    aria-hidden="true"
  >
    {checked ? <Check size={11} /> : null}
  </span>
);

export const DrilldownFilterRow: React.FC<{
  icon: ObsidianIconComponent;
  label: string;
  summary: string;
  onClick: () => void;
}> = ({ icon: Icon, label, summary, onClick }) => (
  <button
    type="button"
    className="journalit-drilldown-filter__row"
    onClick={onClick}
  >
    <Icon
      size={14}
      className="journalit-drilldown-filter__row-icon"
      aria-hidden="true"
    />
    <span className="journalit-drilldown-filter__row-label">{label}</span>
    <span className="journalit-drilldown-filter__row-summary">{summary}</span>
    <ChevronRight size={15} aria-hidden="true" />
  </button>
);

export const DrilldownFilterOption: React.FC<{
  checked: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ checked, onClick, children }) => (
  <button
    type="button"
    className="journalit-drilldown-filter__option"
    aria-pressed={checked}
    onClick={onClick}
  >
    <DrilldownFilterCheck checked={checked} />
    <span>{children}</span>
  </button>
);

export const DrilldownFilterDivider = () => (
  <div className="journalit-drilldown-filter__divider" />
);
export const DrilldownFilterEmpty: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className="journalit-drilldown-filter__empty">{children}</div>;
