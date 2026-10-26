

import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { App, Component, Notice } from 'obsidian';
import { createRoot, Root } from 'react-dom/client';
import JournalitPlugin from '../../../main';
import { TradeForm } from './TradeForm';
import { TradeFormData, TradeFormOpenOptions } from './types';
import {
  resolveFormExitExplicitness,
  resolveFormHasExplicitExitPrice,
} from './exitExplicitness';
import type { TradeData } from '../../../services/trade/TradeService';

import { CurrencyProvider } from '../../../contexts/CurrencyContext';
import { DisplayPolicyProvider } from '../../../contexts/DisplayPolicyContext';
import { t } from '../../../lang/helpers';
import { eventBus } from '../../../services/events/EventBus';
import { showConfirmationModal } from '../../shared/ConfirmationModal';
import {
  getRequestedTradeType,
  inferStoredTradeType,
} from '../../../utils/tradeTypeRouting';
import { TradeFormGuide, useTradeFormGuide } from './TradeFormGuide';
import { canonicalizeTradeTagSelection } from '../../../utils/tradeTagNormalization';
import { Drawer } from '../../shared/drawer/Drawer';
import { TradeFormLayoutEditor } from './TradeFormLayoutEditor';
import type { TradeFormLayoutSettings } from '../../../settings/types';
import { Button } from '../../ui/Button';
import { ChevronLeft } from '../../shared/icons/ObsidianIcon';

type TradeFormSubmissionData = TradeFormData &
  Record<string, unknown> & {
    originalPnl?: number;
  };

const parseTradeStatus = (
  value: string | undefined
): TradeData['tradeStatus'] =>
  value === 'OPEN' ||
  value === 'PARTIALLY_CLOSED' ||
  value === 'CLOSED' ||
  value === 'CANCELLED'
    ? value
    : undefined;

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

interface TradeFormDrawerProps {
  app: App;
  plugin: JournalitPlugin;
  isEditMode?: boolean;
  initialData?: Partial<TradeFormData>;
  filePath?: string;
  openOptions?: TradeFormOpenOptions;
}

export class TradeFormDrawer extends Component {
  private static active = new WeakMap<Document, TradeFormDrawer>();
  private container: HTMLDivElement | null = null;
  private root: Root | null = null;
  private dirtyStateRef: { current: (() => boolean) | null } = {
    current: null,
  };
  private submittingRef = { current: false };
  private customizationDirtyRef: { current: (() => boolean) | null } = {
    current: null,
  };
  private customizationSavingRef = { current: false };
  private pendingDismissal: {
    kind: 'close' | 'back';
    promise: Promise<boolean>;
  } | null = null;
  private ownerDocument: Document | null = null;
  private confirmationAbort = new AbortController();

  constructor(private props: TradeFormDrawerProps) {
    super();
  }

  requestClose(): Promise<boolean> {
    return this.requestDismissal('close');
  }

  private requestDismissal(kind: 'close' | 'back'): Promise<boolean> {
    if (this.submittingRef.current || this.customizationSavingRef.current)
      return Promise.resolve(false);
    if (this.pendingDismissal)
      return this.pendingDismissal.kind === kind
        ? this.pendingDismissal.promise
        : Promise.resolve(false);
    const promise = this.dismissIfConfirmed(kind).finally(() => {
      this.pendingDismissal = null;
    });
    this.pendingDismissal = { kind, promise };
    return promise;
  }

  private async dismissIfConfirmed(kind: 'close' | 'back'): Promise<boolean> {
    const customizationDirty = this.customizationDirtyRef.current?.() === true;
    if (
      customizationDirty ||
      (kind === 'close' && this.dirtyStateRef.current?.())
    ) {
      const discard = await showConfirmationModal(this.props.app, {
        title: t('form.modal.unsaved-changes.title'),
        message:
          kind === 'back'
            ? t('form.layout.discard-changes.body')
            : [
                { text: t('form.modal.unsaved-changes.body1') },
                { text: t('form.modal.unsaved-changes.body2') },
              ],
        cancelLabel: t('form.modal.unsaved-changes.continue'),
        confirmLabel: t('form.modal.unsaved-changes.discard'),
        destructive: true,
        signal: this.confirmationAbort.signal,
      });
      if (!discard) return false;
    }
    if (this.confirmationAbort.signal.aborted) return false;
    if (kind === 'close') this.props.plugin.removeChild(this);
    return true;
  }

  closeAfterSuccessfulSubmit(): void {
    this.props.plugin.removeChild(this);
  }

  open(): void {
    const doc = window.activeDocument;
    const existing = TradeFormDrawer.active.get(doc);
    if (existing) {
      
      doc
        .querySelector<HTMLElement>(
          '.journalit-trade-form-drawer input, .journalit-trade-form-drawer button'
        )
        ?.focus();
      return;
    }
    this.ownerDocument = doc;
    TradeFormDrawer.active.set(doc, this);
    this.props.plugin.addChild(this);
    this.container = doc.body.createDiv({ cls: 'journalit-trade-form-root' });
    const onWindowClose = () => this.props.plugin.removeChild(this);
    doc.defaultView?.addEventListener('unload', onWindowClose);
    this.register(() =>
      doc.defaultView?.removeEventListener('unload', onWindowClose)
    );
    eventBus.publish('trade-form:opened', {
      mode: this.props.isEditMode ? 'edit' : 'create',
      filePath: this.props.filePath,
    });
    this.root = createRoot(this.container);
    this.root.render(
      <DisplayPolicyProvider privacyModeOverride={false}>
        <CurrencyProvider>
          <TradeFormDrawerContent
            {...this.props}
            ownerDocument={doc}
            onDrawerClose={() => this.requestClose()}
            onCustomizationBack={() => this.requestDismissal('back')}
            onSuccessfulSubmit={() => this.closeAfterSuccessfulSubmit()}
            dirtyStateRef={this.dirtyStateRef}
            submittingRef={this.submittingRef}
            customizationDirtyRef={this.customizationDirtyRef}
            customizationSavingRef={this.customizationSavingRef}
            closeSignal={this.confirmationAbort.signal}
          />
        </CurrencyProvider>
      </DisplayPolicyProvider>
    );
  }

  onunload(): void {
    this.confirmationAbort.abort();
    this.root?.unmount();
    this.root = null;
    this.container?.remove();
    this.container = null;
    if (
      this.ownerDocument &&
      TradeFormDrawer.active.get(this.ownerDocument) === this
    )
      TradeFormDrawer.active.delete(this.ownerDocument);
  }
}

interface TradeFormDrawerContentProps extends Omit<
  TradeFormDrawerProps,
  'app' | 'plugin'
> {
  ownerDocument: Document;
  app: App;
  plugin: JournalitPlugin;
  onDrawerClose: () => Promise<boolean>;
  onSuccessfulSubmit: () => void;
  dirtyStateRef: { current: (() => boolean) | null };
  submittingRef: { current: boolean };
  customizationDirtyRef: { current: (() => boolean) | null };
  customizationSavingRef: { current: boolean };
  onCustomizationBack: () => Promise<boolean>;
  closeSignal: AbortSignal;
}

interface TradeFormDrawerContentModelParams {
  submittingRef: { current: boolean };
  plugin: JournalitPlugin;
  isEditMode?: boolean;
  initialData?: Partial<TradeFormData>;
  filePath?: string;
  onDrawerClose: () => Promise<boolean>;
  onSuccessfulSubmit: () => void;
}

function useTradeFormDrawerContentModel({
  submittingRef,
  plugin,
  isEditMode,
  initialData,
  filePath,
  onDrawerClose,
  onSuccessfulSubmit,
}: TradeFormDrawerContentModelParams) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentFilePathRef = useRef(filePath || '');

  const handleSubmit = async (data: TradeFormData): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      submittingRef.current = true;

      let outPath = '';
      const isMissedTrade = data.isMissedTrade === true;
      const originalTradeType = inferStoredTradeType({
        ...initialData,
        filePath,
      });
      const requestedTradeType = getRequestedTradeType(data);
      const canonicalTradeTypeChanged =
        isEditMode &&
        typeof initialData?.canonicalTradeId === 'string' &&
        initialData.canonicalTradeId.trim() !== '' &&
        originalTradeType !== requestedTradeType;
      if (canonicalTradeTypeChanged) {
        setIsSubmitting(false);
        new Notice(t('notice.error.canonical-trade-type-change'));
        return false;
      }

      
      const previousTags = Array.isArray(initialData?.tags)
        ? initialData.tags
        : [];
      const resolvedTags = canonicalizeTradeTagSelection(
        previousTags,
        Array.isArray(data.tags) ? data.tags : []
      );

      const formExits = (data.exits || []).map((exit) => ({
        ...exit,
        hasExplicitPrice: resolveFormExitExplicitness(
          exit,
          data.useDirectPnLInput
        ),
      }));
      const hasExplicitExitPrice = resolveFormHasExplicitExitPrice(
        formExits,
        data.hasExplicitExitPrice
      );
      
      
      const fxRateBaseCurrency: string =
        plugin.settings?.general?.currency || 'USD';
      const hasPersistableFxRate =
        typeof data.fxRate === 'number' &&
        Number.isFinite(data.fxRate) &&
        data.fxRate > 0 &&
        typeof data.currency === 'string' &&
        data.currency.length > 0 &&
        data.currency !== fxRateBaseCurrency &&
        data.fxRateBaseCurrency === fxRateBaseCurrency;
      
      
      
      
      
      const hasPreservableForeignBaseFxRate =
        typeof data.fxRate === 'number' &&
        Number.isFinite(data.fxRate) &&
        data.fxRate > 0 &&
        typeof data.fxRateBaseCurrency === 'string' &&
        data.fxRateBaseCurrency.length > 0 &&
        data.fxRateBaseCurrency !== fxRateBaseCurrency &&
        typeof data.currency === 'string' &&
        data.currency.length > 0 &&
        data.currency !== data.fxRateBaseCurrency;
      const tradeData: TradeFormSubmissionData = {
        canonicalTradeId: data.canonicalTradeId,
        authoritativePnl:
          data.canonicalTradeId && initialData?._originalPnlWasNull === true
            ? null
            : data.canonicalTradeId &&
                typeof initialData?.pnl === 'number' &&
                Number.isFinite(initialData.pnl)
              ? initialData.pnl
              : undefined,
        tradeStatus: data.tradeStatus,
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
        imageAnnotations: data.imageAnnotations,
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
        stopLosses: data.stopLosses ?? [],
        takeProfits: data.takeProfits,
        riskAmount: data.riskAmount,
        mae: data.mae,
        mfe: data.mfe,
        maePrice: data.maePrice,
        mfePrice: data.mfePrice,
        unrealizedPriceSnapshot: data.unrealizedPriceSnapshot,
        unrealizedPriceSnapshotTime: data.unrealizedPriceSnapshotTime,
        useDirectPnLInput: data.useDirectPnLInput,
        directPnL: data.useDirectPnLInput ? data.directPnL : undefined,
        rebate: data.rebate,
        isMissedTrade: data.isMissedTrade,
        missedReason: data.missedReason,
        isBacktestTrade: data.isBacktestTrade || false,
        customFields: data.customFields,
        currency: data.currency,
        fxRate:
          hasPersistableFxRate || hasPreservableForeignBaseFxRate
            ? data.fxRate
            : undefined,
        fxRateBaseCurrency: hasPersistableFxRate
          ? fxRateBaseCurrency
          : hasPreservableForeignBaseFxRate
            ? data.fxRateBaseCurrency
            : undefined,
        forexQuoteCurrency:
          data.assetType === 'forex' && !data.useDirectPnLInput
            ? data.forexQuoteCurrency
            : undefined,
        forexPnlConversionRate:
          data.assetType === 'forex' && !data.useDirectPnLInput
            ? data.forexPnlConversionRate
            : undefined,
        forexPnlConversionBaseCurrency:
          data.assetType === 'forex' && !data.useDirectPnLInput
            ? data.forexPnlConversionBaseCurrency
            : undefined,
        forexPnlConversionRateDate:
          data.assetType === 'forex' && !data.useDirectPnLInput
            ? data.forexPnlConversionRateDate
            : undefined,
        forexPnlConversionRateSource:
          data.assetType === 'forex' && !data.useDirectPnLInput
            ? data.forexPnlConversionRateSource
            : undefined,
        clearUnsetCurrencyFields: true,
        clearUnsetForexPnlConversionFields: true,
        tradeRating: data.tradeRating,
        
        clearTradeRating:
          initialData?.tradeRating !== undefined &&
          data.tradeRating === undefined,
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
        if (data.pipSize !== undefined) tradeData.pipSize = data.pipSize;
      } else if (data.assetType === 'crypto') {
        if (data.cryptoExchange) tradeData.cryptoExchange = data.cryptoExchange;
      } else if (data.assetType === 'cfd') {
        if (data.contractSize !== undefined)
          tradeData.contractSize = data.contractSize;
        if (data.leverageRatio !== undefined)
          tradeData.leverageRatio = data.leverageRatio;
      }

      if (isEditMode) {
        tradeData.originalPnl = initialData?.pnl;
      }

      const writer = plugin.serviceManager.getTradeNoteWriter();
      const tradeType = data.isBacktestTrade
        ? t('form.trade-type.backtest')
        : isMissedTrade
          ? t('form.trade-type.missed')
          : t('common.trade');
      if (isEditMode) {
        const expectedTradeRevision =
          data.canonicalTradeId &&
          typeof initialData?.tradeRevision === 'number' &&
          Number.isInteger(initialData.tradeRevision) &&
          initialData.tradeRevision > 0
            ? initialData.tradeRevision
            : undefined;
        const receipt = await writer.update({
          path: currentFilePathRef.current,
          previous: { ...initialData },
          next: toRegularTradeData(tradeData),
          sourceType: originalTradeType,
          type: requestedTradeType,
          ...(expectedTradeRevision === undefined
            ? {}
            : { expected: { tradeRevision: expectedTradeRevision } }),
        });
        outPath = receipt.path;
        currentFilePathRef.current = outPath;

        new Notice(
          t('notice.trade-updated', { type: tradeType, path: outPath })
        );
      } else {
        outPath = await writer.create(
          requestedTradeType,
          toRegularTradeData(tradeData),
          { open: true }
        );
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
      return false;
    } finally {
      setIsSubmitting(false);
      submittingRef.current = false;
    }
  };

  const handleCancel = () => onDrawerClose();

  return {
    isSubmitting,
    handleSubmit,
    handleCancel,
  };
}

const TradeFormDrawerContent: React.FC<TradeFormDrawerContentProps> = ({
  ownerDocument,
  submittingRef,
  plugin,
  isEditMode,
  initialData,
  filePath,
  openOptions,
  onDrawerClose,
  onSuccessfulSubmit,
  dirtyStateRef,
  customizationDirtyRef,
  customizationSavingRef,
  onCustomizationBack,
  closeSignal,
}) => {
  const { isSubmitting, handleSubmit, handleCancel } =
    useTradeFormDrawerContentModel({
      submittingRef,
      plugin,
      isEditMode,
      initialData,
      filePath,
      onDrawerClose,
      onSuccessfulSubmit,
    });

  const [page, setPage] = useState<'trade' | 'customise'>('trade');
  const formContainerRef = useRef<HTMLDivElement>(null);
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const formScrollTopRef = useRef<number | null>(null);
  const applyLayoutRef = useRef<
    ((layout: TradeFormLayoutSettings) => void) | null
  >(null);

  const requestBackToTrade = useCallback(async (): Promise<boolean> => {
    if (page === 'trade') return true;
    if (!(await onCustomizationBack()) || closeSignal.aborted) return false;
    customizationDirtyRef.current = null;
    applyLayoutRef.current = null;
    setPage('trade');
    return true;
  }, [page, onCustomizationBack, closeSignal, customizationDirtyRef]);

  const guide = useTradeFormGuide({
    plugin,
    ownerDocument,
    enabled: !isEditMode,
    isCustomizing: page === 'customise',
    onLeaveCustomization: requestBackToTrade,
  });

  const openCustomization = (
    applyLayout: (layout: TradeFormLayoutSettings) => void
  ) => {
    formScrollTopRef.current = formContainerRef.current?.scrollTop ?? 0;
    applyLayoutRef.current = applyLayout;
    setPage('customise');
    guide.customizationOpened();
  };

  const backToTrade = async () => {
    if (await requestBackToTrade()) guide.customizationClosed();
  };

  const saveCustomization = (layout: TradeFormLayoutSettings) => {
    if (closeSignal.aborted) return;
    applyLayoutRef.current?.(layout);
    applyLayoutRef.current = null;
    customizationDirtyRef.current = null;
    setPage('trade');
    guide.customizationClosed();
  };

  
  
  useLayoutEffect(() => {
    if (page === 'customise') {
      backButtonRef.current?.focus({ preventScroll: true });
    } else if (formContainerRef.current && formScrollTopRef.current !== null) {
      formContainerRef.current.scrollTop = formScrollTopRef.current;
      formContainerRef.current
        .querySelector<HTMLElement>(
          '[data-journalit-guide-target="trade-form.customize-button"]'
        )
        ?.focus({ preventScroll: true });
    }
  }, [page]);

  return (
    <Drawer
      title={t(
        page === 'customise'
          ? 'form.layout.modal-title'
          : isEditMode
            ? 'button.update-trade'
            : 'command.add-trade'
      )}
      ownerDocument={ownerDocument}
      overlayClassName="journalit-trade-form-drawer"
      onClose={() => void onDrawerClose()}
      onEscape={() => {
        if (page === 'customise') void backToTrade();
        else void onDrawerClose();
      }}
      headerStart={
        page === 'customise' ? (
          <Button
            ref={backButtonRef}
            type="button"
            variant="plain"
            className="journalit-trade-form-back"
            onClick={() => void backToTrade()}
          >
            <ChevronLeft size={16} aria-hidden="true" />
            {t('form.layout.back-to-trade')}
          </Button>
        ) : undefined
      }
    >
      <div
        ref={formContainerRef}
        className="trade-form-view-container trade-form"
        hidden={page !== 'trade'}
        inert={page !== 'trade'}
        aria-hidden={page !== 'trade'}
      >
        <TradeForm
          initialData={initialData}
          initialTab={openOptions?.initialTab}
          isSubmitting={isSubmitting}
          isEditMode={isEditMode}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          dirtyStateRef={dirtyStateRef}
          active={page === 'trade'}
          onOpenCustomization={openCustomization}
        />
      </div>
      {page === 'customise' && (
        <section
          className="journalit-trade-form-customization-page"
          data-journalit-guide-target="trade-form.customization-page"
        >
          <TradeFormLayoutEditor
            plugin={plugin}
            dirtyStateRef={customizationDirtyRef}
            savingStateRef={customizationSavingRef}
            onSave={saveCustomization}
            onCancel={() => void backToTrade()}
            saveLabel={t('form.layout.save-layout')}
          />
        </section>
      )}
      {!isEditMode && (
        <TradeFormGuide ownerDocument={ownerDocument} model={guide} />
      )}
    </Drawer>
  );
};
