import type { RequestUrlParam, RequestUrlResponse } from 'obsidian';
import type JournalitPlugin from '../../../main';
import { isCanonicalNonNilUuid } from '../../../utils/uuid';
import { ApiClient } from '../../backend/ApiClient';
import { clearPersistedBackendAuthSession } from '../../backend/BackendAuthFailure';
import { BackendHttpClient } from '../../backend/BackendHttpClient';
import { BackendSecretStorage } from '../../backend/BackendSecretStorage';
import { AgentInstallationIdentityService } from './AgentInstallationIdentityService';

const REGISTRATION_PATH = '/api/v1/agent/installations/register';
const MAX_REQUEST_BYTES = 4096;
const MAX_RESPONSE_BYTES = 16 * 1024;
const INVALID_RESPONSE_MESSAGE = 'Agent registration response was invalid.';
const CONNECTION_FAILED_MESSAGE = 'Agent registration connection failed.';
const JSON_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

export type AgentInstallationRegistrationErrorCode =
  | 'account_unavailable'
  | 'agent_vault_limit_reached'
  | 'authentication_required'
  | 'identity_unavailable'
  | 'invalid_registration_request'
  | 'protocol_error'
  | 'rate_limit_exceeded'
  | 'registration_temporarily_unavailable'
  | 'transport_error'
  | 'unauthorized';


export interface ReplaceableAgentVault {
  readonly vaultId: string;
  readonly displayName: string;
  
  readonly lastSeenAt: string | null;
}

interface AgentInstallationRegistrationOptions {
  
  replaceVaultId?: string;
}

interface AgentInstallationRegistrationResult {
  status: 'registered';
  vaultKey: string;
  deviceId: string;
  vaultId: string;
  installationId: string;
}

interface ClientDependencies {
  request(request: RequestUrlParam): Promise<RequestUrlResponse>;
  identityService: Pick<
    AgentInstallationIdentityService,
    'getRegistrationIdentity'
  >;
  tokenReader(plugin: JournalitPlugin): string | null;
  authenticationFailure(
    plugin: JournalitPlugin,
    requestToken: string
  ): void | Promise<void>;
  authenticationRefresh(
    requestToken: string
  ): Promise<'refreshed' | 'rejected' | 'unavailable'>;
}

interface KnownErrorDefinition {
  code: AgentInstallationRegistrationErrorCode;
  status: number;
  message: string;
  retryable: boolean;
  requiresRetryAfter?: boolean;
}

const VAULT_LIMIT_ERROR = 'agent_vault_limit_reached';
const REPLACEABLE_VAULT_KEY = 'replaceableVault';
const RFC3339_PATTERN =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(?:Z|[+-](\d{2}):(\d{2}))$/;


function isRfc3339Timestamp(value: string): boolean {
  const match = RFC3339_PATTERN.exec(value);
  if (!match) return false;
  const [year, month, day, hour, minute, second] = match
    .slice(1, 7)
    .map(Number);
  const offsetHour = match[7] === undefined ? 0 : Number(match[7]);
  const offsetMinute = match[8] === undefined ? 0 : Number(match[8]);
  const calendar = new Date(Date.UTC(year, month - 1, day));
  return (
    calendar.getUTCFullYear() === year &&
    calendar.getUTCMonth() === month - 1 &&
    calendar.getUTCDate() === day &&
    hour <= 23 &&
    minute <= 59 &&
    second <= 59 &&
    offsetHour <= 23 &&
    offsetMinute <= 59
  );
}

const KNOWN_ERRORS: Readonly<Record<string, KnownErrorDefinition>> = {
  invalid_registration_request: {
    code: 'invalid_registration_request',
    status: 400,
    message: 'Invalid registration request.',
    retryable: false,
  },
  account_unavailable: {
    code: 'account_unavailable',
    status: 401,
    message: 'Account unavailable.',
    retryable: false,
  },
  agent_vault_limit_reached: {
    code: 'agent_vault_limit_reached',
    status: 409,
    message: 'Agent vault limit reached.',
    retryable: false,
  },
  rate_limit_exceeded: {
    code: 'rate_limit_exceeded',
    status: 429,
    message: 'Rate limit exceeded.',
    retryable: true,
    requiresRetryAfter: true,
  },
  registration_temporarily_unavailable: {
    code: 'registration_temporarily_unavailable',
    status: 503,
    message: 'Agent registration is temporarily unavailable.',
    retryable: true,
  },
};

export class AgentInstallationRegistrationClientError extends Error {
  public readonly code: AgentInstallationRegistrationErrorCode;
  public readonly status?: number;
  public readonly retryAfterSeconds?: number;
  public readonly retryable: boolean;
  public readonly replaceableVault?: ReplaceableAgentVault;

  constructor(options: {
    code: AgentInstallationRegistrationErrorCode;
    message: string;
    status?: number;
    retryAfterSeconds?: number;
    retryable: boolean;
    replaceableVault?: ReplaceableAgentVault;
  }) {
    super(options.message);
    this.name = 'AgentInstallationRegistrationClientError';
    this.code = options.code;
    this.status = options.status;
    this.retryAfterSeconds = options.retryAfterSeconds;
    this.retryable = options.retryable;
    if (options.replaceableVault) {
      this.replaceableVault = options.replaceableVault;
    }
  }
}

function protocolError(
  status?: number
): AgentInstallationRegistrationClientError {
  return new AgentInstallationRegistrationClientError({
    code: 'protocol_error',
    message: INVALID_RESPONSE_MESSAGE,
    status,
    retryable: false,
  });
}

function transportError(): AgentInstallationRegistrationClientError {
  return new AgentInstallationRegistrationClientError({
    code: 'transport_error',
    message: CONNECTION_FAILED_MESSAGE,
    retryable: true,
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function hasExactKeys(
  value: Record<string, unknown>,
  expectedKeys: readonly string[]
): boolean {
  const keys = Object.keys(value);
  return (
    keys.length === expectedKeys.length &&
    expectedKeys.every((key) =>
      Object.prototype.hasOwnProperty.call(value, key)
    )
  );
}

function headerValue(
  headers: Record<string, string>,
  requestedName: string
): string | undefined {
  const normalizedName = requestedName.toLowerCase();
  for (const [name, value] of Object.entries(headers)) {
    if (name.toLowerCase() === normalizedName) return value;
  }
  return undefined;
}

function parseResponseObject(
  response: RequestUrlResponse
): Record<string, unknown> {
  const contentType = headerValue(response.headers, 'content-type');
  const mediaType = contentType?.split(';', 1)[0].trim().toLowerCase();
  if (mediaType !== 'application/json') throw protocolError(response.status);
  if (
    response.text.trim().length === 0 ||
    new TextEncoder().encode(response.text).byteLength > MAX_RESPONSE_BYTES
  ) {
    throw protocolError(response.status);
  }
  let value: unknown;
  try {
    value = JSON.parse(response.text);
  } catch {
    throw protocolError(response.status);
  }
  if (!isRecord(value)) throw protocolError(response.status);
  return value;
}

function parseRetryAfter(response: RequestUrlResponse): number | undefined {
  const value = headerValue(response.headers, 'retry-after');
  if (!value || !/^[1-9]\d*$/.test(value)) return undefined;
  const seconds = Number(value);
  return Number.isSafeInteger(seconds) && seconds <= 3600 ? seconds : undefined;
}

type BackendRegistrationResult = Omit<
  AgentInstallationRegistrationResult,
  'vaultKey'
>;

function decodeSuccess(
  response: RequestUrlResponse
): BackendRegistrationResult {
  const value = parseResponseObject(response);
  if (
    !hasExactKeys(value, ['status', 'deviceId', 'vaultId', 'installationId']) ||
    value.status !== 'registered' ||
    !isCanonicalNonNilUuid(value.deviceId) ||
    !isCanonicalNonNilUuid(value.vaultId) ||
    !isCanonicalNonNilUuid(value.installationId)
  ) {
    throw protocolError(response.status);
  }
  return {
    status: 'registered',
    deviceId: value.deviceId,
    vaultId: value.vaultId,
    installationId: value.installationId,
  };
}


function parseReplaceableVault(
  value: unknown
): ReplaceableAgentVault | undefined {
  if (
    !isRecord(value) ||
    !hasExactKeys(value, ['vaultId', 'displayName', 'lastSeenAt']) ||
    !isCanonicalNonNilUuid(value.vaultId) ||
    typeof value.displayName !== 'string' ||
    value.displayName.trim().length === 0
  ) {
    return undefined;
  }
  const { lastSeenAt } = value;
  if (
    lastSeenAt !== null &&
    (typeof lastSeenAt !== 'string' || !isRfc3339Timestamp(lastSeenAt))
  ) {
    return undefined;
  }
  return Object.freeze({
    vaultId: value.vaultId,
    displayName: value.displayName.trim(),
    lastSeenAt,
  });
}

function decodeKnownError(
  response: RequestUrlResponse
): AgentInstallationRegistrationClientError {
  const value = parseResponseObject(response);
  const hasReplacementOffer =
    value.error === VAULT_LIMIT_ERROR && REPLACEABLE_VAULT_KEY in value;
  if (
    !hasExactKeys(
      value,
      hasReplacementOffer
        ? ['error', 'message', REPLACEABLE_VAULT_KEY]
        : ['error', 'message']
    ) ||
    typeof value.error !== 'string' ||
    typeof value.message !== 'string' ||
    !Object.prototype.hasOwnProperty.call(KNOWN_ERRORS, value.error)
  ) {
    throw protocolError(response.status);
  }
  const definition = KNOWN_ERRORS[value.error];
  if (
    response.status !== definition.status ||
    value.message !== definition.message
  ) {
    throw protocolError(response.status);
  }
  const retryAfterSeconds = definition.requiresRetryAfter
    ? parseRetryAfter(response)
    : undefined;
  if (definition.requiresRetryAfter && retryAfterSeconds === undefined) {
    throw protocolError(response.status);
  }
  return new AgentInstallationRegistrationClientError({
    code: definition.code,
    message: definition.message,
    status: definition.status,
    retryable: definition.retryable,
    retryAfterSeconds,
    replaceableVault: hasReplacementOffer
      ? parseReplaceableVault(value[REPLACEABLE_VAULT_KEY])
      : undefined,
  });
}

function decodeUnauthorized(
  response: RequestUrlResponse
): AgentInstallationRegistrationClientError {
  try {
    const error = decodeKnownError(response);
    if (error.code === 'account_unavailable') return error;
  } catch {
    // intentional
  }
  return new AgentInstallationRegistrationClientError({
    code: 'unauthorized',
    message: 'Authentication required.',
    status: 401,
    retryable: false,
  });
}

async function defaultAuthenticationFailure(
  plugin: JournalitPlugin,
  requestToken: string
): Promise<void> {
  try {
    if (ApiClient.getAuthToken() === requestToken) {
      ApiClient.handleAuthenticationFailure({
        operation: 'Agent Installation Registration',
        statusCode: 401,
      });
    }
    await clearPersistedBackendAuthSession(plugin, requestToken);
  } catch {
    // intentional
  }
}

export class AgentInstallationRegistrationClient {
  private readonly dependencies: ClientDependencies;

  constructor(
    private readonly plugin: JournalitPlugin,
    dependencies: Partial<ClientDependencies> = {}
  ) {
    this.dependencies = {
      request:
        dependencies.request ??
        ((request) => BackendHttpClient.request(request)),
      identityService:
        dependencies.identityService ??
        new AgentInstallationIdentityService(plugin),
      tokenReader:
        dependencies.tokenReader ??
        ((targetPlugin) => BackendSecretStorage.getAuthToken(targetPlugin)),
      authenticationFailure:
        dependencies.authenticationFailure ?? defaultAuthenticationFailure,
      authenticationRefresh:
        dependencies.authenticationRefresh ??
        ((token) => ApiClient.refreshAuthentication(token)),
    };
  }

  public async register(
    options: AgentInstallationRegistrationOptions = {}
  ): Promise<AgentInstallationRegistrationResult> {
    let requestToken = this.readToken();
    if (!requestToken) {
      throw new AgentInstallationRegistrationClientError({
        code: 'authentication_required',
        message: 'Authentication is required.',
        retryable: false,
      });
    }

    let identity: Awaited<
      ReturnType<AgentInstallationIdentityService['getRegistrationIdentity']>
    >;
    try {
      identity =
        await this.dependencies.identityService.getRegistrationIdentity();
    } catch {
      throw new AgentInstallationRegistrationClientError({
        code: 'identity_unavailable',
        message: 'Agent registration identity is unavailable.',
        retryable: false,
      });
    }

    const body = options.replaceVaultId
      ? { ...identity, replaceVaultId: options.replaceVaultId }
      : identity;
    const response = await this.post(body, requestToken);
    if (response.status !== 401) {
      return { ...this.decodeResponse(response), vaultKey: identity.vaultKey };
    }

    let refreshOutcome: 'refreshed' | 'rejected' | 'unavailable';
    try {
      refreshOutcome =
        await this.dependencies.authenticationRefresh(requestToken);
    } catch {
      refreshOutcome = 'unavailable';
    }
    if (refreshOutcome === 'unavailable') throw this.refreshUnavailable();
    if (refreshOutcome === 'rejected') {
      await this.clearAuthenticationIfCurrent(requestToken);
      throw decodeUnauthorized(response);
    }

    const replayToken = this.readToken();
    if (!replayToken || replayToken === requestToken) {
      throw this.refreshUnavailable();
    }
    requestToken = replayToken;
    const replayResponse = await this.post(body, requestToken);
    if (replayResponse.status === 401) {
      const error = decodeUnauthorized(replayResponse);
      if (error.code !== 'account_unavailable') {
        await this.clearAuthenticationIfCurrent(requestToken);
      }
      throw error;
    }
    return {
      ...this.decodeResponse(replayResponse),
      vaultKey: identity.vaultKey,
    };
  }

  private readToken(): string | null {
    try {
      return this.dependencies.tokenReader(this.plugin);
    } catch {
      return null;
    }
  }

  private decodeResponse(
    response: RequestUrlResponse
  ): BackendRegistrationResult {
    if (response.status === 200) return decodeSuccess(response);
    throw decodeKnownError(response);
  }

  private refreshUnavailable(): AgentInstallationRegistrationClientError {
    return new AgentInstallationRegistrationClientError({
      code: 'registration_temporarily_unavailable',
      message: 'Agent registration is temporarily unavailable.',
      retryable: true,
    });
  }

  private async clearAuthenticationIfCurrent(
    requestToken: string
  ): Promise<void> {
    try {
      if (this.dependencies.tokenReader(this.plugin) === requestToken) {
        await this.dependencies.authenticationFailure(
          this.plugin,
          requestToken
        );
      }
    } catch {
      // intentional
    }
  }

  private async post(
    value: unknown,
    requestToken: string
  ): Promise<RequestUrlResponse> {
    const body = JSON.stringify(value);
    if (new TextEncoder().encode(body).byteLength > MAX_REQUEST_BYTES) {
      throw protocolError();
    }
    try {
      return await this.dependencies.request({
        url: ApiClient.buildUrl(REGISTRATION_PATH),
        method: 'POST',
        headers: {
          ...JSON_HEADERS,
          Authorization: `Bearer ${requestToken}`,
        },
        contentType: 'application/json',
        body,
        throw: false,
      });
    } catch {
      throw transportError();
    }
  }
}
