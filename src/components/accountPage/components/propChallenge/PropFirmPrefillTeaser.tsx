

import React, { useEffect, useState } from 'react';
import { t } from '../../../../lang/helpers';
import { ChevronRight, Star } from '../../../shared/icons/ObsidianIcon';
import { useService } from '../../../../hooks/useService';
import { usePlugin } from '../../../../hooks/usePlugin';
import { Tooltip } from '../../../shared/Tooltip';
import type JournalitPlugin from '../../../../main';
import { Notice } from 'obsidian';
import type { PropFirmSummary } from '../../../../services/propChallenge/types';
import { matchFirm } from './propFirmPrefillMatch';


const PROP_BENEFIT_KEYS = [
  'upgrade.benefit.prop.rules',
  'upgrade.benefit.prop.payout',
  'upgrade.benefit.prop.phases',
  'upgrade.benefit.prop.updates',
] as const;


function openPropUpgrade(plugin: JournalitPlugin, message: string): void {
  void import('../../../modals/UpgradeModal')
    .then(({ openUpgradeModal }) => {
      openUpgradeModal({
        app: plugin.app,
        plugin,
        featureName: t('account.prop-challenge.profile.title'),
        feature: 'propFirmProfiles',
        message,
        benefits: PROP_BENEFIT_KEYS.map((key) => t(key)),
        benefitsTitle: t('upgrade.prop-profiles.benefits-title'),
      });
    })
    .catch((error) => {
      console.error('[Journalit] Failed to load UpgradeModal:', error);
      new Notice(t('notice.error.open-upgrade-modal'));
    });
}


const PREVIEW_FIRM_COUNT = 4;

function previewNames(firms: readonly PropFirmSummary[]): string {
  return firms
    .slice(0, PREVIEW_FIRM_COUNT)
    .map((firm) => firm.name)
    .join(', ');
}


export function usePropFirmIndex(): PropFirmSummary[] {
  const { service } = useService('propFirmProfileCatalogService');
  const [firms, setFirms] = useState<PropFirmSummary[]>([]);

  useEffect(() => {
    if (!service) return;
    let cancelled = false;
    const cached = service.getFirmIndex();
    if (cached) setFirms(cached.firms);
    void service.refreshFirmIndex().then((index) => {
      if (!cancelled && index) setFirms(index.firms);
    });
    return () => {
      cancelled = true;
    };
  }, [service]);

  return firms;
}


export const PropFirmPrefillHeadingLink: React.FC<{
  firms: readonly PropFirmSummary[];
}> = ({ firms }) => {
  
  
  const plugin = usePlugin();
  
  
  const remaining = Math.max(0, firms.length - PREVIEW_FIRM_COUNT);
  if (!plugin) return null;

  const label =
    firms.length === 0
      ? t('account.prop-challenge.prefill.heading-link')
      : remaining > 0
        ? t('account.prop-challenge.prefill.heading-link-firms', {
            firms: previewNames(firms),
            count: String(remaining),
          })
        : t('account.prop-challenge.prefill.heading-link-firms-all', {
            firms: previewNames(firms),
          });

  return (
    <Tooltip content={label} delay={200} preferredPosition="bottom">
      
      <button
        type="button"
        className="journalit-native-button journalit-prop-prefill-heading-link"
        onClick={() =>
          openPropUpgrade(
            plugin,
            
            
            
            firms.length === 0
              ? t('upgrade.prop-profiles.message')
              : t('upgrade.prop-profiles.message-firms', {
                  count: String(firms.length),
                })
          )
        }
      >
        <span className="journalit-prop-prefill-badge">
          {t('onboarding.features.badge.pro')}
        </span>
        <span className="journalit-prop-prefill-heading-link-label">
          {t('account.prop-challenge.prefill.heading-link')}
        </span>
        <ChevronRight
          size={12}
          aria-hidden="true"
          className="journalit-prop-prefill-chevron"
        />
      </button>
    </Tooltip>
  );
};

PropFirmPrefillHeadingLink.displayName = 'PropFirmPrefillHeadingLink';


export const PropFirmPrefillMatch: React.FC<{
  firms: readonly PropFirmSummary[];
  typedFirmName: string;
}> = ({ firms, typedFirmName }) => {
  const plugin = usePlugin();
  const match = matchFirm(typedFirmName, firms);
  if (!plugin || !match) return null;

  return (
    <button
      type="button"
      className="journalit-native-button journalit-prop-prefill-match"
      onClick={() =>
        openPropUpgrade(
          plugin,
          t('upgrade.prop-profiles.message-firm', { firm: match.name })
        )
      }
    >
      <Star size={11} aria-hidden="true" />
      <span>
        {t('account.prop-challenge.prefill.match', {
          firm: match.name,
          count: String(match.challenges),
        })}
      </span>
      <ChevronRight
        size={12}
        aria-hidden="true"
        className="journalit-prop-prefill-chevron"
      />
    </button>
  );
};

PropFirmPrefillMatch.displayName = 'PropFirmPrefillMatch';


export const PropFirmPrefillPhaseLink: React.FC<{
  firms: readonly PropFirmSummary[];
  typedFirmName: string;
}> = ({ firms, typedFirmName }) => {
  const plugin = usePlugin();
  if (!plugin) return null;
  const match = matchFirm(typedFirmName, firms);
  return (
    <button
      type="button"
      className="journalit-native-button journalit-prop-prefill-match"
      onClick={() =>
        openPropUpgrade(
          plugin,
          match
            ? t('upgrade.prop-profiles.message-firm', { firm: match.name })
            : firms.length === 0
              ? t('upgrade.prop-profiles.message')
              : t('upgrade.prop-profiles.message-firms', {
                  count: String(firms.length),
                })
        )
      }
    >
      <span className="journalit-prop-prefill-badge">
        {t('onboarding.features.badge.pro')}
      </span>
      <span>
        {match
          ? t('account.prop-challenge.prefill.phase-link-firm', {
              firm: match.name,
            })
          : t('account.prop-challenge.prefill.phase-link')}
      </span>
      <ChevronRight
        size={12}
        aria-hidden="true"
        className="journalit-prop-prefill-chevron"
      />
    </button>
  );
};
PropFirmPrefillPhaseLink.displayName = 'PropFirmPrefillPhaseLink';


export const PropFirmRuleUpdatesTeaser: React.FC<{ firmName?: string }> = ({
  firmName,
}) => {
  const plugin = usePlugin();
  const firms = usePropFirmIndex();
  if (!plugin) return null;
  const match = matchFirm(firmName ?? '', firms);
  return (
    <button
      type="button"
      className="journalit-native-button journalit-prop-prefill-heading-link"
      onClick={() =>
        openPropUpgrade(
          plugin,
          match
            ? t('upgrade.prop-profiles.message-updates-firm', {
                firm: match.name,
              })
            : t('upgrade.prop-profiles.message-updates')
        )
      }
    >
      <span className="journalit-prop-prefill-badge">
        {t('onboarding.features.badge.pro')}
      </span>
      <span className="journalit-prop-prefill-heading-link-label">
        {match
          ? t('account.prop-challenge.prefill.updates-link-firm', {
              firm: match.name,
            })
          : t('account.prop-challenge.prefill.updates-link')}
      </span>
      <ChevronRight
        size={12}
        aria-hidden="true"
        className="journalit-prop-prefill-chevron"
      />
    </button>
  );
};
PropFirmRuleUpdatesTeaser.displayName = 'PropFirmRuleUpdatesTeaser';
