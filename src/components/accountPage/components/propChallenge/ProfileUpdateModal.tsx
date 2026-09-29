import React, { useEffect, useState } from 'react';
import { Modal } from 'obsidian';
import { createRoot, type Root } from 'react-dom/client';
import type JournalitPlugin from '../../../../main';
import type { AccountData } from '../../../../services/account/types';
import type {
  PropChallengeConfig,
  PropFirmProfileSelection,
} from '../../../../services/propChallenge/types';
import {
  findAccountSourceProfile,
  retainCurrentProfileRules,
  type ProfileNoticeComparison,
} from '../../../../services/propChallenge/PropChallengeProfileNotice';
import { sameProfileContent } from '../../../../services/propChallenge/PropChallengePolicyHistory';
import { eventBus } from '../../../../services/events/EventBus';
import { DisplayPolicyProvider } from '../../../../contexts/DisplayPolicyContext';
import { t } from '../../../../lang/helpers';
import { Button } from '../../../ui/Button';
import { CurrencyCode } from '../../../../utils/currencyConfig';
import { DropdownSelect } from '../../../shared/DropdownSelect';
import { personalProfileSelection } from '../../../../services/propChallenge/PersonalPropFirmProfiles';
import { ProfileUpdateReview } from './ProfileUpdateReview';
import {
  ProfileCorrectionReview,
  CorrectionAuditHistory,
} from './ProfileCorrectionReview';
import {
  resolveProfileApplicability,
  profilePolicyHash,
} from '../../../../services/propChallenge/ProfileApplicability';

interface Options {
  plugin: JournalitPlugin;
  account: AccountData;
  selection: PropFirmProfileSelection;
  comparison: ProfileNoticeComparison;
  onUpdated: () => void | Promise<void>;
}

type ReviewSelection = {
  selection: PropFirmProfileSelection;
  comparison: ProfileNoticeComparison;
};
type FlowOptions = Omit<Options, 'selection' | 'comparison'> & {
  config: PropChallengeConfig;
  initialReview?: ReviewSelection;
};

class ProfileUpdateModal extends Modal {
  private root?: Root;
  constructor(private options: FlowOptions) {
    super(options.plugin.app);
  }
  onOpen() {
    this.modalEl.addClass('journalit-profile-update-modal');
    this.titleEl.setText(
      t(
        !this.options.initialReview
          ? 'account.profiles.link-title'
          : this.options.initialReview.comparison.corrections?.length
            ? 'account.profiles.correction-title'
            : 'account.profiles.review-changes'
      )
    );
    const container = this.contentEl.createDiv({
      cls: 'edit-account-form journalit-prop-challenge-section journalit-profile-update-form',
    });
    this.root = createRoot(container);
    this.root.render(
      <DisplayPolicyProvider privacyModeOverride={false}>
        <ProfileReviewFlow {...this.options} onClose={() => this.close()} />
      </DisplayPolicyProvider>
    );
  }
  onClose() {
    this.root?.unmount();
  }
}

export function openProfileUpdateModal(options: Options): void {
  if (!options.account.propChallenge) return;
  new ProfileUpdateModal({
    ...options,
    account: {
      ...structuredClone(options.account),
      currency:
        options.account.currency ??
        options.plugin.settings.general?.currency ??
        CurrencyCode.USD,
    },
    config: structuredClone(options.account.propChallenge),
    initialReview: {
      selection: structuredClone(options.selection),
      comparison: options.comparison,
    },
  }).open();
}

export function openCorrectionHistoryModal({
  plugin,
  account,
}: Pick<Options, 'plugin' | 'account'>): void {
  if (!account.propChallenge?.correctionHistory?.length) return;
  const config = structuredClone(account.propChallenge);
  const modal = new Modal(plugin.app);
  let root: Root | undefined;
  modal.onOpen = () => {
    modal.modalEl.addClass('journalit-profile-update-modal');
    modal.titleEl.setText(
      `${t('account.profiles.correction-history')} · ${account.name}`
    );
    root = createRoot(
      modal.contentEl.createDiv({ cls: 'journalit-profile-review' })
    );
    root.render(
      <DisplayPolicyProvider>
        <CorrectionAuditHistory config={config} standalone />
      </DisplayPolicyProvider>
    );
  };
  modal.onClose = () => root?.unmount();
  modal.open();
}

export function openProfileSourceModal(
  options: Omit<Options, 'selection' | 'comparison'>
): void {
  if (!options.account.propChallenge) return;
  new ProfileUpdateModal({
    ...options,
    account: {
      ...structuredClone(options.account),
      currency:
        options.account.currency ??
        options.plugin.settings.general?.currency ??
        CurrencyCode.USD,
    },
    config: structuredClone(options.account.propChallenge),
  }).open();
}

function ProfileReviewFlow({
  initialReview,
  ...props
}: FlowOptions & { onClose: () => void }) {
  const [review, setReview] = useState(initialReview);
  return review ? (
    <ProfileUpdateModalContent {...props} {...review} />
  ) : (
    <ProfileSourceChooser
      plugin={props.plugin}
      onClose={props.onClose}
      onSelect={(selection) =>
        setReview({
          selection,
          comparison: {
            changed: {},
            unreviewedPhaseIds: [],
            unknownBaseline: true,
          },
        })
      }
    />
  );
}

function profileSourceIdentity(source: PropFirmProfileSelection): string {
  return JSON.stringify([
    source.source ?? 'catalog',
    source.firmId,
    source.challenge.id,
  ]);
}

function ProfileSourceChooser({
  plugin,
  onSelect,
  onClose,
}: {
  plugin: JournalitPlugin;
  onSelect: (selection: PropFirmProfileSelection) => void;
  onClose: () => void;
}) {
  const [sources, setSources] = useState<PropFirmProfileSelection[]>(() =>
    (plugin.settings.personalPropFirmProfiles ?? []).map(
      personalProfileSelection
    )
  );
  const [selected, setSelected] = useState('');
  const [unavailable, setUnavailable] = useState(false);
  useEffect(() => {
    if (plugin.settings.backendIntegration?.subscriptionTier !== 'premium')
      return;
    let cancelled = false;
    void plugin.serviceManager
      .getServiceByName('propFirmProfileCatalogService')
      .then((service) => service.refresh())
      .then((result) => {
        if (cancelled) return;
        if (result.kind !== 'ready') {
          setUnavailable(true);
          return;
        }
        const catalog = result.catalog;
        const profiles: PropFirmProfileSelection[] = catalog.firms.flatMap(
          (firm) =>
            firm.challenges.map((challenge) => ({
              source: 'catalog',
              firmId: firm.id,
              firmName: firm.name,
              catalogVersion: catalog.version,
              verifiedAt: firm.verifiedAt,
              challenge,
            }))
        );
        setSources([
          ...profiles,
          ...(plugin.settings.personalPropFirmProfiles ?? []).map(
            personalProfileSelection
          ),
        ]);
      })
      .catch(() => {
        if (!cancelled) setUnavailable(true);
      });
    return () => {
      cancelled = true;
    };
  }, [plugin]);
  const selection = sources.find(
    (source) => profileSourceIdentity(source) === selected
  );
  return (
    <div className="journalit-profile-review">
      <p>{t('account.profiles.link-intro')}</p>
      <DropdownSelect
        value={selected}
        onChange={setSelected}
        ariaLabel={t('account.prop-challenge.profile.title')}
        options={[
          { value: '', label: t('account.profiles.choose-source') },
          ...sources.map((source) => ({
            value: profileSourceIdentity(source),
            label: `${source.firmName} / ${source.challenge.name}`,
          })),
        ]}
      />
      {unavailable && <p role="status">{t('account.profiles.check-failed')}</p>}
      <div className="journalit-profile-review__actions">
        <Button variant="plain" size="small" onClick={onClose}>
          {t('button.cancel')}
        </Button>
        <Button
          size="small"
          disabled={!selection}
          onClick={() => {
            if (selection) onSelect(selection);
          }}
        >
          {t('account.profiles.review-changes')}
        </Button>
      </div>
    </div>
  );
}

function ProfileUpdateModalContent(
  props: Options & { config: PropChallengeConfig; onClose: () => void }
) {
  return props.comparison.corrections?.length ? (
    <ProfileCorrectionReview
      {...props}
      matches={props.comparison.corrections}
    />
  ) : (
    <StandardProfileUpdateContent {...props} />
  );
}

function StandardProfileUpdateContent({
  plugin,
  account,
  config,
  selection,
  comparison,
  onUpdated,
  onClose,
}: Options & { config: PropChallengeConfig; onClose: () => void }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const persist = async (next: PropChallengeConfig, update: boolean) => {
    setSaving(true);
    setError('');
    try {
      if (update) {
        const service = await plugin.serviceManager.getServiceByName(
          'propFirmProfileCatalogService'
        );
        const result =
          selection.source === 'personal'
            ? undefined
            : await service.refresh({ force: true });
        if (result?.kind === 'unavailable')
          throw new Error(t('account.profiles.check-failed'));
        const latest = findAccountSourceProfile(
          config.profileRef
            ? config
            : {
                ...config,
                profileRef: {
                  firmId: selection.firmId,
                  challengeId: selection.challenge.id,
                  source: selection.source ?? 'catalog',
                  catalogVersion: selection.catalogVersion,
                  verifiedAt: selection.verifiedAt,
                },
              },
          result?.catalog,
          plugin.settings.personalPropFirmProfiles ?? []
        );
        if (
          !latest ||
          !sameProfileContent(latest.challenge, selection.challenge)
        )
          throw new Error(t('account.profiles.source-changed'));
        const phasesById = new Map(
          config.phases.map((item) => [item.id, item])
        );
        
        
        
        for (const phase of next.phases) {
          const before = phasesById.get(phase.id);
          if (!before || sameProfileContent(before, phase)) continue;
          const decision = await resolveProfileApplicability(
            { ...config, purchaseDate: next.purchaseDate },
            before,
            latest,
            phase.profilePhaseIndex ?? 0
          );
          if (!['personal', 'unknown', 'published'].includes(decision.kind))
            throw new Error(t('account.profiles.source-changed'));
          if (decision.kind !== 'personal') {
            const receipt = phase.profileApplication;
            const revision =
              phase.policyHistory?.[phase.policyHistory.length - 1];
            if (
              decision.kind === 'published' &&
              (await profilePolicyHash(phase)) === decision.change.toPolicyHash
            ) {
              if (
                receipt?.basis !== 'published' ||
                receipt.announcementId !== decision.change.id ||
                receipt.reference !== decision.change.sourceUrl ||
                (phase.status === 'active' &&
                  (!revision ||
                    Date.parse(revision.effectiveAt) !==
                      Date.parse(decision.change.effectiveAt)))
              )
                throw new Error(t('account.profiles.source-changed'));
            } else if (
              receipt?.basis !== 'confirmed' ||
              !receipt.reference.trim()
            )
              throw new Error(t('account.profiles.source-changed'));
          }
        }
      }
      const accounts =
        await plugin.serviceManager.getServiceByName('accountPageService');
      await accounts.updateAccountMetadata(
        account.name,
        { propChallenge: next },
        { expectedPropChallenge: config, expectedCurrency: account.currency }
      );
      eventBus.publish('account:changed', {
        action: 'updated',
        accountId: account.id ?? account.name,
        accountName: account.name,
      });
      await onUpdated();
      onClose();
    } catch (failure) {
      setError(
        failure instanceof Error ? failure.message : t('account.profiles.error')
      );
    } finally {
      setSaving(false);
    }
  };
  return (
    <>
      <div className="journalit-profile-update-source">
        <strong>{account.name}</strong>
        <span>
          {selection.firmName} · {selection.challenge.name}
        </span>
      </div>
      <ProfileUpdateReview
        config={config}
        selection={selection}
        currencyCode={
          account.currency ??
          plugin.settings.general?.currency ??
          CurrencyCode.USD
        }
        initialPhaseId={comparison.unreviewedPhaseIds[0]}
        disabled={saving}
        onCancel={onClose}
        onSaveFacts={(next) => {
          void persist(next, false);
        }}
        onRetain={
          Object.keys(comparison.changed).length
            ? (reviewedConfig) => {
                void persist(
                  retainCurrentProfileRules(reviewedConfig, comparison),
                  false
                );
              }
            : undefined
        }
        onApply={(next) => {
          void persist(next, true);
        }}
      />
      {error && <p role="alert">{error}</p>}
      <CorrectionAuditHistory config={config} />
    </>
  );
}
