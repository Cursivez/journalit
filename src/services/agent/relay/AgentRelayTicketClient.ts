import type { RequestUrlParam, RequestUrlResponse } from 'obsidian';
import type JournalitPlugin from '../../../main';
import { isCanonicalNonNilUuid } from '../../../utils/uuid';
import { ApiClient } from '../../backend/ApiClient';
import { clearPersistedBackendAuthSession } from '../../backend/BackendAuthFailure';
import { BackendHttpClient } from '../../backend/BackendHttpClient';
import { BackendSecretStorage } from '../../backend/BackendSecretStorage';
import { isCanonicalBase64Url32 } from '../base64Url';

const RELAY_TICKET_PATH = '/api/v1/agent/relay-ticket';
const MAX_REQUEST_BYTES = 1024;
const MAX_RESPONSE_BYTES = 4096;
const INVALID_RESPONSE_MESSAGE = 'Agent relay ticket response was invalid.';
const CONNECTION_FAILED_MESSAGE = 'Agent relay ticket connection failed.';
const JSON_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

type AgentRelayTicketErrorCode =
  | 'account_unavailable'
  | 'agent_installation_inactive'
  | 'authentication_required'
  | 'invalid_request'
  | 'protocol_error'
  | 'rate_limit_exceeded'
  | 'relay_ticket_temporarily_unavailable'
  | 'transport_error'
  | 'unauthorized';

export interface AgentRelayTicket {
  ticket: string;
  expiresAt: string;
}

interface ClientDependencies {
  request: (request: RequestUrlParam) => Promise<RequestUrlResponse>;
  tokenReader: (plugin: JournalitPlugin) => string | null;
  authenticationFailure: (
    plugin: JournalitPlugin,
    requestToken: string
  ) => void | Promise<void>;
  authenticationRefresh: (
    requestToken: string
  ) => Promise<'refreshed' | 'rejected' | 'unavailable'>;
  now: () => number;
}

interface KnownErrorDefinition {
  code: AgentRelayTicketErrorCode;
  status: number;
  message: string;
  retryable: boolean;
  requiresRetryAfter?: boolean;
}

const KNOWN_ERRORS: Readonly<Record<string, KnownErrorDefinition>> = {
  invalid_request: {
    code: 'invalid_request',
    status: 400,
    message: 'Invalid request.',
    retryable: false,
  },
  account_unavailable: {
    code: 'account_unavailable',
    status: 401,
    message: 'This account is unavailable.',
    retryable: false,
  },
  agent_installation_inactive: {
    code: 'agent_installation_inactive',
    status: 409,
    message: 'This Agent installation is not active.',
    retryable: false,
  },
  rate_limit_exceeded: {
    code: 'rate_limit_exceeded',
    status: 429,
    message: 'Rate limit exceeded.',
    retryable: true,
    requiresRetryAfter: true,
  },
  relay_ticket_temporarily_unavailable: {
    code: 'relay_ticket_temporarily_unavailable',
    status: 503,
    message: 'Relay ticket is temporarily unavailable.',
    retryable: true,
  },
};

export class AgentRelayTicketClientError extends Error {
  public readonly code: AgentRelayTicketErrorCode;
  public readonly status?: number;
  public readonly retryable: boolean;
  public readonly retryAfterSeconds?: number;

  constructor(options: {
    code: AgentRelayTicketErrorCode;
    message: string;
    status?: number;
    retryable: boolean;
    retryAfterSeconds?: number;
  }) {
    super(options.message);
    this.name = 'AgentRelayTicketClientError';
    this.code = options.code;
    this.status = options.status;
    this.retryable = options.retryable;
    this.retryAfterSeconds = options.retryAfterSeconds;
  }
}

function protocolError(status?: number): AgentRelayTicketClientError {
  return new AgentRelayTicketClientError({
    code: 'protocol_error',
    message: INVALID_RESPONSE_MESSAGE,
    status,
    retryable: false,
  });
}

function transportError(): AgentRelayTicketClientError {
  return new AgentRelayTicketClientError({
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
    if (name.toLowerCase() === normalizedName) {
      return value;
    }
  }
  return undefined;
}

function parseResponseObject(
  response: RequestUrlResponse
): Record<string, unknown> {
  if (headerValue(response.headers, 'content-type') !== 'application/json') {
    throw protocolError(response.status);
  }
  if (
    response.text.length === 0 ||
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
  if (!isRecord(value)) {
    throw protocolError(response.status);
  }
  return value;
}

function isLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

function isValidRfc3339(value: unknown): value is string {
  if (typeof value !== 'string' || value.length > 64) {
    return false;
  }
  const match =
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d{1,9})?(Z|[+-]\d{2}:\d{2})$/.exec(
      value
    );
  if (!match) {
    return false;
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hour = Number(match[4]);
  const minute = Number(match[5]);
  const second = Number(match[6]);
  const offset = match[7];
  const monthDays = [
    31,
    isLeapYear(year) ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];
  if (
    year === 0 ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > monthDays[month - 1] ||
    hour > 23 ||
    minute > 59 ||
    second > 59
  ) {
    return false;
  }
  if (offset !== 'Z') {
    const offsetHour = Number(offset.slice(1, 3));
    const offsetMinute = Number(offset.slice(4, 6));
    if (offsetHour > 23 || offsetMinute > 59) {
      return false;
    }
  }
  return Number.isFinite(Date.parse(value));
}

function parseRetryAfter(response: RequestUrlResponse): number | undefined {
  const value = headerValue(response.headers, 'retry-after');
  if (!value || !/^[1-9]\d*$/.test(value)) {
    return undefined;
  }
  const seconds = Number(value);
  return Number.isSafeInteger(seconds) && seconds <= 3600 ? seconds : undefined;
}

function decodeSuccess(
  response: RequestUrlResponse,
  now: number
): AgentRelayTicket {
  if (headerValue(response.headers, 'cache-control') !== 'no-store') {
    throw protocolError(response.status);
  }
  const value = parseResponseObject(response);
  if (
    !hasExactKeys(value, ['ticket', 'expiresAt']) ||
    !isCanonicalBase64Url32(value.ticket) ||
    !isValidRfc3339(value.expiresAt) ||
    Date.parse(value.expiresAt) <= now
  ) {
    throw protocolError(response.status);
  }
  return { ticket: value.ticket, expiresAt: value.expiresAt };
}


const GATEWAY_STATUSES: ReadonlySet<number> = new Set([502, 503, 504]);

function decodeKnownError(
  response: RequestUrlResponse
): AgentRelayTicketClientError {
  let value: Record<string, unknown>;
  try {
    value = parseResponseObject(response);
  } catch (error) {
    
    
    
    if (GATEWAY_STATUSES.has(response.status)) throw transportError();
    throw error;
  }
  if (
    !hasExactKeys(value, ['error', 'message']) ||
    typeof value.error !== 'string' ||
    typeof value.message !== 'string' ||
    !Object.prototype.hasOwnProperty.call(KNOWN_ERRORS, value.error)
  ) {
    if (GATEWAY_STATUSES.has(response.status)) throw transportError();
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
  return new AgentRelayTicketClientError({
    code: definition.code,
    message: definition.message,
    status: definition.status,
    retryable: definition.retryable,
    retryAfterSeconds,
  });
}

function decodeUnauthorized(
  response: RequestUrlResponse
): AgentRelayTicketClientError {
  try {
    const error = decodeKnownError(response);
    if (error.code === 'account_unavailable') {
      return error;
    }
  } catch {
    // intentional
  }
  return new AgentRelayTicketClientError({
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
        operation: 'Agent Relay Ticket',
        statusCode: 401,
      });
    }
    await clearPersistedBackendAuthSession(plugin, requestToken);
  } catch {
    // intentional
  }
}

export class AgentRelayTicketClient {
  private readonly dependencies: ClientDependencies;

  constructor(
    private readonly plugin: JournalitPlugin,
    dependencies: Partial<ClientDependencies> = {}
  ) {
    this.dependencies = {
      request:
        dependencies.request ??
        ((request) => BackendHttpClient.request(request)),
      tokenReader:
        dependencies.tokenReader ??
        ((targetPlugin) => BackendSecretStorage.getAuthToken(targetPlugin)),
      authenticationFailure:
        dependencies.authenticationFailure ?? defaultAuthenticationFailure,
      authenticationRefresh:
        dependencies.authenticationRefresh ??
        ((token) => ApiClient.refreshAuthentication(token)),
      now: dependencies.now ?? Date.now,
    };
  }

  public async issue(installationId: string): Promise<AgentRelayTicket> {
    let requestToken: string | null;
    try {
      requestToken = this.dependencies.tokenReader(this.plugin);
    } catch {
      requestToken = null;
    }
    if (!requestToken) {
      throw new AgentRelayTicketClientError({
        code: 'authentication_required',
        message: 'Authentication is required.',
        retryable: false,
      });
    }
    if (!isCanonicalNonNilUuid(installationId)) {
      throw new AgentRelayTicketClientError({
        code: 'invalid_request',
        message: 'Invalid request.',
        retryable: false,
      });
    }

    const response = await this.post(
      { installationId },
      {
        ...JSON_HEADERS,
        Authorization: `Bearer ${requestToken}`,
      }
    );
    if (response.status !== 401) return this.decodeResponse(response);

    let refreshOutcome: 'refreshed' | 'rejected' | 'unavailable';
    try {
      refreshOutcome =
        await this.dependencies.authenticationRefresh(requestToken);
    } catch {
      refreshOutcome = 'unavailable';
    }
    if (refreshOutcome === 'unavailable') {
      throw this.authenticationRefreshUnavailable();
    }
    if (refreshOutcome === 'rejected') {
      await this.clearAuthenticationIfCurrent(requestToken);
      throw decodeUnauthorized(response);
    }

    let replayToken: string | null;
    try {
      replayToken = this.dependencies.tokenReader(this.plugin);
    } catch {
      replayToken = null;
    }
    if (!replayToken || replayToken === requestToken) {
      throw this.authenticationRefreshUnavailable();
    }

    const replayResponse = await this.post(
      { installationId },
      {
        ...JSON_HEADERS,
        Authorization: `Bearer ${replayToken}`,
      }
    );
    if (replayResponse.status === 401) {
      const error = decodeUnauthorized(replayResponse);
      if (error.code !== 'account_unavailable') {
        await this.clearAuthenticationIfCurrent(replayToken);
      }
      throw error;
    }
    return this.decodeResponse(replayResponse);
  }

  private decodeResponse(response: RequestUrlResponse): AgentRelayTicket {
    if (response.status === 201) {
      return decodeSuccess(response, this.dependencies.now());
    }
    throw decodeKnownError(response);
  }

  private authenticationRefreshUnavailable(): AgentRelayTicketClientError {
    return new AgentRelayTicketClientError({
      code: 'relay_ticket_temporarily_unavailable',
      message: 'Relay ticket is temporarily unavailable.',
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
    headers: Record<string, string>
  ): Promise<RequestUrlResponse> {
    const body = JSON.stringify(value);
    if (new TextEncoder().encode(body).byteLength > MAX_REQUEST_BYTES) {
      throw protocolError();
    }
    try {
      return await this.dependencies.request({
        url: ApiClient.buildUrl(RELAY_TICKET_PATH),
        method: 'POST',
        headers,
        contentType: 'application/json',
        body,
        throw: false,
      });
    } catch {
      throw transportError();
    }
  }
}
