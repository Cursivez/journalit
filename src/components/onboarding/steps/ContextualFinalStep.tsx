

import React from 'react';
import { Platform } from 'obsidian';
import { Monitor, CircleDotDashed } from '../../shared/icons/ObsidianIcon';
import { Button } from '../../ui/Button';
import type { OnboardingPath } from './ChoosePathStep';
import { t } from '../../../lang/helpers';

interface ContextualFinalStepProps {
  path: OnboardingPath;
  onBack: () => void;
  onFinish: () => void;
  onChangeHotkey: () => void;
  onAddTrade: () => void;
  onOpenCsv: () => void;
  onOpenMetaTrader: () => void;
}

export const ContextualFinalStep: React.FC<ContextualFinalStepProps> = ({
  path,
  onBack,
  onFinish,
  onChangeHotkey,
  onAddTrade,
  onOpenCsv,
  onOpenMetaTrader,
}) => {
  const getManualHotkeyParts = (): string[] =>
    t('onboarding.final.manual.hotkey.value')
      .split(' + ')
      .map((part) => {
        const normalized = part.trim();
        if (normalized === 'Mod') {
          return Platform.isMacOS ? 'Cmd' : 'Ctrl';
        }
        if (normalized === 'Alt') {
          return Platform.isMacOS ? 'Option' : 'Alt';
        }
        return normalized;
      });

  const renderManualContent = () => {
    if (Platform.isMobileApp) {
      return (
        <div className="contextual-final-manual">
          <div className="contextual-final-hero-glow" aria-hidden="true" />
          <div className="contextual-final-cta-row">
            <Button variant="primary" onClick={onAddTrade}>
              {t('command.add-trade')}
            </Button>
          </div>
        </div>
      );
    }

    const hotkeyParts = getManualHotkeyParts();
    const manualHotkeyDisplay = hotkeyParts.join(' + ');

    return (
      <div className="contextual-final-manual">
        <div className="contextual-final-hero-glow" aria-hidden="true" />

        <div className="contextual-final-manual-hint contextual-final-manual-hint--above">
          {t('onboarding.final.manual.hit-hotkey', {
            hotkey: manualHotkeyDisplay,
          })}
        </div>

        <div
          className="contextual-final-hotkey-keys"
          aria-label={t('onboarding.final.manual.hotkey.title')}
        >
          {hotkeyParts.map((part, index) => (
            <React.Fragment
              key={`${part}-${hotkeyParts.slice(0, index + 1).join('+')}`}
            >
              <span
                className={`contextual-final-hotkey-key ${index === 1 ? 'contextual-final-hotkey-key--center' : ''}`}
              >
                {part}
              </span>
              {index < hotkeyParts.length - 1 && (
                <span className="contextual-final-hotkey-plus">+</span>
              )}
            </React.Fragment>
          ))}
        </div>

        <Button
          variant="primary"
          className="contextual-final-change-hotkey"
          onClick={onChangeHotkey}
        >
          {t('onboarding.final.manual.cta.change-hotkey')}
        </Button>
      </div>
    );
  };

  const renderCsvContent = () => (
    <div className="contextual-final-simple">
      <p className="contextual-final-description">
        {t('onboarding.final.csv.subtitle')}
      </p>

      <div
        className="contextual-final-hero contextual-final-hero--csv"
        aria-hidden="true"
      >
        <div className="contextual-final-hero-glow" aria-hidden="true" />
        <div className="csv-hero-meta" role="presentation">
          <span className="csv-hero-file">trades.csv</span>
          <span className="csv-hero-meta-sep">•</span>
          <span className="csv-hero-count">42</span>
        </div>

        <div className="csv-hero-deck" role="presentation">
          <div className="csv-hero-card csv-hero-card--back">
            <div className="csv-hero-card-top">
              <span className="csv-hero-date">2026-01-27</span>
              <span className="csv-hero-symbol">CL</span>
            </div>
            <div className="csv-hero-card-bottom">
              <span className="csv-hero-dir csv-hero-dir--up">▲</span>
              <span className="csv-hero-pnl csv-hero-pnl--pos">+$120.00</span>
            </div>
          </div>

          <div className="csv-hero-card csv-hero-card--mid">
            <div className="csv-hero-card-top">
              <span className="csv-hero-date">2026-01-28</span>
              <span className="csv-hero-symbol">ES</span>
            </div>
            <div className="csv-hero-card-bottom">
              <span className="csv-hero-dir csv-hero-dir--down">▼</span>
              <span className="csv-hero-pnl csv-hero-pnl--neg">-$62.50</span>
            </div>
          </div>

          <div className="csv-hero-card csv-hero-card--front">
            <div className="csv-hero-card-top">
              <span className="csv-hero-date">2026-01-29</span>
              <span className="csv-hero-symbol">NQ</span>
            </div>
            <div className="csv-hero-card-bottom">
              <span className="csv-hero-dir csv-hero-dir--up">▲</span>
              <span className="csv-hero-pnl csv-hero-pnl--pos">+$187.50</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMetaTraderContent = () => (
    <div className="contextual-final-simple">
      <p className="contextual-final-description">
        {t('onboarding.final.mt.subtitle')}
      </p>

      <div
        className="contextual-final-hero contextual-final-hero--mt"
        aria-hidden="true"
      >
        <div className="contextual-final-hero-glow" aria-hidden="true" />
        <div className="mt-hero" role="presentation">
          <div className="mt-hero-node mt-hero-node--source">
            <div className="mt-hero-node-icon mt-hero-node-icon--mt">
              <Monitor size={14} strokeWidth={2} />
            </div>
            <div className="mt-hero-node-text">
              <div className="mt-hero-node-title">
                {t('onboarding.final.mt.hero.source.title')}
              </div>
              <div className="mt-hero-node-sub">
                {t('onboarding.final.mt.hero.source.subtitle')}
              </div>
            </div>
          </div>

          <div className="mt-hero-link">
            <div className="mt-hero-line">
              <span className="mt-hero-packet" />
              <span className="mt-hero-packet" />
              <span className="mt-hero-packet" />
            </div>
            <div className="mt-hero-arrow" />
          </div>

          <div className="mt-hero-node mt-hero-node--dest">
            <div className="mt-hero-node-icon mt-hero-node-icon--vault">
              <CircleDotDashed size={14} strokeWidth={2} />
            </div>
            <div className="mt-hero-node-text">
              <div className="mt-hero-node-title">
                {t('onboarding.final.mt.hero.dest.title')}
              </div>
              <div className="mt-hero-node-sub">
                {t('onboarding.final.mt.hero.dest.subtitle')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const getTitle = () => {
    if (path === 'manual') {
      return t('onboarding.final.manual.title');
    }
    if (path === 'csv') {
      return t('onboarding.final.csv.title');
    }
    return t('onboarding.final.mt.title');
  };

  return (
    <div
      className={`contextual-final-step ${path === 'manual' ? 'contextual-final-step--manual' : ''}`}
    >
      <div
        className={`contextual-final-content ${path === 'manual' ? 'contextual-final-content--manual' : ''}`}
      >
        <div className="contextual-final-header">
          <h1>{getTitle()}</h1>
        </div>

        {path === 'manual' && renderManualContent()}
        {path === 'csv' && renderCsvContent()}
        {path === 'mt' && renderMetaTraderContent()}

        {path === 'manual' ? (
          <div className="contextual-final-manual-footer">
            <div className="contextual-final-manual-actions">
              <Button variant="secondary" onClick={onBack}>
                {t('button.back')}
              </Button>
              <Button variant="secondary" onClick={onFinish}>
                {t('onboarding.final.finish')}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="step-actions contextual-final-actions">
              <Button variant="secondary" onClick={onBack}>
                {t('button.back')}
              </Button>
              <Button
                variant="primary"
                onClick={path === 'csv' ? onOpenCsv : onOpenMetaTrader}
              >
                {path === 'csv'
                  ? t('onboarding.final.csv.cta.open')
                  : t('onboarding.final.mt.cta.open')}
              </Button>
            </div>
            <Button
              variant="text"
              className="contextual-final-finish-link"
              onClick={onFinish}
            >
              {t('onboarding.final.finish')}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
