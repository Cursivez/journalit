

import React, {
  useState,
  useCallback,
  useMemo,
  memo,
  useRef,
  useEffect,
} from 'react';
import {
  TrendingUp,
  AlertTriangle,
  FlaskConical,
} from '../../../shared/icons/ObsidianIcon';
import { TradeFormData, TradeFormValue } from '../types';
import {
  RadioOption,
  RadioOptionGroup,
} from '../../../onboarding/shared/RadioOptionGroup';
import { t } from '../../../../lang/helpers';
import { cssVars } from '../../../../styles/inlineStylePolicy';

type TradeType = 'regular' | 'missed' | 'backtest';

interface TradeTypeSelectorProps {
  
  data: Partial<TradeFormData>;
  
  onChange: (field: keyof TradeFormData, value: TradeFormValue) => void;
}


const TradeTypeIcon: React.FC<{ type: TradeType }> = ({ type }) => {
  const iconProps = {
    size: 16,
    className: 'journalit-trade-type-selector__icon',
  };

  switch (type) {
    case 'regular':
      return <TrendingUp {...iconProps} />;
    case 'missed':
      return <AlertTriangle {...iconProps} />;
    case 'backtest':
      return <FlaskConical {...iconProps} />;
    default:
      return <TrendingUp {...iconProps} />;
  }
};


const getTradeTypeOptions = (): RadioOption<TradeType>[] => [
  {
    value: 'regular',
    label: t('form.trade-type.regular'),
    description: t('form.trade-type.regular-desc'),
  },
  {
    value: 'missed',
    label: t('form.trade-type.missed'),
    description: t('form.trade-type.missed-desc'),
  },
  {
    value: 'backtest',
    label: t('form.trade-type.backtest'),
    description: t('form.trade-type.backtest-desc'),
  },
];


const TradeTypeSelectorComponent: React.FC<TradeTypeSelectorProps> = ({
  data,
  onChange,
}) => {
  
  const [isExpanded, setIsExpanded] = useState(false);

  
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number>(0);

  
  const currentTradeType: TradeType = data.isMissedTrade
    ? 'missed'
    : data.isBacktestTrade
      ? 'backtest'
      : 'regular';

  
  useEffect(() => {
    if (contentRef.current) {
      const height = contentRef.current.scrollHeight;
      setContentHeight(height);
    }
  }, [isExpanded, currentTradeType, data.missedReason]);

  
  const handleTradeTypeChange = useCallback(
    (type: TradeType) => {
      
      onChange('isMissedTrade', false);
      onChange('isBacktestTrade', false);

      
      if (type === 'missed') {
        onChange('isMissedTrade', true);
      } else if (type === 'backtest') {
        onChange('isBacktestTrade', true);
      }
      
    },
    [onChange]
  );

  
  const tradeTypeOptions = useMemo(() => getTradeTypeOptions(), []);

  
  const currentLabel = useMemo(() => {
    const currentOption = tradeTypeOptions.find(
      (opt) => opt.value === currentTradeType
    );
    return currentOption ? currentOption.label : t('form.trade-type.regular');
  }, [currentTradeType, tradeTypeOptions]);

  const toggleAccordion = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsExpanded((prev) => !prev);
    }
  }, []);

  const handleMissedReasonChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange('missedReason', e.target.value);
    },
    [onChange]
  );

  return (
    <div className="field">
      <div
        className={[
          'journalit-trade-type-selector',
          isExpanded ? 'is-expanded' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        
        <div
          onClick={toggleAccordion}
          role="button"
          aria-expanded={isExpanded}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          className="journalit-trade-type-selector__header"
        >
          <div className="journalit-trade-type-selector__header-main">
            <label className="journalit-trade-type-selector__title">
              {t('form.trade-type.title')}
            </label>
            <span className="journalit-trade-type-selector__current">
              <TradeTypeIcon type={currentTradeType} />
              {currentLabel}
            </span>
          </div>

          
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={[
              'journalit-trade-type-selector__chevron',
              isExpanded ? 'is-expanded' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>

        
        <div
          className="journalit-trade-type-selector__content"
          style={cssVars({
            '--trade-type-accordion-height': `${contentHeight}px`,
          })}
        >
          <div
            ref={contentRef}
            className="journalit-trade-type-selector__content-inner"
          >
            <p className="journalit-trade-type-selector__description">
              {t('form.trade-type.subtitle')}
            </p>

            <RadioOptionGroup<TradeType>
              options={tradeTypeOptions}
              selectedValue={currentTradeType}
              onSelect={handleTradeTypeChange}
              variant="default"
            />

            
            {currentTradeType === 'missed' && (
              <div className="field journalit-trade-type-selector__missed-field">
                <label className="label">
                  {t('form.trade-type.missed-reason')}
                </label>
                <textarea
                  value={data.missedReason || ''}
                  onChange={handleMissedReasonChange}
                  placeholder={t('form.trade-type.missed-reason-placeholder')}
                  rows={3}
                  className="textarea journalit-trade-type-selector__textarea"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


export const TradeTypeSelector = memo(
  TradeTypeSelectorComponent,
  (prevProps, nextProps) => {
    return (
      prevProps.data.isMissedTrade === nextProps.data.isMissedTrade &&
      prevProps.data.isBacktestTrade === nextProps.data.isBacktestTrade &&
      prevProps.data.missedReason === nextProps.data.missedReason &&
      prevProps.onChange === nextProps.onChange
    );
  }
);
