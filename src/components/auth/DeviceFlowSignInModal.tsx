

import { Modal, App, Notice } from 'obsidian';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { Tooltip } from '../shared/Tooltip';
import { Copy, ExternalLink, CheckCircle2 } from '../shared/icons/ObsidianIcon';
import JournalitPlugin from '../../main';
import {
  DeviceFlowService,
  DeviceCodeResponse,
  DeviceFlowError,
  DeviceFlowErrorContext,
} from '../../services/backend/DeviceFlowService';
import { SupportActions } from '../shared/SupportActions';
import { buildSupportReport } from '../../utils/supportReport';
import { t } from '../../lang/helpers';
import { openExternalUrl } from '../../utils/externalLinks';
import { createDefaultBackendIntegrationSettings } from '../../settings/types';
import { writeClipboardText } from '../../utils/clipboard';

interface DeviceFlowSignInModalProps {
  plugin: JournalitPlugin;
  onSuccess: () => void;
  onCancel: () => void;
}

type FlowStatus =
  | 'initializing'
  | 'waiting'
  | 'success'
  | 'error'
  | 'expired'
  | 'denied';

type FlowStage = 'init' | 'poll' | 'save';

type FlowErrorType = 'api' | 'network' | 'unknown';

interface ActivationErrorDetails {
  stage: FlowStage;
  message: string;
  type: FlowErrorType;
  operation?: string;
  endpoint?: string;
  statusCode?: number;
  errorCode?: string;
  retryAfterSeconds?: number;
}

function useDeviceFlowSignInModel({
  plugin,
  onSuccess,
}: Pick<DeviceFlowSignInModalProps, 'plugin' | 'onSuccess'>) {
  const [status, setStatus] = useState<FlowStatus>('initializing');
  const [deviceCode, setDeviceCode] = useState<string>('');
  const [verificationUri, setVerificationUri] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [activationUrlFallback, setActivationUrlFallback] = useState<
    string | null
  >(null);
  const [copyUrlSuccess, setCopyUrlSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [activationReportCopied, setActivationReportCopied] = useState(false);
  const [flowStage, setFlowStage] = useState<FlowStage>('init');
  const [pollAttempts, setPollAttempts] = useState(0);
  const [retryIntervalSeconds, setRetryIntervalSeconds] = useState<
    number | null
  >(null);
  const [lastErrorDetails, setLastErrorDetails] =
    useState<ActivationErrorDetails | null>(null);
  const pollTimerRef = useRef<number | null>(null);
  const copyTimerRef = useRef<number | null>(null);
  const copyUrlTimerRef = useRef<number | null>(null);
  const reportCopyTimerRef = useRef<number | null>(null);
  const successTimerRef = useRef<number | null>(null);
  const isMountedRef = useRef(true);

  const buildErrorDetails = useCallback(
    (
      stage: FlowStage,
      message: string,
      context?: DeviceFlowErrorContext
    ): ActivationErrorDetails => {
      const statusCode = context?.statusCode;
      const type: FlowErrorType =
        statusCode !== undefined
          ? 'api'
          : stage === 'save'
            ? 'unknown'
            : 'network';

      return {
        stage,
        message,
        type,
        operation: context?.operation,
        endpoint: context?.endpoint,
        statusCode,
        errorCode: context?.errorCode,
        retryAfterSeconds: context?.retryAfterSeconds,
      };
    },
    []
  );

  const startPolling = useCallback(
    (service: DeviceFlowService, flowData: DeviceCodeResponse) => {
      const poll = async () => {
        if (isMountedRef.current) {
          setFlowStage('poll');
          setPollAttempts((prev) => prev + 1);
        }

        try {
          const result = await service.pollForToken(flowData.device_code);

          if (!isMountedRef.current) {
            return;
          }

          switch (result.status) {
            case 'success':
              setRetryIntervalSeconds(null);
              setLastErrorDetails(null);
              setFlowStage('save');

              
              try {
                const { persisted } = await service.storeActivationResult(
                  result.data
                );

                if (!isMountedRef.current) {
                  return;
                }

                if (!persisted) {
                  const message = t('onboarding.activation.error.save');
                  new Notice(message, 7000);
                }

                setStatus('success');
                
                window.dispatchEvent(
                  new CustomEvent('journalit:subscription-changed')
                );
                
                if (successTimerRef.current) {
                  window.clearTimeout(successTimerRef.current);
                }
                successTimerRef.current = window.setTimeout(() => {
                  if (isMountedRef.current) {
                    onSuccess();
                  }
                }, 1500);
              } catch (error) {
                console.error('Failed to store activation result:', error);

                if (!isMountedRef.current) {
                  return;
                }

                const message = t('onboarding.activation.error.generic');
                new Notice(message, 7000);
                setStatus('error');
                setErrorMessage(message);
                setLastErrorDetails(buildErrorDetails('save', message));
              }
              break;

            case 'pending': {
              const retryAfterSeconds =
                result.retryAfterSeconds ?? flowData.interval;
              setRetryIntervalSeconds(retryAfterSeconds);
              pollTimerRef.current = window.setTimeout(
                () => void poll(),
                retryAfterSeconds * 1000
              );
              break;
            }

            case 'expired': {
              const message = t('onboarding.activation.error.expired');
              setRetryIntervalSeconds(null);
              setStatus('expired');
              setErrorMessage(message);
              setLastErrorDetails(
                buildErrorDetails('poll', message, result.context)
              );
              break;
            }

            case 'denied': {
              const message = t('onboarding.activation.error.denied');
              setRetryIntervalSeconds(null);
              setStatus('denied');
              setErrorMessage(message);
              setLastErrorDetails(
                buildErrorDetails('poll', message, result.context)
              );
              break;
            }

            case 'error': {
              const message =
                result.message || t('onboarding.activation.error.generic');
              setRetryIntervalSeconds(null);
              setStatus('error');
              setErrorMessage(message);
              setLastErrorDetails(
                buildErrorDetails('poll', message, result.context)
              );
              break;
            }
          }
        } catch (error) {
          console.error('Polling error:', error);

          if (!isMountedRef.current) {
            return;
          }

          const message = t('onboarding.activation.error.connection');
          const context =
            error instanceof DeviceFlowError ? error.context : undefined;

          new Notice(message, 7000);
          setRetryIntervalSeconds(null);
          setStatus('error');
          setErrorMessage(message);
          setLastErrorDetails(buildErrorDetails('poll', message, context));
        }
      };

      
      void poll();
    },
    [buildErrorDetails, onSuccess]
  );

  const initializeDeviceFlow = useCallback(async () => {
    setFlowStage('init');
    setPollAttempts(0);
    setRetryIntervalSeconds(null);
    setLastErrorDetails(null);

    try {
      
      if (!plugin.settings.backendIntegration) {
        plugin.settings.backendIntegration =
          createDefaultBackendIntegrationSettings();
      }

      const deviceFlowService = new DeviceFlowService(
        plugin,
        plugin.settings.backendIntegration
      );

      
      const flowData = await deviceFlowService.initiateDeviceFlow();

      if (!isMountedRef.current) {
        return;
      }

      setDeviceCode(flowData.user_code);
      setVerificationUri(flowData.verification_uri);
      setStatus('waiting');

      
      startPolling(deviceFlowService, flowData);
    } catch (error) {
      console.error('Failed to initialize device flow:', error);

      if (!isMountedRef.current) {
        return;
      }

      const message = t('onboarding.activation.error.init');
      const context =
        error instanceof DeviceFlowError ? error.context : undefined;

      new Notice(message, 7000);
      setStatus('error');
      setErrorMessage(message);
      setLastErrorDetails(buildErrorDetails('init', message, context));
    }
  }, [buildErrorDetails, plugin, startPolling]);

  
  useEffect(() => {
    isMountedRef.current = true;
    void initializeDeviceFlow();

    return () => {
      isMountedRef.current = false;

      
      if (pollTimerRef.current) {
        window.clearTimeout(pollTimerRef.current);
      }
      
      if (copyTimerRef.current) {
        window.clearTimeout(copyTimerRef.current);
      }
      
      if (successTimerRef.current) {
        window.clearTimeout(successTimerRef.current);
      }
      
      if (copyUrlTimerRef.current) {
        window.clearTimeout(copyUrlTimerRef.current);
      }
      
      if (reportCopyTimerRef.current) {
        window.clearTimeout(reportCopyTimerRef.current);
      }
    };
  }, [initializeDeviceFlow]);

  const maskDeviceCode = useCallback((code: string) => {
    const trimmed = code.trim();
    if (!trimmed) {
      return 'Unknown';
    }
    const suffix = trimmed.slice(-4);
    return suffix ? `****${suffix}` : '****';
  }, []);

  const buildActivationReport = useCallback(() => {
    const backendUrl =
      plugin.settings.backendIntegration?.serverUrl || 'Unknown';
    const pluginVersion = plugin.manifest?.version || 'Unknown';
    const activationUrl = verificationUri || activationUrlFallback || 'Unknown';
    const maskedCode = deviceCode ? maskDeviceCode(deviceCode) : 'Unknown';
    const errorText = errorMessage || t('common.error');
    const errorType = lastErrorDetails?.type || 'Unknown';
    const errorStage = lastErrorDetails?.stage || 'Unknown';
    const errorOperation = lastErrorDetails?.operation || 'Unknown';
    const errorEndpoint = lastErrorDetails?.endpoint || 'Unknown';
    const errorStatusCode =
      lastErrorDetails?.statusCode !== undefined
        ? String(lastErrorDetails.statusCode)
        : 'Unknown';
    const errorCode = lastErrorDetails?.errorCode || 'Unknown';
    const retryAfter =
      lastErrorDetails?.retryAfterSeconds !== undefined
        ? `${lastErrorDetails.retryAfterSeconds}s`
        : 'Unknown';
    const retryIntervalLabel =
      retryIntervalSeconds !== null ? `${retryIntervalSeconds}s` : 'Unknown';

    return buildSupportReport('Journalit Device Activation Report', [
      `Status: ${status}`,
      `Stage: ${flowStage}`,
      `Error stage: ${errorStage}`,
      `Error message: ${errorText}`,
      `Error type: ${errorType}`,
      `Error operation: ${errorOperation}`,
      `Error endpoint: ${errorEndpoint}`,
      `Status code: ${errorStatusCode}`,
      `Error code: ${errorCode}`,
      `Retry-After: ${retryAfter}`,
      `Poll attempts: ${pollAttempts}`,
      `Retry interval: ${retryIntervalLabel}`,
      `Device code: ${maskedCode}`,
      `Verification URL: ${activationUrl}`,
      `Backend URL: ${backendUrl}`,
      `Plugin version: ${pluginVersion}`,
      `Time: ${new Date().toISOString()}`,
    ]);
  }, [
    activationUrlFallback,
    deviceCode,
    errorMessage,
    flowStage,
    lastErrorDetails,
    maskDeviceCode,
    plugin,
    pollAttempts,
    retryIntervalSeconds,
    status,
    verificationUri,
  ]);

  const handleCopyActivationReport = useCallback(async () => {
    const report = buildActivationReport();

    try {
      await writeClipboardText(report);

      if (!isMountedRef.current) {
        return;
      }

      setActivationReportCopied(true);

      if (reportCopyTimerRef.current) {
        window.clearTimeout(reportCopyTimerRef.current);
      }
      reportCopyTimerRef.current = window.setTimeout(() => {
        if (isMountedRef.current) {
          setActivationReportCopied(false);
        }
      }, 2000);
    } catch {
      new Notice(t('library.error.copy-failed'));
    }
  }, [buildActivationReport]);

  const handleCopyCode = async () => {
    try {
      await writeClipboardText(deviceCode);
      setCopySuccess(true);
      
      if (copyTimerRef.current) {
        window.clearTimeout(copyTimerRef.current);
      }
      copyTimerRef.current = window.setTimeout(
        () => setCopySuccess(false),
        2000
      );
    } catch {
      new Notice(t('onboarding.activation.notice.copy-code-failed'));
    }
  };

  const handleCopyActivationUrl = async (url: string) => {
    setActivationUrlFallback(url);

    try {
      await writeClipboardText(url);
      setCopyUrlSuccess(true);

      if (copyUrlTimerRef.current) {
        window.clearTimeout(copyUrlTimerRef.current);
      }
      copyUrlTimerRef.current = window.setTimeout(() => {
        if (isMountedRef.current) {
          setCopyUrlSuccess(false);
        }
      }, 2000);
    } catch (error) {
      console.error(
        '[DeviceFlowSignIn] Failed to copy URL to clipboard:',
        error
      );
      setCopyUrlSuccess(false);
      new Notice(t('library.error.copy-failed'));
    }
  };

  const showActivationUrlFallback = (url: string) => {
    new Notice(
      t('onboarding.activation.notice.popup-blocked-manual', { url }),
      7000
    );
    void handleCopyActivationUrl(url);
  };

  const handleOpenBrowser = async () => {
    const url = verificationUri || 'https://journalit.co/activate';
    openExternalUrl(url, ['journalit.co', 'api.journalit.co'], {
      onPopupBlocked: showActivationUrlFallback,
    });
  };

  return {
    status,
    deviceCode,
    copySuccess,
    activationUrlFallback,
    copyUrlSuccess,
    errorMessage,
    activationReportCopied,
    handleCopyActivationReport,
    handleCopyCode,
    handleCopyActivationUrl,
    handleOpenBrowser,
  };
}

type DeviceFlowSignInModel = ReturnType<typeof useDeviceFlowSignInModel>;

function DeviceFlowInitializing({ status }: { status: FlowStatus }) {
  if (status !== 'initializing') {
    return null;
  }

  return (
    <div className="activation-loading">
      <LoadingSpinner
        size="medium"
        message={t('onboarding.activation.status.initializing')}
      />
    </div>
  );
}

function DeviceFlowWaiting({ model }: { model: DeviceFlowSignInModel }) {
  const {
    status,
    deviceCode,
    copySuccess,
    activationUrlFallback,
    copyUrlSuccess,
    handleCopyCode,
    handleCopyActivationUrl,
    handleOpenBrowser,
  } = model;

  if (status !== 'waiting' && status !== 'success') {
    return null;
  }

  return (
    <div className="activation-content">
      <div className="activation-left">
        <div className="device-code-container">
          <label className="device-code-label">
            {t('onboarding.activation.label.code')}
          </label>
          <div className="device-code-box">
            <div className="device-code">{deviceCode || '----'}</div>
            <Tooltip
              content={
                copySuccess
                  ? t('onboarding.activation.button.copied')
                  : t('onboarding.activation.button.copy')
              }
              preferredPosition="top"
            >
              <button
                className={`copy-button ${copySuccess ? 'copied' : ''}`}
                onClick={() => void handleCopyCode()}
                disabled={!deviceCode}
                type="button"
              >
                {copySuccess ? <CheckCircle2 size={18} /> : <Copy size={18} />}
              </button>
            </Tooltip>
          </div>
        </div>

        <div className="activation-steps">
          <div className="step-item">
            <span className="step-number">1</span>
            <span className="step-text">
              {t('onboarding.activation.step.open-browser')}
            </span>
          </div>
          <div className="step-item">
            <span className="step-number">2</span>
            <span className="step-text">
              {t('onboarding.activation.step.enter-code')}
            </span>
          </div>
          <div className="step-item">
            <span className="step-number">3</span>
            <span className="step-text">
              {t('onboarding.activation.step.complete-signin')}
            </span>
          </div>
          <div className="step-item">
            <span className="step-number">4</span>
            <span className="step-text">
              {t('onboarding.activation.step.return-here')}
            </span>
          </div>
        </div>

        <div className="activation-primary-action">
          <Button
            variant="primary"
            size="large"
            onClick={() => void handleOpenBrowser()}
            disabled={!deviceCode || status === 'success'}
          >
            <ExternalLink size={18} className="button-icon-left" />
            {t('onboarding.activation.button.open-browser')}
          </Button>
        </div>

        {activationUrlFallback && (
          <div className="onboarding-link-fallback">
            <button
              className="onboarding-link-fallback-url"
              onClick={() =>
                void handleCopyActivationUrl(activationUrlFallback)
              }
              type="button"
            >
              {activationUrlFallback}
            </button>
            <Tooltip
              content={
                copyUrlSuccess
                  ? t('onboarding.activation.button.copied')
                  : t('onboarding.activation.button.copy-link')
              }
              preferredPosition="top"
            >
              <button
                className={`copy-button onboarding-link-fallback-copy ${copyUrlSuccess ? 'copied' : ''}`}
                onClick={() =>
                  void handleCopyActivationUrl(activationUrlFallback)
                }
                type="button"
              >
                {copyUrlSuccess ? (
                  <CheckCircle2 size={18} />
                ) : (
                  <Copy size={18} />
                )}
              </button>
            </Tooltip>
          </div>
        )}

        {status === 'waiting' && (
          <div className="activation-waiting">
            <LoadingSpinner size="small" />
            <div className="waiting-text">
              <p>{t('onboarding.activation.waiting.title')}</p>
              <span className="status-hint">
                {t('onboarding.activation.waiting.hint')}
              </span>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="activation-success">
            <CheckCircle2 size={24} className="success-icon" />
            <p>{t('onboarding.activation.success.title')}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function DeviceFlowErrorState({
  model,
  onCancel,
}: {
  model: DeviceFlowSignInModel;
  onCancel: () => void;
}) {
  const {
    status,
    errorMessage,
    activationReportCopied,
    handleCopyActivationReport,
  } = model;

  if (status !== 'error' && status !== 'expired' && status !== 'denied') {
    return null;
  }

  return (
    <div className="activation-content">
      <div className="activation-left">
        <div className="activation-error">
          <h2>{t('onboarding.activation.status.error')}</h2>
          <p className="error-message">{errorMessage}</p>
          <SupportActions
            onCopy={handleCopyActivationReport}
            copied={activationReportCopied}
            copyLabel={t('csv.errors.copy-report')}
            copiedLabel={t('csv.errors.copied')}
            discordLabel={t('button.discord')}
            note={t('csv.results.discord-note')}
            onDiscord={() => openExternalUrl('https://discord.gg/AkSw3D9h8b')}
            actionsClassName="activation-error-actions"
            helpClassName="activation-error-help"
            helpContentClassName="activation-error-help-content"
            noteIconClassName="activation-error-help-icon"
            renderButton={({ variant, onClick, content }) => (
              <Button variant={variant} size="small" onClick={onClick}>
                {content}
              </Button>
            )}
          />
          <div className="activation-primary-action">
            <Button variant="secondary" onClick={onCancel}>
              {t('onboarding.common.close')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

const DeviceFlowSignInContentBase: React.FC<DeviceFlowSignInModalProps> = ({
  plugin,
  onSuccess,
  onCancel,
}) => {
  const model = useDeviceFlowSignInModel({ plugin, onSuccess });
  const { status } = model;

  return (
    <div className="device-activation-step">
      <DeviceFlowInitializing status={status} />

      <DeviceFlowWaiting model={model} />

      <DeviceFlowErrorState model={model} onCancel={onCancel} />
    </div>
  );
};

const DeviceFlowSignInContent = React.memo(DeviceFlowSignInContentBase);


export class DeviceFlowSignInModal extends Modal {
  private plugin: JournalitPlugin;
  private onSuccess: () => void;
  private onCancel: () => void;
  private root: Root | null = null;
  private handleContentSuccess = () => {
    this.onSuccess();
    this.close();
  };
  private handleContentCancel = () => {
    this.onCancel();
    this.close();
  };

  constructor(
    app: App,
    plugin: JournalitPlugin,
    onSuccess: () => void,
    onCancel: () => void
  ) {
    super(app);
    this.plugin = plugin;
    this.onSuccess = onSuccess;
    this.onCancel = onCancel;
  }

  onOpen() {
    this.titleEl.setText(t('onboarding.activation.title'));

    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass('device-activation-modal-container');
    
    contentEl.addClass('journalit-onboarding-view-container');

    

    

    
    const rootDiv = contentEl.createDiv();
    this.root = createRoot(rootDiv);

    
    this.root.render(
      <DeviceFlowSignInContent
        plugin={this.plugin}
        onSuccess={this.handleContentSuccess}
        onCancel={this.handleContentCancel}
      />
    );
  }

  onClose() {
    
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }

    const { contentEl } = this;
    contentEl.empty();
    contentEl.removeClass('device-activation-modal-container');
    contentEl.removeClass('journalit-onboarding-view-container');
  }
}
