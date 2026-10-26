import { TFile, type App } from 'obsidian';
import type { ActionInput } from '../../actions/ActionTypes';
import type { Setup } from '../../setup/types';
import { configurationRevision } from '../configuration/configurationPrimitives';
import type { AgentReviewIdentity } from '../reviews/AgentReviewReadService';


export type SetupLinkedNote = NonNullable<
  NonNullable<ActionInput<'setup.create'>['fields']>['linked_notes']
>[number];

type SetupLinkErrorCode = 'not_found' | 'invalid_request';


export class SetupLinkError extends Error {
  constructor(
    readonly code: SetupLinkErrorCode,
    readonly field: string
  ) {
    super('Setup linked note cannot be resolved.');
    this.name = 'SetupLinkError';
  }
}

interface SetupLinkDependencies {
  app: Pick<App, 'metadataCache' | 'vault'>;
  listTradeFiles(): Promise<readonly { file: TFile; tradeId: string }[]>;
  identifyReview(
    file: TFile,
    signal: AbortSignal
  ): Promise<AgentReviewIdentity | null>;
  resolveReview(
    identity: AgentReviewIdentity,
    signal: AbortSignal
  ): Promise<TFile | null>;
  listSetups(): Promise<readonly Setup[]>;
}

function throwIfAborted(signal: AbortSignal): void {
  if (signal.aborted) throw signal.reason;
}


export class SetupLinkCodec {
  constructor(private readonly dependencies: SetupLinkDependencies) {}

  async describe(
    setup: Setup,
    signal: AbortSignal
  ): Promise<SetupLinkedNote[]> {
    if (setup.linkedNotes.length === 0) return [];
    const sourcePath = setup.filePath ?? '';
    const [trades, setups] = await Promise.all([
      this.dependencies.listTradeFiles(),
      this.dependencies.listSetups(),
    ]);
    throwIfAborted(signal);
    const tradeByPath = new Map(
      trades.map((record) => [record.file.path, record.tradeId])
    );
    const setupByPath = new Map(
      setups.flatMap((candidate) =>
        candidate.filePath !== undefined &&
        candidate.agentEntityId !== undefined
          ? [[candidate.filePath, candidate.agentEntityId] as const]
          : []
      )
    );
    
    const described = await Promise.all(
      setup.linkedNotes.map(
        async (linkpath, index): Promise<SetupLinkedNote> => {
          const file = this.dependencies.app.metadataCache.getFirstLinkpathDest(
            linkpath,
            sourcePath
          );
          const key: SetupLinkedNote = { key: `note_${index + 1}` };
          if (!file) return key;
          const tradeId = tradeByPath.get(file.path);
          if (tradeId !== undefined) return { trade_id: tradeId };
          const setupId = setupByPath.get(file.path);
          if (setupId !== undefined) return { setup_id: setupId };
          const review = await this.dependencies.identifyReview(file, signal);
          return review ? { review } : key;
        }
      )
    );
    throwIfAborted(signal);
    return described;
  }

  
  async resolve(
    links: readonly SetupLinkedNote[],
    current: Setup | null,
    sourcePath: string,
    field: string,
    signal: AbortSignal
  ): Promise<string[]> {
    const needsTrades = links.some((link) => 'trade_id' in link);
    const needsSetups = links.some((link) => 'setup_id' in link);
    const noTrades: readonly { file: TFile; tradeId: string }[] = [];
    const noSetups: readonly Setup[] = [];
    const [trades, setups] = await Promise.all([
      needsTrades ? this.dependencies.listTradeFiles() : noTrades,
      needsSetups ? this.dependencies.listSetups() : noSetups,
    ]);
    throwIfAborted(signal);
    const tradeById = new Map(
      trades.map((record) => [record.tradeId, record.file] as const)
    );
    const setupById = new Map(
      setups.flatMap((candidate) =>
        candidate.agentEntityId !== undefined
          ? [[candidate.agentEntityId, candidate] as const]
          : []
      )
    );
    const fileFor = async (
      link: Exclude<SetupLinkedNote, { key: string }>
    ): Promise<TFile | null> => {
      if ('trade_id' in link) return tradeById.get(link.trade_id) ?? null;
      if ('setup_id' in link) {
        const target = setupById.get(link.setup_id);
        if (target?.filePath === undefined) return null;
        const abstract = this.dependencies.app.vault.getAbstractFileByPath(
          target.filePath
        );
        return abstract instanceof TFile ? abstract : null;
      }
      return this.dependencies.resolveReview(link.review, signal);
    };
    
    const resolved = await Promise.all(
      links.map(async (link): Promise<string> => {
        if ('key' in link) {
          const position = Number(link.key.slice('note_'.length));
          const linkpath = current?.linkedNotes[position - 1];
          if (linkpath === undefined)
            throw new SetupLinkError('not_found', field);
          return linkpath;
        }
        const file = await fileFor(link);
        if (!file) throw new SetupLinkError('not_found', field);
        return this.dependencies.app.metadataCache.fileToLinktext(
          file,
          sourcePath,
          true
        );
      })
    );
    throwIfAborted(signal);
    return resolved;
  }
}


function revisionContent(setup: Setup) {
  return {
    name: setup.name,
    status: setup.status,
    direction: setup.direction ?? null,
    color: setup.color ?? null,
    tags: setup.tags,
    preferred_sessions: setup.preferredSessions,
    preferred_timeframes: setup.preferredTimeframes,
    preferred_tickers: setup.preferredTickers,
    playbook: setup.playbookMarkdown,
    rule_groups: setup.ruleGroups.map((group) => [group.name, group.order]),
    rules: setup.rules.map((rule) => [
      rule.label,
      rule.description ?? null,
      rule.category,
      rule.required,
      rule.groupId ?? null,
      rule.order,
    ]),
    linked_notes: setup.linkedNotes,
  };
}


export function setupRevision(setup: Setup): Promise<string> {
  return configurationRevision(revisionContent(setup));
}
