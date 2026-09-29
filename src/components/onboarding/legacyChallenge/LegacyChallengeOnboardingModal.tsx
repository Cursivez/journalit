

import { App, Modal } from 'obsidian';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import type JournalitPlugin from '../../../main';
import { t } from '../../../lang/helpers';
import {
  markLegacyChallengeOnboarding,
  suggestLegacyAccountGroups,
} from '../../../services/accountMerge/LegacyChallengeOnboarding';
import { formatDateDisplay } from '../../../utils/dateUtils';
import { Button } from '../../ui/Button';
import ToggleSwitch from '../../ui/ToggleSwitch';
import { DropdownSelect } from '../../shared/DropdownSelect';
import { Check } from '../../shared/icons/ObsidianIcon';
import { openAccountMergeModal } from '../../accountPage/components/accountMerge/AccountMergeModal';
import { ensureAccountMergeServices } from '../../../services/accountMerge/ensureAccountMergeServices';
import { ModalGuide } from '../../../guides/modalGuide/ModalGuide';
import {
  LEGACY_CHALLENGE_SETUP_GUIDE_IDENTITY,
  LEGACY_CHALLENGE_SETUP_GUIDE_STEPS,
} from '../../../guides/accountConversionGuides';
import { suspendViewGuidesWhileOpen } from '../../../guides/suspendViewGuides';

interface LegacyAccountRow {
  name: string;
  accountType?: string;
  archived: boolean;
  createdDate?: Date;
}

type Assignment =
  | { kind: 'leave' }
  | { kind: 'own' }
  | { kind: 'group'; groupId: string };

interface ChallengeGroup {
  id: string;
  letter: string;
  suggested: boolean;
}

type Outcome = 'merged' | 'converted';

const LEAVE = 'leave';
const OWN = 'own';
const NEW_GROUP = 'new';
const GROUP_PREFIX = 'group:';

function groupLetter(index: number): string {
  return String.fromCharCode('A'.charCodeAt(0) + (index % 26));
}

function assignmentValue(assignment: Assignment | undefined): string {
  if (!assignment || assignment.kind === 'leave') return LEAVE;
  if (assignment.kind === 'own') return OWN;
  return `${GROUP_PREFIX}${assignment.groupId}`;
}

function sortByCreated(rows: readonly LegacyAccountRow[]): LegacyAccountRow[] {
  return [...rows].sort((a, b) => {
    const ta = a.createdDate?.getTime() ?? Number.POSITIVE_INFINITY;
    const tb = b.createdDate?.getTime() ?? Number.POSITIVE_INFINITY;
    if (ta !== tb) return ta < tb ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}

const LegacyAccountRowView: React.FC<{
  row: LegacyAccountRow;
  assignment: Assignment | undefined;
  group: ChallengeGroup | undefined;
  outcome: Outcome | undefined;
  
  isFirstPending: boolean;
  options: { value: string; label: string }[];
  disabled: boolean;
  onAssign: (name: string, value: string) => void;
}> = ({
  row,
  assignment,
  group,
  outcome,
  isFirstPending,
  options,
  disabled,
  onAssign,
}) => (
  <div
    className={`journalit-legacy-challenge-onboarding__row${
      outcome ? ' is-done' : ''
    }${group ? ' is-grouped' : ''}`}
  >
    <span
      className={`journalit-legacy-challenge-onboarding__marker${
        group ? ' is-group' : ''
      }${group?.suggested ? ' is-suggested' : ''}`}
      aria-label={
        group?.suggested
          ? t('onboarding.legacy-challenge.suggested')
          : undefined
      }
    >
      {outcome ? <Check size={12} /> : (group?.letter ?? '')}
    </span>
    <span className="journalit-legacy-challenge-onboarding__row-label">
      {row.name}
      {group?.suggested && !outcome && (
        <span className="journalit-legacy-challenge-onboarding__suggested">
          {t('onboarding.legacy-challenge.suggested')}
        </span>
      )}
    </span>
    <span className="journalit-legacy-challenge-onboarding__row-meta">
      {row.accountType && <span>{row.accountType}</span>}
      {row.createdDate && <span>{formatDateDisplay(row.createdDate)}</span>}
    </span>
    {outcome ? (
      <span className="journalit-legacy-challenge-onboarding__row-done">
        {t(
          outcome === 'merged'
            ? 'onboarding.legacy-challenge.status.combined'
            : 'onboarding.legacy-challenge.status.converted'
        )}
      </span>
    ) : (
      <div
        className="journalit-legacy-challenge-onboarding__assign"
        data-journalit-guide-target={
          isFirstPending ? 'legacy-challenge.assign' : undefined
        }
      >
        <DropdownSelect
          value={assignmentValue(assignment)}
          options={options}
          onChange={(value) => onAssign(row.name, value)}
          ariaLabel={t('onboarding.legacy-challenge.row.aria', {
            account: row.name,
          })}
          disabled={disabled}
          menuWidth="content"
        />
      </div>
    )}
  </div>
);

const LegacyChallengeSetupContent: React.FC<{
  app: App;
  plugin: JournalitPlugin;
  onClose: () => void;
}> = ({ app, plugin, onClose }) => {
  const [rows, setRows] = useState<LegacyAccountRow[] | null>(null);
  const [groups, setGroups] = useState<ChallengeGroup[]>([]);
  const [assignments, setAssignments] = useState<Record<string, Assignment>>(
    {}
  );
  const [outcomes, setOutcomes] = useState<Record<string, Outcome>>({});
  const [showArchived, setShowArchived] = useState(false);
  const [running, setRunning] = useState(false);

  const accountPageService = plugin.accountPageService;

  useEffect(() => {
    if (!accountPageService) return;
    let cancelled = false;
    void (async () => {
      const catalog = await accountPageService.getAccountCatalog();
      const loaded: LegacyAccountRow[] = [];
      for (const entry of catalog) {
        const metadata = accountPageService.getRevivedAccountMetadata(
          entry.name
        );
        if (!metadata || metadata.propChallenge) continue;
        loaded.push({
          name: entry.name,
          accountType: entry.accountType,
          archived: entry.archived,
          createdDate:
            metadata.createdDate instanceof Date
              ? metadata.createdDate
              : undefined,
        });
      }
      if (cancelled) return;
      const ordered = sortByCreated(loaded);
      const suggested = suggestLegacyAccountGroups(
        ordered.filter((row) => !row.archived)
      );
      const initialGroups: ChallengeGroup[] = suggested.map((_, index) => ({
        id: `suggested-${index}`,
        letter: groupLetter(index),
        suggested: true,
      }));
      const initialAssignments: Record<string, Assignment> = {};
      suggested.forEach((names, index) => {
        for (const name of names) {
          initialAssignments[name] = {
            kind: 'group',
            groupId: initialGroups[index].id,
          };
        }
      });
      setRows(ordered);
      setGroups(initialGroups);
      setAssignments(initialAssignments);
    })();
    return () => {
      cancelled = true;
    };
  }, [accountPageService]);

  const visibleRows = useMemo(
    () =>
      (rows ?? []).filter(
        (row) => showArchived || !row.archived || outcomes[row.name]
      ),
    [rows, showArchived, outcomes]
  );

  const assign = useCallback(
    (name: string, value: string) => {
      if (value === NEW_GROUP) {
        const group: ChallengeGroup = {
          id: `group-${Date.now()}-${groups.length}`,
          letter: groupLetter(groups.length),
          suggested: false,
        };
        setGroups((current) => [...current, group]);
        setAssignments((assignmentsNow) => ({
          ...assignmentsNow,
          [name]: { kind: 'group', groupId: group.id },
        }));
        return;
      }
      setAssignments((current) => {
        const next = { ...current };
        if (value === LEAVE) delete next[name];
        else if (value === OWN) next[name] = { kind: 'own' };
        else if (value.startsWith(GROUP_PREFIX))
          next[name] = {
            kind: 'group',
            groupId: value.slice(GROUP_PREFIX.length),
          };
        return next;
      });
    },
    [groups.length]
  );

  
  const jobs = useMemo(() => {
    const pending = (rows ?? []).filter((row) => !outcomes[row.name]);
    const members = new Map<string, LegacyAccountRow[]>();
    const singles: LegacyAccountRow[] = [];
    for (const row of pending) {
      const assignment = assignments[row.name];
      if (!assignment || assignment.kind === 'leave') continue;
      if (assignment.kind === 'own') {
        singles.push(row);
        continue;
      }
      const list = members.get(assignment.groupId);
      if (list) list.push(row);
      else members.set(assignment.groupId, [row]);
    }
    const result: LegacyAccountRow[][] = [];
    for (const group of groups) {
      const list = members.get(group.id);
      if (!list?.length) continue;
      result.push(sortByCreated(list));
    }
    for (const single of singles) result.push([single]);
    return result;
  }, [rows, outcomes, assignments, groups]);

  const runJobs = useCallback(async () => {
    setRunning(true);
    try {
      const total = jobs.length;
      for (let index = 0; index < total; index += 1) {
        const job = jobs[index];
        const names = job.map((row) => row.name);
        const outcome = await openAccountMergeModal(app, plugin, {
          accounts: names,
          sequence: { index: index + 1, total },
        });
        if (outcome === 'cancelled') return;
        setOutcomes((current) => {
          const next = { ...current };
          for (const name of names)
            next[name] = names.length > 1 ? 'merged' : 'converted';
          return next;
        });
      }
      await markLegacyChallengeOnboarding(plugin, 'completed');
      onClose();
    } finally {
      setRunning(false);
    }
  }, [app, jobs, onClose, plugin]);

  const skip = useCallback(() => {
    void markLegacyChallengeOnboarding(plugin, 'skipped');
    onClose();
  }, [onClose, plugin]);

  const options = useMemo(
    () => [
      { value: LEAVE, label: t('onboarding.legacy-challenge.assign.leave') },
      { value: OWN, label: t('onboarding.legacy-challenge.assign.own') },
      ...groups.map((group) => ({
        value: `${GROUP_PREFIX}${group.id}`,
        label: t('onboarding.legacy-challenge.assign.group', {
          letter: group.letter,
        }),
      })),
      {
        value: NEW_GROUP,
        label: t('onboarding.legacy-challenge.assign.new-group'),
      },
    ],
    [groups]
  );

  const groupById = useMemo(
    () => new Map(groups.map((group) => [group.id, group])),
    [groups]
  );
  const firstPendingName = visibleRows.find((row) => !outcomes[row.name])?.name;

  return (
    <>
      <div className="journalit-legacy-challenge-onboarding__head">
        <span className="journalit-legacy-challenge-onboarding__legend">
          {t('onboarding.legacy-challenge.legend')}
        </span>
        <label className="journalit-legacy-challenge-onboarding__archive-toggle">
          {t('onboarding.legacy-challenge.accounts.show-archived')}
          <ToggleSwitch
            checked={showArchived}
            onChange={setShowArchived}
            ariaLabel={t('onboarding.legacy-challenge.accounts.show-archived')}
          />
        </label>
      </div>

      {!running && rows !== null && (
        <ModalGuide
          plugin={plugin}
          identity={LEGACY_CHALLENGE_SETUP_GUIDE_IDENTITY}
          steps={LEGACY_CHALLENGE_SETUP_GUIDE_STEPS}
        />
      )}
      <div
        className="journalit-legacy-challenge-onboarding__list"
        data-journalit-guide-target="legacy-challenge.list"
      >
        {rows === null && (
          <div className="journalit-legacy-challenge-onboarding__empty">
            {t('onboarding.legacy-challenge.loading')}
          </div>
        )}
        {rows !== null && visibleRows.length === 0 && (
          <div className="journalit-legacy-challenge-onboarding__empty">
            {t('onboarding.legacy-challenge.accounts.empty')}
          </div>
        )}
        {visibleRows.map((row) => {
          const assignment = assignments[row.name];
          return (
            <LegacyAccountRowView
              key={row.name}
              row={row}
              assignment={assignment}
              group={
                assignment?.kind === 'group'
                  ? groupById.get(assignment.groupId)
                  : undefined
              }
              outcome={outcomes[row.name]}
              isFirstPending={row.name === firstPendingName}
              options={options}
              disabled={running}
              onAssign={assign}
            />
          );
        })}
      </div>
      <div className="journalit-legacy-challenge-onboarding__actions">
        <Button variant="plain" disabled={running} onClick={skip}>
          {t('onboarding.legacy-challenge.action.skip')}
        </Button>
        <span className="journalit-legacy-challenge-onboarding__actions-spacer" />
        <Button
          variant="primary"
          disabled={running || jobs.length === 0}
          onClick={() => void runJobs()}
          data-journalit-guide-target="legacy-challenge.continue"
        >
          {jobs.length > 0
            ? t('onboarding.legacy-challenge.action.continue-count', {
                count: String(jobs.length),
              })
            : t('onboarding.legacy-challenge.action.continue')}
        </Button>
      </div>
    </>
  );
};

class LegacyChallengeOnboardingModal extends Modal {
  private root: Root | null = null;

  constructor(
    app: App,
    private readonly plugin: JournalitPlugin
  ) {
    super(app);
    this.titleEl.setText(t('onboarding.legacy-challenge.title'));
    this.modalEl.addClass('journalit-legacy-challenge-onboarding-modal');
  }

  onOpen(): void {
    const { contentEl } = this;
    contentEl.empty();
    suspendViewGuidesWhileOpen(this.modalEl);
    const container = contentEl.createDiv({
      cls: 'journalit-legacy-challenge-onboarding__body',
    });
    this.root = createRoot(container);
    this.root.render(
      <LegacyChallengeSetupContent
        app={this.app}
        plugin={this.plugin}
        onClose={() => this.close()}
      />
    );
  }

  onClose(): void {
    this.root?.unmount();
    this.root = null;
    
    
    
    
    if (
      this.plugin.settings.account?.legacyChallengeOnboarding?.status ===
      'pending'
    ) {
      void markLegacyChallengeOnboarding(this.plugin, 'skipped');
    }
  }
}

export async function openLegacyChallengeOnboardingModal(
  app: App,
  plugin: JournalitPlugin
): Promise<void> {
  await ensureAccountMergeServices(plugin);
  new LegacyChallengeOnboardingModal(app, plugin).open();
}
