

import React, { useRef, useState } from 'react';
import { App, Modal, Notice, TFile } from 'obsidian';
import { createRoot, Root } from 'react-dom/client';
import JournalitPlugin from '../../../main';
import { TradeForm } from '.';
import { TradeFormData, TradeFormOpenOptions } from './types';
import { MissedTradeFormData } from '../../missedTrade/types';
import { BacktestTradeFormData } from '../../../services/backtestTrade/BacktestTradeService';
import type { TradeData } from '../../../services/trade/TradeService';

import { CurrencyProvider } from '../../../contexts/CurrencyContext';
import { DisplayPolicyProvider } from '../../../contexts/DisplayPolicyContext';
import { t } from '../../../lang/helpers';
import { eventBus } from '../../../services/events';
import {
  getRequestedTradeType,
  hasTradeIdentityChanged,
  inferStoredTradeType,
} from '../../../utils/tradeTypeRouting';
import { TradeFormGuide } from './TradeFormGuide';

type TradeFormSubmissionData = TradeFormData &
  Record<string, unknown> & {
    originalPnl?: number;
  };

const parseTradeStatus = (
  value: string | undefined
): TradeData['tradeStatus'] =>
  value === 'OPEN' || value === 'CLOSED' ? value : undefined;

const toRegularTradeData = (tradeData: TradeFormSubmissionData): TradeData => ({
  ...tradeData,
  tradeStatus: parseTradeStatus(tradeData.tradeStatus),
  entries: tradeData.entries?.flatMap((entry) =>
    entry.time instanceof Date &&
    entry.price !== undefined &&
    entry.size !== undefined
      ? [
          {
            time: entry.time,
            price: entry.price,
            size: entry.size,
            notional: entry.notional,
          },
        ]
      : []
  ),
  exits: tradeData.exits?.flatMap((exit) =>
    exit.time instanceof Date &&
    exit.price !== undefined &&
    exit.size !== undefined
      ? [
          {
            time: exit.time,
            price: exit.price,
            size: exit.size,
            notional: exit.notional,
            hasExplicitPrice: exit.hasExplicitPrice,
          },
        ]
      : []
  ),
});

interface TradeFormModalProps {
  app: App;
  plugin: JournalitPlugin;
  isEditMode?: boolean;
  initialData?: Partial<TradeFormData>;
  filePath?: string;
  openOptions?: TradeFormOpenOptions;
}

export class TradeFormModal extends Modal {
  private modalProps!: TradeFormModalProps;
  private plugin: JournalitPlugin;
  private container: HTMLDivElement | null = null;
  private root: Root | null = null;
  private dirtyStateRef: { current: (() => boolean) | null } = {
    current: null,
  };
  private isConfirming: boolean = false;
  private confirmationModal: UnsavedChangesConfirmationModal | null = null;
  private shouldBypassUnsavedCheck: boolean = false;

  constructor(props: TradeFormModalProps) {
    super(props.app);
    this.modalProps = props;
    this.plugin = props.plugin;
  }

  private async closeIfConfirmed(): Promise<boolean> {
    
    if (this.isConfirming) {
      return false;
    }

    
    if (this.shouldBypassUnsavedCheck) {
      this.shouldBypassUnsavedCheck = false;
      super.close();
      return true;
    }

    
    const checkForUnsavedChanges = this.dirtyStateRef.current;
    if (checkForUnsavedChanges && checkForUnsavedChanges()) {
      this.isConfirming = true;
      try {
        const shouldClose = await this.showUnsavedChangesConfirmation();
        if (shouldClose) {
          super.close();
        }
        return shouldClose;
      } finally {
        this.isConfirming = false;
        this.confirmationModal = null;
      }
    }

    super.close();
    return true;
  }

  
  close(): void {
    void this.closeIfConfirmed();
  }

  requestClose(): Promise<boolean> {
    return this.closeIfConfirmed();
  }

  
  private showUnsavedChangesConfirmation(): Promise<boolean> {
    return new Promise((resolve) => {
      this.confirmationModal = new UnsavedChangesConfirmationModal(
        this.modalProps.app,
        resolve
      );
      this.confirmationModal.open();
    });
  }

  
  closeAfterSuccessfulSubmit(): void {
    this.shouldBypassUnsavedCheck = true;
    this.close();
  }

  onOpen(): void {
    const { contentEl } = this;
    contentEl.empty();
    this.modalEl.addClass('journalit-trade-form-modal');

    
    

    
    
    try {
      const activeEl = window.activeDocument.activeElement;
      if (activeEl instanceof HTMLElement) activeEl.blur();
    } catch {
      // intentional
    }

    
    this.container = contentEl.createDiv({
      cls: 'trade-form-modal-container trade-form-view-container',
    });

    eventBus.publish('trade-form:opened', {
      mode: this.modalProps.isEditMode ? 'edit' : 'create',
      filePath: this.modalProps.filePath,
    });

    
    this.renderComponent();
  }

  onClose(): void {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
    
    const { contentEl } = this;
    contentEl.empty();
  }

  private renderComponent(): void {
    if (!this.container) return;
    this.root = createRoot(this.container);
    this.root.render(
      <DisplayPolicyProvider privacyModeOverride={false}>
        <CurrencyProvider>
          <TradeFormModalContent
            app={this.modalProps.app}
            plugin={this.modalProps.plugin}
            isEditMode={!!this.modalProps.isEditMode}
            initialData={this.modalProps.initialData || {}}
            filePath={this.modalProps.filePath || ''}
            openOptions={this.modalProps.openOptions}
            onModalClose={() => this.requestClose()}
            onSuccessfulSubmit={() => this.closeAfterSuccessfulSubmit()}
            dirtyStateRef={this.dirtyStateRef}
          />
        </CurrencyProvider>
      </DisplayPolicyProvider>
    );
  }
}

interface TradeFormModalContentProps extends Omit<
  TradeFormModalProps,
  'app' | 'plugin'
> {
  app: App;
  plugin: JournalitPlugin;
  onModalClose: () => Promise<boolean>;
  onSuccessfulSubmit: () => void;
  dirtyStateRef: { current: (() => boolean) | null };
}

export const resolveFormExitExplicitness = (
  exit: { price?: number | null; hasExplicitPrice?: boolean },
  useDirectPnLInput?: boolean
): boolean => {
  if (typeof exit.hasExplicitPrice === 'boolean') {
    return exit.hasExplicitPrice;
  }

  return !(useDirectPnLInput === true && exit.price === 0);
};

interface TradeFormModalContentModelParams {
  plugin: JournalitPlugin;
  isEditMode?: boolean;
  initialData?: Partial<TradeFormData>;
  filePath?: string;
  onModalClose: () => Promise<boolean>;
  onSuccessfulSubmit: () => void;
}

function useTradeFormModalContentModel({
  plugin,
  isEditMode,
  initialData,
  filePath,
  onModalClose,
  onSuccessfulSubmit,
}: TradeFormModalContentModelParams) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentFilePathRef = useRef(filePath || '');

  const ensureMissedTradeService = async () => {
    try {
      if (plugin.missedTradeService) return plugin.missedTradeService;
      const service = await plugin.serviceManager.getMissedTradeService();
      return service;
    } catch {
      throw new Error(t('notice.error.missed-trade-service-init'));
    }
  };

  const ensureBacktestTradeService = async () => {
    try {
      if (plugin.backtestTradeService) return plugin.backtestTradeService;
      const service = await plugin.serviceManager.getBacktestTradeService();
      return service;
    } catch {
      throw new Error(t('notice.error.backtest-trade-service-init'));
    }
  };

  const ensureParentFolderExists = async (path: string): Promise<void> => {
    const lastSlashIndex = path.lastIndexOf('/');
    if (lastSlashIndex <= 0) {
      return;
    }

    const parentFolder = path.slice(0, lastSlashIndex);
    try {
      await plugin.app.vault.adapter.mkdir(parentFolder);
    } catch {
      // intentional
    }
  };

  const relocateTradeFileIfNeeded = async (
    data: TradeFormData
  ): Promise<string> => {
    if (!isEditMode || !currentFilePathRef.current) {
      return currentFilePathRef.current;
    }

    const targetTradeType = getRequestedTradeType(data);
    const currentSnapshot = {
      ...initialData,
      filePath: currentFilePathRef.current,
    };
    const nextSnapshot = {
      ...data,
      filePath: currentFilePathRef.current,
    };
    if (
      !hasTradeIdentityChanged(
        currentSnapshot,
        nextSnapshot,
        plugin,
        (ticker: string) =>
          plugin.tradeService.sanitizeTickerForFilename(ticker)
      )
    ) {
      return currentFilePathRef.current;
    }

    if (targetTradeType === 'regular') {
      return currentFilePathRef.current;
    }

    let nextPath = '';
    if (targetTradeType === 'missed') {
      const missedTradeService = await ensureMissedTradeService();
      nextPath = await missedTradeService.generateMissedTradePath({
        instrument: data.instrument,
        entryTime: data.entryTime,
      });
    } else if (targetTradeType === 'backtest') {
      const backtestTradeService = await ensureBacktestTradeService();
      nextPath = await backtestTradeService.generateBacktestTradePath({
        instrument: data.instrument,
        entryTime: data.entryTime,
      });
    } else {
      const nextTicker = data.instrument
        ? plugin.tradeService.sanitizeTickerForFilename(data.instrument)
        : 'UNKNOWN';
      nextPath = await plugin.tradeService.generateNewTradePath(
        nextTicker,
        data.entryTime
      );
    }

    if (!nextPath || nextPath === currentFilePathRef.current) {
      return currentFilePathRef.current;
    }

    const currentFile = plugin.app.vault.getAbstractFileByPath(
      currentFilePathRef.current
    );
    if (!(currentFile instanceof TFile)) {
      throw new Error(`Invalid file path: ${currentFilePathRef.current}`);
    }

    await ensureParentFolderExists(nextPath);
    await plugin.app.vault.rename(currentFile, nextPath);
    currentFilePathRef.current = nextPath;
    return nextPath;
  };

  const publishSourceTypeChangeIfNeeded = (
    originalType: 'regular' | 'missed' | 'backtest',
    nextType: 'regular' | 'missed' | 'backtest',
    originalFilePath: string,
    currentFilePath: string
  ): void => {
    if (originalType === nextType) {
      return;
    }

    const payload = {
      action: 'deleted' as const,
      filePath: originalFilePath || currentFilePath,
      timestamp: Date.now(),
    };

    if (originalType === 'missed') {
      eventBus.publish('missed-trade:changed', payload);
      return;
    }

    if (originalType === 'backtest') {
      eventBus.publish('backtest-trade:changed', payload);
      return;
    }

    eventBus.publish('trade:changed', {
      action: 'deleted',
      filePaths: [originalFilePath || currentFilePath],
    });
  };

  const handleSubmit = async (data: TradeFormData): Promise<boolean> => {
    try {
      setIsSubmitting(true);

      let outPath = '';
      const isMissedTrade = data.isMissedTrade === true;

      
      const resolvedTags = Array.isArray(data.customTags)
        ? data.customTags
        : Array.isArray(data.tags)
          ? data.tags
          : [];

      const formExits = (data.exits || []).map((exit) => ({
        ...exit,
        hasExplicitPrice: resolveFormExitExplicitness(
          exit,
          data.useDirectPnLInput
        ),
      }));
      const hasExplicitExitPrice =
        typeof data.hasExplicitExitPrice === 'boolean'
          ? data.hasExplicitExitPrice
          : formExits.length > 0
            ? formExits.some((exit) => exit.hasExplicitPrice === true)
            : undefined;
      const tradeData: TradeFormSubmissionData = {
        entryTime: data.entryTime,
        exitTime: data.exitTime,
        entryPrice: data.entryPrice,
        exitPrice: data.exitPrice,
        positionSize: data.positionSize,
        direction: data.direction,
        entries: data.entries || [],
        exits: formExits,
        idealExits: data.idealExits || [],
        hasExplicitExitPrice,
        dividends: data.dividends || [],
        thesis: data.thesis,
        images: data.images,
        instrument: data.instrument,
        assetType: data.assetType,
        setup: data.setup,
        mistake: data.mistake,
        account: data.account,
        tags: resolvedTags,
        commission: data.commission,
        hasExplicitCommission: data.hasExplicitCommission,
        commissionType: data.commissionType,
        fees: data.fees,
        swap: data.swap,
        stopLoss: data.stopLoss,
        takeProfits: data.takeProfits,
        riskAmount: data.riskAmount,
        mae: data.mae,
        mfe: data.mfe,
        maePrice: data.maePrice,
        mfePrice: data.mfePrice,
        useDirectPnLInput: data.useDirectPnLInput,
        directPnL: data.useDirectPnLInput ? data.directPnL : undefined,
        rebate: data.rebate,
        isMissedTrade: data.isMissedTrade,
        missedReason: data.missedReason,
        isBacktestTrade: data.isBacktestTrade || false,
        customFields: data.customFields,
        customTags: data.customTags,
        currency: data.currency,
        mtComment: data.mtComment,
      };

      
      if (data.assetType === 'stock') {
        if (data.exchange) tradeData.exchange = data.exchange;
      } else if (data.assetType === 'options') {
        if (data.expirationDate)
          tradeData.expirationDate = new Date(data.expirationDate);
        if (data.strikePrice !== undefined)
          tradeData.strikePrice = data.strikePrice;
        if (data.optionType) tradeData.optionType = data.optionType;
        if (data.contractSize !== undefined)
          tradeData.contractSize = data.contractSize;
      } else if (data.assetType === 'futures') {
        if (data.dollarPerPoint !== undefined)
          tradeData.dollarPerPoint = data.dollarPerPoint;
        if (data.tickSize !== undefined) tradeData.tickSize = data.tickSize;
        if (data.tickValue !== undefined) tradeData.tickValue = data.tickValue;
      } else if (data.assetType === 'forex') {
        if (data.lotSize !== undefined) tradeData.lotSize = data.lotSize;
        if (data.pipValue !== undefined) tradeData.pipValue = data.pipValue;
      } else if (data.assetType === 'crypto') {
        if (data.cryptoExchange) tradeData.cryptoExchange = data.cryptoExchange;
      } else if (data.assetType === 'cfd') {
        if (data.contractSize !== undefined)
          tradeData.contractSize = data.contractSize;
        if (data.leverageRatio !== undefined)
          tradeData.leverageRatio = data.leverageRatio;
      }

      const originalTradeType = inferStoredTradeType({
        ...initialData,
        filePath,
      });
      const requestedTradeType = getRequestedTradeType(data);

      if (isEditMode) {
        tradeData.originalPnl = initialData?.pnl;
      }

      if (isEditMode) {
        const workingFilePath = await relocateTradeFileIfNeeded(data);

        if (isMissedTrade) {
          const missedTradeService = await ensureMissedTradeService();
          const missedTradeData: MissedTradeFormData = {
            ...tradeData,
            isMissedTrade: true,
          };
          outPath = await missedTradeService.updateMissedTrade(
            missedTradeData,
            workingFilePath
          );
        } else if (data.isBacktestTrade) {
          const backtestTradeService = await ensureBacktestTradeService();
          const backtestTradeData: BacktestTradeFormData = {
            ...tradeData,
            isBacktestTrade: true,
          };
          const success = await backtestTradeService.updateBacktestTrade(
            backtestTradeData,
            workingFilePath
          );
          outPath = success
            ? workingFilePath || t('form.trade-type.backtest').toLowerCase()
            : '';
        } else {
          outPath = await plugin.tradeService.updateTrade(
            toRegularTradeData(tradeData),
            workingFilePath
          );
        }
        const tradeType = data.isBacktestTrade
          ? t('form.trade-type.backtest')
          : isMissedTrade
            ? t('form.trade-type.missed')
            : t('common.trade');

        if (!outPath) {
          setIsSubmitting(false);
          new Notice(
            t('notice.error.trade-update-failed', {
              type: tradeType,
              error: 'Update returned empty path',
            })
          );
          return false;
        }

        currentFilePathRef.current = outPath;

        publishSourceTypeChangeIfNeeded(
          originalTradeType,
          requestedTradeType,
          filePath || '',
          outPath
        );

        new Notice(
          t('notice.trade-updated', { type: tradeType, path: outPath })
        );
      } else {
        if (data.isBacktestTrade) {
          const backtestTradeService = await ensureBacktestTradeService();
          const backtestTradeData: BacktestTradeFormData = {
            ...tradeData,
            isBacktestTrade: true,
          };
          const file = await backtestTradeService.createBacktestTrade(
            backtestTradeData,
            {
              openFile: true,
              images: data.images,
              customFields: data.customFields,
              deferPostCreateTasks: true,
            }
          );
          outPath = file ? file.path : '';
        } else if (isMissedTrade) {
          const missedTradeService = await ensureMissedTradeService();
          const missedTradeData: MissedTradeFormData = {
            ...tradeData,
            isMissedTrade: true,
          };
          outPath = await missedTradeService.createMissedTrade(
            missedTradeData,
            { deferPostCreateTasks: true }
          );
        } else {
          outPath = await plugin.tradeService.createTrade(
            toRegularTradeData(tradeData),
            {
              deferPostCreateTasks: true,
            }
          );
        }
        const tradeType = data.isBacktestTrade
          ? t('form.trade-type.backtest')
          : isMissedTrade
            ? t('form.trade-type.missed')
            : t('common.trade');
        new Notice(
          t('notice.trade-created', { type: tradeType, path: outPath })
        );
      }

      
      if (data.assetType) {
        const uiStateManager = plugin.uiStateManager;
        void uiStateManager
          .updateState({
            lastAssetType: data.assetType,
          })
          .catch((err: unknown) => {
            console.error('Error saving asset type preference:', err);
          });
      }

      onSuccessfulSubmit();
      return true;
    } catch (error: unknown) {
      const tradeType = data.isBacktestTrade
        ? t('form.trade-type.backtest')
        : data.isMissedTrade
          ? t('form.trade-type.missed')
          : t('common.trade');
      const action = isEditMode
        ? t('button.update').toLowerCase()
        : t('button.create').toLowerCase();
      console.error(`Failed to ${action} ${tradeType.toLowerCase()}:`, error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      new Notice(
        t(
          isEditMode
            ? 'notice.error.trade-update-failed'
            : 'notice.error.trade-create-failed',
          {
            type: tradeType,
            error: errorMessage,
          }
        )
      );
      setIsSubmitting(false);
      return false;
    }
  };

  const handleCancel = () => onModalClose();

  return {
    isSubmitting,
    handleSubmit,
    handleCancel,
  };
}

const TradeFormModalContent: React.FC<TradeFormModalContentProps> = ({
  plugin,
  isEditMode,
  initialData,
  filePath,
  openOptions,
  onModalClose,
  onSuccessfulSubmit,
  dirtyStateRef,
}) => {
  const { isSubmitting, handleSubmit, handleCancel } =
    useTradeFormModalContentModel({
      plugin,
      isEditMode,
      initialData,
      filePath,
      onModalClose,
      onSuccessfulSubmit,
    });

  return (
    <>
      <TradeForm
        initialData={initialData || {}}
        initialTab={openOptions?.initialTab}
        isSubmitting={isSubmitting}
        isEditMode={isEditMode}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        dirtyStateRef={dirtyStateRef}
      />
      {!isEditMode && <TradeFormGuide plugin={plugin} />}
    </>
  );
};


class UnsavedChangesConfirmationModal extends Modal {
  private resolved = false;

  constructor(
    app: App,
    private onConfirm: (shouldClose: boolean) => void
  ) {
    super(app);
    this.titleEl.setText(t('form.modal.unsaved-changes.title'));
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl('p', {
      text: t('form.modal.unsaved-changes.body1'),
    });
    contentEl.createEl('p', {
      text: t('form.modal.unsaved-changes.body2'),
    });

    const buttonContainer = contentEl.createDiv({
      cls: 'modal-button-container journalit-modal-button-container',
    });

    
    buttonContainer
      .createEl('button', {
        type: 'button',
        text: t('form.modal.unsaved-changes.continue'),
        cls: 'mod-cta',
      })
      .addEventListener('click', () => {
        if (!this.resolved) {
          this.resolved = true;
          this.onConfirm(false); 
        }
        this.close();
      });

    
    buttonContainer
      .createEl('button', {
        type: 'button',
        text: t('form.modal.unsaved-changes.discard'),
        cls: 'mod-warning',
      })
      .addEventListener('click', () => {
        if (!this.resolved) {
          this.resolved = true;
          this.onConfirm(true); 
        }
        this.close();
      });
  }

  close(): void {
    super.close();
    
    if (!this.resolved) {
      this.resolved = true;
      this.onConfirm(false);
    }
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}
