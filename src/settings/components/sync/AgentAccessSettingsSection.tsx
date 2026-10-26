import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import type JournalitPlugin from '../../../main';
import { getCurrentLanguage, t } from '../../../lang/helpers';
import type {
  AgentAccessSessionService,
  AgentAccessSessionSnapshot,
  ReplaceableAgentVault,
} from '../../../services/agent/registration';
import type {
  AgentRelaySessionService,
  AgentRelaySessionSnapshot,
} from '../../../services/agent/relay';
import {
  fetchMcpUsage,
  type McpUsage,
} from '../../../services/agent/registration/mcpUsage';
import { ApiClient } from '../../../services/backend/ApiClient';
import { resolveUpgradeUrl } from '../../../services/upgrade/upgradeOrigin';
import { openExternalUrl } from '../../../utils/externalLinks';
import { writeClipboardText } from '../../../utils/clipboard';
import { cssVars } from '../../../styles/inlineStylePolicy';
import { Button } from '../../../components/ui/Button';
import { showConfirmationModal } from '../../../components/shared/ConfirmationModal';
import ToggleSwitch from '../../../components/ui/ToggleSwitch';
import {
  SegmentedControl,
  type SegmentOption,
} from '../../../components/shared/SegmentedControl';

interface AgentAccessSettingsSectionProps {
  plugin: JournalitPlugin;
}


const MCP_CONNECTIONS_URL = 'https://journalit.co/dashboard/ai-connections';
const TOGGLE_ID = 'journalit-mcp-access-toggle';
const FULL_ACCESS_ID = 'journalit-mcp-access-full-access';
const TITLE_ID = 'journalit-mcp-access-title';
const CONNECT_TITLE_ID = 'journalit-mcp-access-connect-title';
const COPY_FEEDBACK_MS = 2000;
const LOADING_SNAPSHOT: AgentAccessSessionSnapshot = Object.freeze({
  status: 'disabled',
});

const RELAY_LOADING_SNAPSHOT: AgentRelaySessionSnapshot = Object.freeze({
  status: 'stopped',
});



function openUpgrade(): void {
  openExternalUrl(resolveUpgradeUrl('mcpAccess'));
}

function isConnectionLost(snapshot: AgentRelaySessionSnapshot): boolean {
  return (
    snapshot.status === 'blocked' &&
    (snapshot.reason === 'installation_inactive' ||
      snapshot.reason === 'installation_revoked')
  );
}

type FailedReason = Extract<
  AgentAccessSessionSnapshot,
  { status: 'failed' }
>['reason'];

const DAY_MS = 24 * 60 * 60 * 1000;
const RECENT_DAYS = 30;

function startOfLocalDay(time: number): number {
  const date = new Date(time);
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  ).getTime();
}

const relativeDayFormatters = new Map<string, Intl.RelativeTimeFormat>();
const mediumDateFormatters = new Map<string, Intl.DateTimeFormat>();

function relativeDayFormatter(language: string): Intl.RelativeTimeFormat {
  let formatter = relativeDayFormatters.get(language);
  if (!formatter) {
    formatter = new Intl.RelativeTimeFormat(language, { numeric: 'auto' });
    relativeDayFormatters.set(language, formatter);
  }
  return formatter;
}

function mediumDateFormatter(language: string): Intl.DateTimeFormat {
  let formatter = mediumDateFormatters.get(language);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(language, { dateStyle: 'medium' });
    mediumDateFormatters.set(language, formatter);
  }
  return formatter;
}


function lastUsedLabel(lastSeenAt: string): string {
  const language = getCurrentLanguage();
  const seen = Date.parse(lastSeenAt);
  const days = Math.max(
    0,
    Math.round((startOfLocalDay(Date.now()) - startOfLocalDay(seen)) / DAY_MS)
  );
  return days < RECENT_DAYS
    ? relativeDayFormatter(language).format(-days, 'day')
    : mediumDateFormatter(language).format(seen);
}


function vaultLimitMoveDetail(vault: ReplaceableAgentVault): string {
  return vault.lastSeenAt === null
    ? t('settings.mcp-access.failed.vault-limit-move-never-used', {
        vault: vault.displayName,
      })
    : t('settings.mcp-access.failed.vault-limit-move', {
        vault: vault.displayName,
        lastUsed: lastUsedLabel(vault.lastSeenAt),
      });
}

function failedDetail(reason: FailedReason): string {
  switch (reason) {
    case 'authentication_required':
    case 'unauthorized':
      return t('settings.mcp-access.failed.sign-in-required');
    case 'account_unavailable':
      return t('settings.mcp-access.failed.account-unavailable');
    case 'agent_vault_limit_reached':
      return t('settings.mcp-access.failed.vault-limit-reached');
    case 'registration_temporarily_unavailable':
      return t('settings.mcp-access.failed.temporarily-unavailable');
    case 'identity_unavailable':
      return t('settings.mcp-access.failed.vault-identity');
    case 'invalid_registration_request':
      return t('settings.mcp-access.failed.request-rejected');
    case 'protocol_error':
      return t('settings.mcp-access.failed.unexpected-response');
    case 'rate_limit_exceeded':
      return t('settings.mcp-access.failed.rate-limited');
    case 'settings_unavailable':
      return t('settings.mcp-access.failed.settings-unavailable');
    case 'transport_error':
      return t('settings.mcp-access.failed.connection');
    default: {
      const exhaustiveReason: never = reason;
      return exhaustiveReason;
    }
  }
}

function statusLabel(snapshot: AgentAccessSessionSnapshot): string {
  switch (snapshot.status) {
    case 'disabled':
      return t('settings.mcp-access.status.off');
    case 'registering':
      return t('settings.mcp-access.status.connecting');
    case 'ready':
      return t('settings.mcp-access.status.connected');
    case 'failed':
      return t('settings.mcp-access.status.failed');
    default: {
      const exhaustiveSnapshot: never = snapshot;
      return exhaustiveSnapshot;
    }
  }
}

function statusDetail(snapshot: AgentAccessSessionSnapshot): string {
  switch (snapshot.status) {
    case 'disabled':
      return t('settings.mcp-access.status.off-detail');
    case 'registering':
      return t('settings.mcp-access.status.connecting-detail');
    case 'ready':
      return t('settings.mcp-access.status.connected-detail');
    case 'failed':
      return failedDetail(snapshot.reason);
    default: {
      const exhaustiveSnapshot: never = snapshot;
      return exhaustiveSnapshot;
    }
  }
}


const SettingRow: React.FC<{
  name: React.ReactNode;
  description: React.ReactNode;
  children?: React.ReactNode;
}> = ({ name, description, children }) => (
  <div className="setting-item">
    <div className="setting-item-info">
      <div className="setting-item-name">{name}</div>
      <div className="setting-item-description">{description}</div>
    </div>
    {children && <div className="setting-item-control">{children}</div>}
  </div>
);

type UsageState =
  | { readonly status: 'loading' }
  | { readonly status: 'unavailable' }
  | { readonly status: 'ready'; readonly usage: McpUsage };

interface UsageFormatters {
  readonly count: Intl.NumberFormat;
  readonly date: Intl.DateTimeFormat;
}

const usageFormatters = new Map<string, UsageFormatters>();


function usageFormattersFor(language: string): UsageFormatters {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const key = `${language}|${timeZone}`;
  const cached = usageFormatters.get(key);
  if (cached) return cached;
  const formatters: UsageFormatters = {
    count: new Intl.NumberFormat(language),
    
    
    
    
    date: new Intl.DateTimeFormat(language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
      timeZone,
    }),
  };
  usageFormatters.set(key, formatters);
  return formatters;
}

function usageDescription(usage: McpUsage): string {
  const { count, date: dateFormat } = usageFormattersFor(getCurrentLanguage());
  const date = dateFormat.format(usage.resetAt);
  if (usage.limit === 0) {
    return t('settings.mcp-access.usage.unlimited', {
      consumed: count.format(usage.consumed),
      date,
    });
  }
  if (usage.enforcement && usage.consumed >= usage.limit) {
    return t('settings.mcp-access.usage.reached', {
      limit: count.format(usage.limit),
      date,
    });
  }
  return t('settings.mcp-access.usage.limited', {
    consumed: count.format(usage.consumed),
    limit: count.format(usage.limit),
    date,
  });
}


const UsageRow: React.FC = () => {
  const [state, setState] = useState<UsageState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    void fetchMcpUsage().then((usage) => {
      if (!active) return;
      setState(usage ? { status: 'ready', usage } : { status: 'unavailable' });
    });
    return () => {
      active = false;
    };
  }, [attempt]);

  const retry = () => {
    setState({ status: 'loading' });
    setAttempt((value) => value + 1);
  };

  if (state.status !== 'ready') {
    return (
      <SettingRow
        name={t('settings.mcp-access.usage.label')}
        description={
          state.status === 'loading'
            ? t('settings.mcp-access.usage.loading')
            : t('settings.mcp-access.usage.unavailable')
        }
      >
        {state.status === 'unavailable' && (
          <Button variant="secondary" onClick={retry}>
            {t('settings.mcp-access.action.retry')}
          </Button>
        )}
      </SettingRow>
    );
  }

  const { usage } = state;
  const reached = usage.enforcement && usage.consumed >= usage.limit;
  const share =
    usage.limit > 0 ? Math.min(100, (usage.consumed / usage.limit) * 100) : 0;
  const isFree = usage.entitlementClass === 'free';
  return (
    <SettingRow
      name={t('settings.mcp-access.usage.label')}
      description={
        <>
          <span
            className={`journalit-mcp-access__usage${reached ? ' is-reached' : ''}`}
          >
            {usageDescription(usage)}
          </span>
          {usage.limit > 0 && (
            <span
              className={`journalit-mcp-access__meter${reached ? ' is-reached' : ''}`}
              role="presentation"
            >
              <span
                className="journalit-mcp-access__meter-fill"
                style={cssVars({ '--journalit-mcp-usage': `${share}%` })}
              />
            </span>
          )}
          <span className="journalit-mcp-access__allowance">
            {t('settings.mcp-access.usage.not-counted')}
          </span>
          {isFree && (
            <button
              type="button"
              className="journalit-mcp-access__link journalit-mcp-access__pro-offer"
              onClick={openUpgrade}
            >
              {t('settings.mcp-access.usage.pro-offer')}
            </button>
          )}
        </>
      }
    >
      {isFree && reached && (
        <Button variant="primary" onClick={openUpgrade}>
          {t('settings.mcp-access.usage.upgrade')}
        </Button>
      )}
    </SettingRow>
  );
};

type CopyState = 'idle' | 'copied' | 'failed';


const CopyButton: React.FC<{ text: string; label: string }> = ({
  text,
  label,
}) => {
  const [state, setState] = useState<CopyState>('idle');
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    },
    []
  );

  const copy = () => {
    void writeClipboardText(text).then(
      () => setState('copied'),
      () => setState('failed')
    );
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState('idle'), COPY_FEEDBACK_MS);
  };

  return (
    <Button variant="secondary" onClick={copy} aria-label={label}>
      <span aria-live="polite">
        {state === 'copied'
          ? t('settings.mcp-access.connect.copied')
          : state === 'failed'
            ? t('settings.mcp-access.connect.copy-failed')
            : t('settings.mcp-access.connect.copy')}
      </span>
    </Button>
  );
};


const CopyField: React.FC<{ value: string; label: string }> = ({
  value,
  label,
}) => (
  <div className="journalit-mcp-access__copy-field">
    <code className="journalit-mcp-access__copy-value">{value}</code>
    <CopyButton text={value} label={label} />
  </div>
);


const AI_APPS = ['claude', 'chatgpt', 'claudeCode'] as const;
type AiApp = (typeof AI_APPS)[number];


const AI_APP_NAMES: Record<AiApp, string> = {
  claude: 'Claude',
  chatgpt: 'ChatGPT',
  claudeCode: 'Claude Code',
};
const AI_APP_OPTIONS: SegmentOption<AiApp>[] = AI_APPS.map((value) => ({
  value,
  label: AI_APP_NAMES[value],
}));


function mcpServerUrl(): string {
  return ApiClient.buildUrl('/mcp');
}


const ConnectAiApp: React.FC = () => {
  const [app, setApp] = useState<AiApp>('claude');
  const url = mcpServerUrl();
  const approve = t('settings.mcp-access.connect.step.approve');

  return (
    <div
      className="journalit-mcp-access__connect"
      role="group"
      aria-labelledby={CONNECT_TITLE_ID}
    >
      <div
        className="journalit-mcp-access__connect-title"
        id={CONNECT_TITLE_ID}
      >
        {t('settings.mcp-access.connect.title')}
      </div>
      <div className="journalit-mcp-access__connect-label">
        {t('settings.mcp-access.connect.url-label')}
      </div>
      <CopyField
        value={url}
        label={t('settings.mcp-access.connect.copy-url')}
      />
      <SegmentedControl<AiApp>
        options={AI_APP_OPTIONS}
        value={app}
        onChange={setApp}
        size="small"
        groupRole="radiogroup"
        ariaLabel={t('settings.mcp-access.connect.app-label')}
        className="journalit-mcp-access__apps"
      />
      {app === 'claude' && (
        <ol className="journalit-mcp-access__steps">
          <li>{t('settings.mcp-access.connect.claude.open')}</li>
          <li>{t('settings.mcp-access.connect.claude.add')}</li>
          <li>{approve}</li>
        </ol>
      )}
      {app === 'chatgpt' && (
        <ol className="journalit-mcp-access__steps">
          <li>{t('settings.mcp-access.connect.chatgpt.open')}</li>
          <li>{t('settings.mcp-access.connect.chatgpt.add')}</li>
          <li>{approve}</li>
        </ol>
      )}
      {app === 'claudeCode' && (
        <ol className="journalit-mcp-access__steps">
          <li>
            {t('settings.mcp-access.connect.claude-code.run')}
            <CopyField
              value={`claude mcp add --transport http journalit ${url}`}
              label={t('settings.mcp-access.connect.copy-command')}
            />
          </li>
          <li>{t('settings.mcp-access.connect.claude-code.sign-in')}</li>
        </ol>
      )}
      <p className="journalit-mcp-access__connect-note">
        {t('settings.mcp-access.connect.sign-in-note')}{' '}
        <button
          type="button"
          className="journalit-mcp-access__link"
          onClick={() => openExternalUrl(MCP_CONNECTIONS_URL)}
        >
          {t('settings.mcp-access.connect.manage')}
        </button>
      </p>
    </div>
  );
};

function isAgentAccessEnabled(snapshot: AgentAccessSessionSnapshot): boolean {
  return snapshot.status === 'failed'
    ? snapshot.enabled
    : snapshot.status !== 'disabled';
}


function replaceableVaultOf(
  snapshot: AgentAccessSessionSnapshot
): ReplaceableAgentVault | null {
  return snapshot.status === 'failed' &&
    snapshot.enabled &&
    snapshot.reason === 'agent_vault_limit_reached'
    ? (snapshot.replaceableVault ?? null)
    : null;
}

const AgentAccessStatusRow: React.FC<{
  snapshot: AgentAccessSessionSnapshot;
  connectionLost: boolean;
  isActionPending: boolean;
  onRetry: () => void;
  onReconnect: () => void;
  onMove: (vault: ReplaceableAgentVault) => void;
}> = ({
  snapshot,
  connectionLost,
  isActionPending,
  onRetry,
  onReconnect,
  onMove,
}) => {
  const canRetry =
    snapshot.status === 'failed' && snapshot.enabled && snapshot.retryable;
  const replaceableVault = replaceableVaultOf(snapshot);
  const statusClass = connectionLost ? 'failed' : snapshot.status;
  return (
    <div aria-live="polite">
      <SettingRow
        name={t('settings.mcp-access.status.label')}
        description={
          connectionLost
            ? t('settings.mcp-access.status.lost-detail')
            : replaceableVault
              ? vaultLimitMoveDetail(replaceableVault)
              : statusDetail(snapshot)
        }
      >
        {replaceableVault && (
          <Button
            variant="primary"
            onClick={() => onMove(replaceableVault)}
            disabled={isActionPending}
          >
            {t('settings.mcp-access.action.move-here')}
          </Button>
        )}
        {connectionLost && (
          <Button
            variant="secondary"
            onClick={onReconnect}
            disabled={isActionPending}
          >
            {t('settings.mcp-access.action.reconnect')}
          </Button>
        )}
        {canRetry && (
          <Button
            variant="secondary"
            onClick={onRetry}
            disabled={isActionPending}
          >
            {t('settings.mcp-access.action.retry')}
          </Button>
        )}
        <span className={`journalit-mcp-access__status is-${statusClass}`}>
          {connectionLost
            ? t('settings.mcp-access.status.failed')
            : statusLabel(snapshot)}
        </span>
      </SettingRow>
    </div>
  );
};

export const AgentAccessSettingsSection: React.FC<
  AgentAccessSettingsSectionProps
> = ({ plugin }) => {
  const [session, setSession] = useState<AgentAccessSessionService | null>(
    null
  );
  const [relay, setRelay] = useState<AgentRelaySessionService | null>(null);
  const [isUnavailable, setIsUnavailable] = useState(false);
  const [isActionPending, setIsActionPending] = useState(false);

  useEffect(() => {
    let active = true;
    void plugin.serviceManager.getAgentAccessSessionService().then(
      (service) => {
        if (active) setSession(service);
      },
      () => {
        if (active) setIsUnavailable(true);
      }
    );
    void plugin.serviceManager.getAgentRelaySessionService().then(
      (service) => {
        if (active) setRelay(service);
      },
      
      
      () => undefined
    );
    return () => {
      active = false;
    };
  }, [plugin]);

  const subscribe = useCallback(
    (onStoreChange: () => void) =>
      session ? session.subscribe(onStoreChange) : () => undefined,
    [session]
  );
  const getSnapshot = useCallback(
    () => (session ? session.getSnapshot() : LOADING_SNAPSHOT),
    [session]
  );
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const subscribeRelay = useCallback(
    (onStoreChange: () => void) =>
      relay ? relay.subscribe(onStoreChange) : () => undefined,
    [relay]
  );
  const getRelaySnapshot = useCallback(
    () => (relay ? relay.getSnapshot() : RELAY_LOADING_SNAPSHOT),
    [relay]
  );
  const relaySnapshot = useSyncExternalStore(
    subscribeRelay,
    getRelaySnapshot,
    getRelaySnapshot
  );

  const runAction = useCallback(async (action: () => Promise<void>) => {
    setIsActionPending(true);
    try {
      await action();
    } finally {
      setIsActionPending(false);
    }
  }, []);

  const handleToggle = useCallback(
    (checked: boolean) => {
      if (session) void runAction(() => session.setEnabled(checked));
    },
    [runAction, session]
  );

  const handleFullAccess = useCallback(
    (checked: boolean) => {
      if (session) void runAction(() => session.setFullAccess(checked));
    },
    [runAction, session]
  );

  const handleRetry = useCallback(() => {
    if (session) void runAction(() => session.retryRegistration());
  }, [runAction, session]);

  const handleReconnect = useCallback(() => {
    if (session) void runAction(() => session.reconnect());
  }, [runAction, session]);

  const handleMove = useCallback(
    (vault: ReplaceableAgentVault) => {
      if (!session) return;
      void runAction(async () => {
        const confirmed = await showConfirmationModal(plugin.app, {
          title: t('settings.mcp-access.move.confirm-title'),
          message: t('settings.mcp-access.move.confirm-message', {
            vault: vault.displayName,
          }),
          confirmLabel: t('settings.mcp-access.move.confirm'),
          cancelLabel: t('button.cancel'),
        });
        if (confirmed) await session.moveAccessToThisVault(vault.vaultId);
      });
    },
    [plugin, runAction, session]
  );

  const header = (
    <>
      <h4 id={TITLE_ID}>{t('settings.mcp-access.title')}</h4>
      <p className="setting-item-description journalit-mcp-access__intro">
        {t('settings.mcp-access.description')}
      </p>
    </>
  );

  if (!session) {
    return (
      <section
        className="journalit-settings-section journalit-mcp-access"
        aria-labelledby={TITLE_ID}
      >
        {header}
        <p
          className="setting-item-description journalit-mcp-access__intro"
          aria-live="polite"
        >
          {isUnavailable
            ? t('settings.mcp-access.unavailable')
            : t('settings.mcp-access.loading')}
        </p>
      </section>
    );
  }

  const isEnabled = isAgentAccessEnabled(snapshot);
  const fullAccess = session.getFullAccess();
  const connectionLost =
    snapshot.status === 'ready' && isConnectionLost(relaySnapshot);
  const canConnectApps =
    snapshot.status === 'registering' ||
    (snapshot.status === 'ready' && !connectionLost);

  return (
    <section
      className="journalit-settings-section journalit-mcp-access"
      aria-labelledby={TITLE_ID}
    >
      {header}
      <SettingRow
        name={
          <label htmlFor={TOGGLE_ID}>
            {t('settings.mcp-access.toggle.label')}
          </label>
        }
        description={t('settings.mcp-access.toggle.description')}
      >
        <ToggleSwitch
          id={TOGGLE_ID}
          checked={isEnabled}
          onChange={handleToggle}
          disabled={isActionPending}
          ariaLabel={t('settings.mcp-access.toggle.label')}
        />
      </SettingRow>
      <AgentAccessStatusRow
        snapshot={snapshot}
        connectionLost={connectionLost}
        isActionPending={isActionPending}
        onRetry={handleRetry}
        onReconnect={handleReconnect}
        onMove={handleMove}
      />
      {canConnectApps && <ConnectAiApp />}
      {isEnabled && (
        <SettingRow
          name={
            <label htmlFor={FULL_ACCESS_ID}>
              {t('settings.mcp-access.full-access.label')}
            </label>
          }
          description={
            <>
              {t('settings.mcp-access.full-access.description')}
              <span
                className={`journalit-mcp-access__warning${
                  fullAccess ? ' is-active' : ''
                }`}
              >
                {t('settings.mcp-access.full-access.warning')}
              </span>
            </>
          }
        >
          <ToggleSwitch
            id={FULL_ACCESS_ID}
            checked={fullAccess}
            onChange={handleFullAccess}
            disabled={isActionPending}
            ariaLabel={t('settings.mcp-access.full-access.label')}
          />
        </SettingRow>
      )}
      {snapshot.status === 'ready' && !connectionLost && <UsageRow />}
      {isEnabled && (
        <SettingRow
          name={t('agent-activity.title')}
          description={t('settings.mcp-access.activity.description')}
        >
          <Button
            variant="secondary"
            onClick={() => plugin.serviceManager.openAgentActivity()}
          >
            {t('settings.mcp-access.activity.open')}
          </Button>
        </SettingRow>
      )}
    </section>
  );
};

AgentAccessSettingsSection.displayName = 'AgentAccessSettingsSection';
