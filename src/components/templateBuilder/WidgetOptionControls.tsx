

import React from 'react';
import type { WidgetPlacement } from '../../types/reviewV2';
import {
  getWidgetOptionControls,
  type WidgetOptionPair,
  type WidgetOptionSelect,
  type WidgetOptionToggle,
} from './widgetOptionDefinitions';
import { DropdownSelect } from '../shared/DropdownSelect';

interface WidgetOptionControlsProps {
  widget: WidgetPlacement;
  onConfigChange: (config: Record<string, unknown>) => void;
}

const isToggleOn = (
  config: Record<string, unknown> | undefined,
  control: WidgetOptionToggle
): boolean => {
  const value = config?.[control.key];
  return typeof value === 'boolean' ? value : control.defaultValue;
};

const getSelectValue = (
  config: Record<string, unknown> | undefined,
  control: WidgetOptionSelect
): string | number | null => {
  const value = config?.[control.key];
  const selected = control.options.find((option) => option.value === value);
  return selected ? selected.value : control.defaultValue;
};

type PairChoice = 'both' | 'first' | 'second';

const isPairKeyOn = (
  config: Record<string, unknown> | undefined,
  key: string
): boolean => config?.[key] !== false;

const getPairChoice = (
  config: Record<string, unknown> | undefined,
  control: WidgetOptionPair
): PairChoice => {
  const firstOn = isPairKeyOn(config, control.first.key);
  const secondOn = isPairKeyOn(config, control.second.key);
  if (firstOn && !secondOn) return 'first';
  if (secondOn && !firstOn) return 'second';
  return 'both';
};


const toOptionValue = (value: string | number | null): string =>
  value === null ? '' : String(value);

export const WidgetOptionControls: React.FC<WidgetOptionControlsProps> = ({
  widget,
  onConfigChange,
}) => {
  const controls = getWidgetOptionControls(widget);
  if (controls.length === 0) return null;

  const setValue = (key: string, value: unknown) => {
    const next = { ...widget.config };
    if (value === null) delete next[key];
    else next[key] = value;
    onConfigChange(next);
  };

  
  const setPairChoice = (control: WidgetOptionPair, choice: PairChoice) => {
    const next = { ...widget.config };
    delete next[control.first.key];
    delete next[control.second.key];
    if (choice === 'first') next[control.second.key] = false;
    if (choice === 'second') next[control.first.key] = false;
    onConfigChange(next);
  };

  const renderToggle = (control: WidgetOptionToggle) => (
    <label
      key={control.key}
      className="template-widget-config-label template-widget-config-label--clickable"
    >
      <input
        type="checkbox"
        checked={isToggleOn(widget.config, control)}
        onChange={(event) => setValue(control.key, event.target.checked)}
        className="template-widget-config-checkbox"
      />
      {control.label}
    </label>
  );

  return (
    <div className="template-widget-config-row template-widget-config-row--wide template-widget-config-row--options">
      {controls.map((control) => {
        switch (control.kind) {
          case 'select': {
            const selected = getSelectValue(widget.config, control);
            return (
              <label key={control.key} className="template-widget-config-label">
                {control.label}
                <DropdownSelect
                  ariaLabel={control.label}
                  width="content"
                  value={toOptionValue(selected)}
                  options={control.options.map((option) => ({
                    value: toOptionValue(option.value),
                    label: option.label,
                  }))}
                  onChange={(value) => {
                    const option = control.options.find(
                      (candidate) => toOptionValue(candidate.value) === value
                    );
                    if (option) setValue(control.key, option.value);
                  }}
                />
              </label>
            );
          }
          case 'toggle':
            return renderToggle(control);
          case 'pair':
            return (
              <label
                key={`${control.first.key}-${control.second.key}`}
                className="template-widget-config-label"
              >
                {control.label}
                <DropdownSelect
                  ariaLabel={control.label}
                  width="content"
                  value={getPairChoice(widget.config, control)}
                  options={[
                    { value: 'both', label: control.bothLabel },
                    { value: 'first', label: control.first.label },
                    { value: 'second', label: control.second.label },
                  ]}
                  onChange={(choice) => {
                    if (
                      choice === 'both' ||
                      choice === 'first' ||
                      choice === 'second'
                    ) {
                      setPairChoice(control, choice);
                    }
                  }}
                />
              </label>
            );
        }
      })}
    </div>
  );
};
