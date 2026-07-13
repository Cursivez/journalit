import {
  MarkdownView,
  OpenViewState,
  PaneType,
  TFile,
  ViewState,
  ViewStateResult,
  Workspace,
  WorkspaceLeaf,
  normalizePath,
} from 'obsidian';
import { logger } from '../utils/logger';


import JournalitPlugin from '../main';
import { DASHBOARD_VIEW_TYPE, DashboardView } from '../components/dashboard';
import { AccountDashboardView } from './AccountDashboardView';
import { TRADE_LOG_VIEW_TYPE, TradeLogView } from './TradeLogView';
import { ACCOUNT_PAGE_VIEW_TYPE, AccountPageView } from './AccountPageView';
import { HOME_VIEW_TYPE, HomeView } from './HomeView';
import { CSV_IMPORT_VIEW_TYPE, CSVImportView } from './CSVImportView';
import { OnboardingView, ONBOARDING_VIEW_TYPE } from './OnboardingView';
import {
  TEMPLATE_BUILDER_VIEW_TYPE,
  TemplateBuilderView,
} from './TemplateBuilderView';
import { NAVIGATION_VIEW_TYPE, NavigationView } from './NavigationView';
import { SETUPS_VIEW_TYPE, SetupsView } from './SetupsView';
import {
  CALENDAR_SIDEBAR_VIEW_TYPE,
  CalendarSidebarView,
} from './CalendarSidebarView';
import { SESSION_MODE_VIEW_TYPE, SessionModeView } from './SessionModeView';
import { TradeFormModal } from '../components/forms/trade/TradeFormModal';
import {
  TradeFormData,
  TradeFormOpenOptions,
} from '../components/forms/trade/types';
import { t } from '../lang/helpers';
import type { SetupsViewState } from '../components/setups/setupsViewTypes';


const ACCOUNT_DASHBOARD_VIEW_TYPE = 'account-dashboard';

type WorkspaceLeafSetViewState = (
  this: WorkspaceLeaf,
  state: ViewState,
  result?: ViewStateResult
) => Promise<void>;

type WorkspaceLeafOpenFile = (
  this: WorkspaceLeaf,
  file: TFile,
  openState?: OpenViewState
) => Promise<void>;

type WorkspaceOpenLinkText = (
  this: Workspace,
  linktext: string,
  sourcePath: string,
  newLeaf?: PaneType | boolean,
  openViewState?: OpenViewState
) => Promise<void>;

interface KeyboardScopeAwareView {
  syncActiveKeyboardScope(): void;
}

interface SetupFileOpenOptions {
  leaf?: WorkspaceLeaf | null;
  openState?: OpenViewState;
  honorRequestedLeaf?: boolean;
}

interface SetupsViewOpenOptions {
  newTab?: boolean;
  focusLeaf?: boolean;
}

function isKeyboardScopeAwareView(
  view: WorkspaceLeaf['view']
): view is WorkspaceLeaf['view'] & KeyboardScopeAwareView {
  return (
    'syncActiveKeyboardScope' in view &&
    typeof view.syncActiveKeyboardScope === 'function'
  );
}

export function setupViewStateMatchesFile(
  state: SetupsViewState,
  filePath: string
): boolean {
  return state.page === 'detail' && state.setupPath === filePath;
}

export class ViewManager {
  private static instance: ViewManager | null;

  private plugin: JournalitPlugin;

  
  private registeredViews: Set<string> = new Set();
  private markdownOpenSuppression = new WeakMap<
    WorkspaceLeaf,
    Map<string, number>
  >();
  private explicitMarkdownOpenPaths = new WeakMap<WorkspaceLeaf, string>();
  private explicitMarkdownOpenGeneration = new WeakMap<WorkspaceLeaf, number>();
  private pendingExplicitMarkdownOpens = new WeakMap<
    WorkspaceLeaf,
    { generation: number; setupPath: string }
  >();
  private interruptedExplicitMarkdownStates = new WeakMap<
    WorkspaceLeaf,
    ViewState
  >();
  private setupMarkdownInterceptorRegistered = false;

  private constructor(plugin: JournalitPlugin) {
    this.plugin = plugin;
  }

  
  public static getInstance(plugin: JournalitPlugin): ViewManager {
    if (!ViewManager.instance) {
      ViewManager.instance = new ViewManager(plugin);
    }
    return ViewManager.instance;
  }

  public registerSetupMarkdownOpenInterceptor(): void {
    if (this.setupMarkdownInterceptorRegistered) return;
    this.setupMarkdownInterceptorRegistered = true;

    const originalSetViewState: WorkspaceLeafSetViewState =
      // eslint-disable-next-line @typescript-eslint/unbound-method -- Capture Obsidian's original method so the setup-file view redirect can delegate with the original leaf receiver.
      WorkspaceLeaf.prototype.setViewState;
    const originalOpenFile: WorkspaceLeafOpenFile =
      // eslint-disable-next-line @typescript-eslint/unbound-method -- Capture Obsidian's original method before installing setup-file routing.
      WorkspaceLeaf.prototype.openFile;
    const originalOpenLinkText: WorkspaceOpenLinkText =
      // eslint-disable-next-line @typescript-eslint/unbound-method -- Capture Obsidian's original method before installing setup-file routing.
      Workspace.prototype.openLinkText;
    const workspace = this.plugin.app.workspace;
    const originalWorkspaceOpenLinkText: WorkspaceOpenLinkText =
      // eslint-disable-next-line @typescript-eslint/unbound-method -- Capture Obsidian's instance method because some app builds bind workspace methods per instance.
      workspace.openLinkText;
    const redirectSetupMarkdownViewState = (
      leaf: WorkspaceLeaf,
      state: ViewState
    ): ViewState => this.redirectSetupMarkdownViewState(leaf, state);
    const recordInterruptedExplicitMarkdownState = (
      leaf: WorkspaceLeaf,
      state: ViewState
    ): void => this.recordInterruptedExplicitMarkdownState(leaf, state);
    const maybeOpenSetupFileFromNativeOpen = (
      file: TFile,
      options?: SetupFileOpenOptions
    ): Promise<boolean> => this.maybeOpenSetupFileFromNativeOpen(file, options);
    const resolveSetupLinkTarget = (
      linktext: string,
      sourcePath: string
    ): TFile | null => this.resolveSetupLinkTarget(linktext, sourcePath);
    const isSetupFileFromCache = (file: TFile): boolean =>
      this.isSetupFileFromCache(file);

    WorkspaceLeaf.prototype.setViewState = function (
      this: WorkspaceLeaf,
      state: ViewState,
      result?: ViewStateResult
    ): Promise<void> {
      const redirectedState = redirectSetupMarkdownViewState(this, state);
      recordInterruptedExplicitMarkdownState(this, redirectedState);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- Delegates to Obsidian's captured setViewState implementation after replacing setup markdown states.
      return originalSetViewState.call(this, redirectedState, result);
    };

    WorkspaceLeaf.prototype.openFile = async function (
      this: WorkspaceLeaf,
      file: TFile,
      openState?: OpenViewState
    ): Promise<void> {
      if (
        await maybeOpenSetupFileFromNativeOpen(file, {
          leaf: this,
          openState,
          honorRequestedLeaf: true,
        })
      )
        return;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- Delegates to Obsidian's captured openFile implementation for non-setup files.
      return originalOpenFile.call(this, file, openState);
    };

    const openSetupLinkText = async function (
      this: Workspace,
      linktext: string,
      sourcePath: string,
      newLeaf?: PaneType | boolean,
      openViewState?: OpenViewState
    ): Promise<void> {
      const file = resolveSetupLinkTarget(linktext, sourcePath);
      if (file && isSetupFileFromCache(file)) {
        const honorRequestedLeaf =
          newLeaf !== undefined || openViewState !== undefined;
        const requestedLeaf = honorRequestedLeaf ? this.getLeaf(newLeaf) : null;
        if (
          await maybeOpenSetupFileFromNativeOpen(file, {
            leaf: requestedLeaf,
            openState: openViewState,
            honorRequestedLeaf,
          })
        )
          return;
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- Delegates to Obsidian's captured openLinkText implementation for non-setup links.
      return originalOpenLinkText.call(
        this,
        linktext,
        sourcePath,
        newLeaf,
        openViewState
      );
    };

    Workspace.prototype.openLinkText = openSetupLinkText;
    workspace.openLinkText = (
      linktext: string,
      sourcePath: string,
      newLeaf?: PaneType | boolean,
      openViewState?: OpenViewState
    ): Promise<void> =>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- Delegates to the typed setup-link wrapper with the workspace instance receiver.
      openSetupLinkText.call(
        workspace,
        linktext,
        sourcePath,
        newLeaf,
        openViewState
      );

    this.plugin.register(() => {
      WorkspaceLeaf.prototype.setViewState = originalSetViewState;
      WorkspaceLeaf.prototype.openFile = originalOpenFile;
      Workspace.prototype.openLinkText = originalOpenLinkText;
      workspace.openLinkText = originalWorkspaceOpenLinkText;
      this.setupMarkdownInterceptorRegistered = false;
    });
  }

  private resolveSetupLinkTarget(
    linktext: string,
    sourcePath: string
  ): TFile | null {
    const linkedFile = this.plugin.app.metadataCache.getFirstLinkpathDest(
      linktext,
      sourcePath
    );
    if (linkedFile instanceof TFile) return linkedFile;

    const normalizedLink = normalizePath(linktext.split('#', 1)[0] ?? '');
    const directFile = this.plugin.app.vault.getAbstractFileByPath(
      normalizedLink.endsWith('.md') ? normalizedLink : `${normalizedLink}.md`
    );
    return directFile instanceof TFile ? directFile : null;
  }

  private async maybeOpenSetupFileFromNativeOpen(
    file: TFile,
    options: SetupFileOpenOptions = {}
  ): Promise<boolean> {
    const { leaf } = options;
    if (leaf && this.isExplicitMarkdownOpen(leaf, file.path)) return false;
    if (leaf && this.isMarkdownOpenSuppressed(leaf, file.path)) return false;
    this.clearExplicitMarkdownOpen(leaf);
    if (!this.isSetupFileFromCache(file)) return false;

    await this.openCachedSetupFileAsSetupsView(file, options);
    return true;
  }

  private async openCachedSetupFileAsSetupsView(
    file: TFile,
    options: SetupFileOpenOptions = {}
  ): Promise<void> {
    const { leaf, openState, honorRequestedLeaf } = options;
    const setupState = {
      page: 'detail' as const,
      setupId: file.basename,
      setupName: file.basename,
      setupPath: file.path,
    };

    if (honorRequestedLeaf && leaf) {
      const viewState: ViewState = {
        type: SETUPS_VIEW_TYPE,
        active: openState?.active ?? true,
        state: { ...openState?.state, ...setupState },
      };
      if (openState?.group) viewState.group = openState.group;
      await leaf.setViewState(viewState, openState?.eState);
      if (viewState.active !== false) {
        this.plugin.app.workspace.setActiveLeaf(leaf, { focus: true });
      }
      this.syncGuideContextForLeaf(leaf);
      return;
    }

    const existingLeaf = this.findOpenSetupLeaf(file.path, leaf);
    if (existingLeaf) {
      this.plugin.app.workspace.setActiveLeaf(existingLeaf, { focus: true });
      this.syncGuideContextForLeaf(existingLeaf);
      if (leaf && leaf !== existingLeaf) {
        leaf.detach();
      }
      return;
    }

    const reusableSetupsLeaf = this.findReusableSetupsLeaf();
    const targetLeaf =
      leaf?.view instanceof SetupsView ||
      !(reusableSetupsLeaf.view instanceof SetupsView)
        ? (leaf ?? reusableSetupsLeaf)
        : reusableSetupsLeaf;
    if (targetLeaf.view instanceof SetupsView) {
      targetLeaf.view.setSetupsState(setupState);
      this.plugin.app.workspace.setActiveLeaf(targetLeaf, { focus: true });
      this.syncGuideContextForLeaf(targetLeaf);
      if (leaf && leaf !== targetLeaf) {
        leaf.detach();
      }
      return;
    }

    await targetLeaf.setViewState({
      type: SETUPS_VIEW_TYPE,
      active: true,
      state: setupState,
    });
    this.plugin.app.workspace.setActiveLeaf(targetLeaf, { focus: true });
    this.syncGuideContextForLeaf(targetLeaf);
  }

  private redirectSetupMarkdownViewState(
    leaf: WorkspaceLeaf,
    state: ViewState
  ): ViewState {
    if (state.type !== 'markdown' || !this.isRecord(state.state)) {
      this.clearExplicitMarkdownOpen(leaf);
      return state;
    }

    const filePath = state.state.file;
    if (typeof filePath !== 'string' || !filePath) {
      this.clearExplicitMarkdownOpen(leaf);
      return state;
    }
    if (this.isExplicitMarkdownOpen(leaf, filePath)) return state;
    if (this.isMarkdownOpenSuppressed(leaf, filePath)) return state;
    this.clearExplicitMarkdownOpen(leaf);

    const file = this.plugin.app.vault.getAbstractFileByPath(filePath);
    if (!(file instanceof TFile) || !this.isSetupFileFromCache(file)) {
      return state;
    }

    const existingLeaf = this.findOpenSetupLeaf(file.path, leaf);
    if (existingLeaf) {
      window.setTimeout(() => {
        void this.revealExistingSetupLeafAndDetachDuplicate(existingLeaf, leaf);
      }, 0);
    }

    const setupState = {
      page: 'detail' as const,
      setupId: file.basename,
      setupName: file.basename,
      setupPath: file.path,
    };

    if (leaf.view instanceof SetupsView) {
      leaf.view.setSetupsState(setupState);
    }

    return {
      ...state,
      type: SETUPS_VIEW_TYPE,
      state: setupState,
    };
  }

  private isSetupFileFromCache(file: TFile): boolean {
    const cache = this.plugin.app.metadataCache.getFileCache(file);
    return cache?.frontmatter?.['journalit-setup'] === true;
  }

  private findOpenSetupLeaf(
    filePath: string,
    excludeLeaf?: WorkspaceLeaf | null
  ): WorkspaceLeaf | null {
    const setupLeaves =
      this.plugin.app.workspace.getLeavesOfType(SETUPS_VIEW_TYPE);

    for (const leaf of setupLeaves) {
      if (leaf === excludeLeaf) continue;
      const view = leaf.view;
      if (!(view instanceof SetupsView)) continue;
      const state = view.getSetupsState();
      if (setupViewStateMatchesFile(state, filePath)) {
        return leaf;
      }
    }

    return null;
  }

  private async revealExistingSetupLeafAndDetachDuplicate(
    existingLeaf: WorkspaceLeaf,
    duplicateLeaf: WorkspaceLeaf
  ): Promise<void> {
    this.syncGuideContextForLeaf(existingLeaf);
    await Promise.resolve(this.plugin.app.workspace.revealLeaf(existingLeaf));
    this.plugin.app.workspace.setActiveLeaf(existingLeaf, { focus: true });
    this.syncGuideContextForLeaf(existingLeaf);

    if (duplicateLeaf !== existingLeaf) {
      duplicateLeaf.detach();
    }
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
  }

  private isMarkdownOpenSuppressed(
    leaf: WorkspaceLeaf,
    filePath: string
  ): boolean {
    return (this.markdownOpenSuppression.get(leaf)?.get(filePath) ?? 0) > 0;
  }

  private isExplicitMarkdownOpen(
    leaf: WorkspaceLeaf,
    filePath: string
  ): boolean {
    return this.explicitMarkdownOpenPaths.get(leaf) === filePath;
  }

  private clearExplicitMarkdownOpen(
    leaf: WorkspaceLeaf | null | undefined
  ): void {
    if (!leaf) return;
    this.explicitMarkdownOpenPaths.delete(leaf);
    this.explicitMarkdownOpenGeneration.set(
      leaf,
      (this.explicitMarkdownOpenGeneration.get(leaf) ?? 0) + 1
    );
  }

  private beginExplicitMarkdownOpen(
    leaf: WorkspaceLeaf,
    setupPath: string
  ): number {
    const generation = (this.explicitMarkdownOpenGeneration.get(leaf) ?? 0) + 1;
    this.explicitMarkdownOpenGeneration.set(leaf, generation);
    this.pendingExplicitMarkdownOpens.set(leaf, { generation, setupPath });
    this.interruptedExplicitMarkdownStates.delete(leaf);
    return generation;
  }

  private recordInterruptedExplicitMarkdownState(
    leaf: WorkspaceLeaf,
    state: ViewState
  ): void {
    const pending = this.pendingExplicitMarkdownOpens.get(leaf);
    if (!pending) return;
    const filePath = this.isRecord(state.state) ? state.state.file : undefined;
    if (state.type === 'markdown' && filePath === pending.setupPath) return;
    this.interruptedExplicitMarkdownStates.set(leaf, state);
  }

  private suppressMarkdownOpen(leaf: WorkspaceLeaf, filePath: string): void {
    const suppressedFiles =
      this.markdownOpenSuppression.get(leaf) ?? new Map<string, number>();
    suppressedFiles.set(filePath, (suppressedFiles.get(filePath) ?? 0) + 1);
    this.markdownOpenSuppression.set(leaf, suppressedFiles);
  }

  private clearMarkdownOpenSuppression(
    leaf: WorkspaceLeaf | null | undefined,
    filePath: string
  ): void {
    if (!leaf) return;
    const suppressedFiles = this.markdownOpenSuppression.get(leaf);
    const count = suppressedFiles?.get(filePath) ?? 0;
    if (count <= 1) {
      suppressedFiles?.delete(filePath);
    } else {
      suppressedFiles?.set(filePath, count - 1);
    }
  }

  private trackRecentView(viewType: string, label: string, icon: string): void {
    if (typeof this.plugin.trackRecentView === 'function') {
      this.plugin.trackRecentView(viewType, label, icon);
    }
  }

  private syncGuideContextForLeaf(leaf: WorkspaceLeaf): void {
    this.plugin.viewGuideService?.syncWorkspaceContext(leaf);
    const view = leaf.view;
    if (isKeyboardScopeAwareView(view)) {
      view.syncActiveKeyboardScope();
    }
  }

  private getRecentViewMeta(
    viewType: string
  ): { label: string; icon: string } | undefined {
    switch (viewType) {
      case DASHBOARD_VIEW_TYPE:
        return { label: t('view.dashboard'), icon: 'grip' };
      case ACCOUNT_DASHBOARD_VIEW_TYPE:
        return { label: t('view.account-dashboard'), icon: 'users' };
      case TRADE_LOG_VIEW_TYPE:
        return { label: t('view.trade-log'), icon: 'folder-tree' };
      case CSV_IMPORT_VIEW_TYPE:
        return { label: t('view.csv-import'), icon: 'import' };
      case ONBOARDING_VIEW_TYPE:
        return { label: t('onboarding.view.title'), icon: 'circle-dot-dashed' };
      case TEMPLATE_BUILDER_VIEW_TYPE:
        return { label: t('view.layout-builder'), icon: 'lucide-blocks' };
      case SETUPS_VIEW_TYPE:
        return {
          label: t('settings.customization.setups'),
          icon: 'flask-conical',
        };
      default:
        return undefined;
    }
  }

  private async ensureViewRegistered(viewType: string): Promise<void> {
    switch (viewType) {
      case HOME_VIEW_TYPE:
        await this.registerHomeView();
        return;
      case DASHBOARD_VIEW_TYPE:
        await this.registerDashboardView();
        return;
      case ACCOUNT_DASHBOARD_VIEW_TYPE:
        await this.registerAccountDashboardView();
        return;
      case TRADE_LOG_VIEW_TYPE:
        await this.registerTradeLogView();
        return;
      case CSV_IMPORT_VIEW_TYPE:
        await this.registerCSVImportView();
        return;
      case ONBOARDING_VIEW_TYPE:
        await this.registerOnboardingView();
        return;
      case TEMPLATE_BUILDER_VIEW_TYPE:
        await this.registerTemplateBuilderView();
        return;
      case SETUPS_VIEW_TYPE:
        await this.registerSetupsView();
        return;
      case ACCOUNT_PAGE_VIEW_TYPE:
        await this.registerAccountPageView();
        return;
      case NAVIGATION_VIEW_TYPE:
        await this.registerNavigationView();
        return;
      case CALENDAR_SIDEBAR_VIEW_TYPE:
        await this.registerCalendarSidebarView();
        return;
      case SESSION_MODE_VIEW_TYPE:
        await this.registerSessionModeView();
        return;
      default:
        return;
    }
  }

  
  private async revealExistingFunctionalLeaf(
    viewType: string,
    recentView?: { label: string; icon: string },
    focusLeaf: boolean = true
  ): Promise<boolean> {
    const existingLeaves = this.plugin.app.workspace.getLeavesOfType(viewType);
    let functionalLeaf: (typeof existingLeaves)[number] | undefined;

    for (const leaf of existingLeaves) {
      const view = leaf.view;
      if (view && view.getViewType() === viewType) {
        functionalLeaf = leaf;
        break;
      }

      logger.debug(
        `[Journalit] Detaching broken restored leaf for ${viewType}`
      );
      leaf.detach();
    }

    if (functionalLeaf) {
      this.syncGuideContextForLeaf(functionalLeaf);
      await Promise.resolve(
        this.plugin.app.workspace.revealLeaf(functionalLeaf)
      );
      this.plugin.app.workspace.setActiveLeaf(functionalLeaf, {
        focus: focusLeaf,
      });
      this.syncGuideContextForLeaf(functionalLeaf);
      if (recentView) {
        this.trackRecentView(viewType, recentView.label, recentView.icon);
      }
      return true;
    }

    return false;
  }

  
  public async registerDashboardView(): Promise<void> {
    if (this.registeredViews.has(DASHBOARD_VIEW_TYPE)) {
      return;
    }

    try {
      const existingLeaves =
        this.plugin.app.workspace.getLeavesOfType(DASHBOARD_VIEW_TYPE);
      if (existingLeaves.length > 0) {
        logger.debug(
          '[Journalit] Preserving existing dashboard view leaves during registration'
        );
      }

      
      this.plugin.registerView(
        DASHBOARD_VIEW_TYPE,
        (leaf) => new DashboardView(leaf)
      );

      this.registeredViews.add(DASHBOARD_VIEW_TYPE);
      logger.debug('[Journalit] Dashboard view registered successfully');
    } catch (error) {
      console.error('[Journalit] Failed to register dashboard view:', error);
    }
  }

  
  public async registerAccountDashboardView(): Promise<void> {
    if (this.registeredViews.has(ACCOUNT_DASHBOARD_VIEW_TYPE)) {
      return;
    }

    try {
      const existingLeaves = this.plugin.app.workspace.getLeavesOfType(
        ACCOUNT_DASHBOARD_VIEW_TYPE
      );
      if (existingLeaves.length > 0) {
        logger.debug(
          '[Journalit] Preserving existing account dashboard view leaves during registration'
        );
      }

      
      this.plugin.registerView(
        ACCOUNT_DASHBOARD_VIEW_TYPE,
        (leaf) => new AccountDashboardView(leaf, this.plugin)
      );

      this.registeredViews.add(ACCOUNT_DASHBOARD_VIEW_TYPE);
      logger.debug(
        '[Journalit] Account dashboard view registered successfully'
      );
    } catch (error) {
      console.error(
        '[Journalit] Failed to register account dashboard view:',
        error
      );
    }
  }

  
  public async registerTradeLogView(): Promise<void> {
    if (this.registeredViews.has(TRADE_LOG_VIEW_TYPE)) {
      return;
    }

    try {
      const existingLeaves =
        this.plugin.app.workspace.getLeavesOfType(TRADE_LOG_VIEW_TYPE);
      if (existingLeaves.length > 0) {
        logger.debug(
          '[Journalit] Preserving existing trade log view leaves during registration'
        );
      }

      
      this.plugin.registerView(
        TRADE_LOG_VIEW_TYPE,
        (leaf) => new TradeLogView(leaf, this.plugin)
      );

      this.registeredViews.add(TRADE_LOG_VIEW_TYPE);
      logger.debug('[Journalit] Trade log view registered successfully');
    } catch (error) {
      console.error('[Journalit] Failed to register trade log view:', error);
    }
  }

  
  public async registerHomeView(): Promise<void> {
    
    if (this.registeredViews.has(HOME_VIEW_TYPE)) {
      return;
    }

    try {
      const existingLeaves =
        this.plugin.app.workspace.getLeavesOfType(HOME_VIEW_TYPE);
      if (existingLeaves.length > 0) {
        logger.debug(
          '[Journalit] Preserving existing home view leaves during registration'
        );
      }

      
      this.plugin.registerView(
        HOME_VIEW_TYPE,
        (leaf) => new HomeView(leaf, this.plugin)
      );

      
      this.registeredViews.add(HOME_VIEW_TYPE);
      logger.debug('[Journalit] Home view registered successfully');
    } catch (error) {
      console.error('[Journalit] Failed to register home view:', error);
      
    }
  }

  
  public async registerCSVImportView(): Promise<void> {
    if (this.registeredViews.has(CSV_IMPORT_VIEW_TYPE)) {
      return;
    }

    try {
      const existingLeaves =
        this.plugin.app.workspace.getLeavesOfType(CSV_IMPORT_VIEW_TYPE);
      if (existingLeaves.length > 0) {
        logger.debug(
          '[Journalit] Preserving existing CSV import view leaves during registration'
        );
      }

      
      this.plugin.registerView(
        CSV_IMPORT_VIEW_TYPE,
        (leaf) => new CSVImportView(leaf, this.plugin)
      );

      this.registeredViews.add(CSV_IMPORT_VIEW_TYPE);
    } catch (e) {
      console.error('Error registering CSV import view:', e);
    }
  }

  
  public async registerOnboardingView(): Promise<void> {
    if (this.registeredViews.has(ONBOARDING_VIEW_TYPE)) {
      return;
    }

    try {
      const existingLeaves =
        this.plugin.app.workspace.getLeavesOfType(ONBOARDING_VIEW_TYPE);
      if (existingLeaves.length > 0) {
        logger.debug(
          '[Journalit] Preserving existing onboarding view leaves during registration'
        );
      }

      
      this.plugin.registerView(
        ONBOARDING_VIEW_TYPE,
        (leaf) => new OnboardingView(leaf, this.plugin)
      );

      this.registeredViews.add(ONBOARDING_VIEW_TYPE);
      logger.debug('[Journalit] Onboarding view registered successfully');
    } catch (error) {
      console.error('[Journalit] Failed to register onboarding view:', error);
    }
  }

  
  public async registerTradeFormView(): Promise<void> {
    return;
  }

  
  public async openDashboardView(): Promise<void> {
    
    await this.registerDashboardView();

    if (
      await this.revealExistingFunctionalLeaf(DASHBOARD_VIEW_TYPE, {
        label: t('view.dashboard'),
        icon: 'grip',
      })
    ) {
      return;
    }

    
    const leaf = this.plugin.app.workspace.getLeaf('tab');

    if (leaf) {
      
      await leaf.setViewState({
        type: DASHBOARD_VIEW_TYPE,
        active: true,
      });

      this.syncGuideContextForLeaf(leaf);

      
      await Promise.resolve(this.plugin.app.workspace.revealLeaf(leaf));
      this.syncGuideContextForLeaf(leaf);

      this.trackRecentView(DASHBOARD_VIEW_TYPE, t('view.dashboard'), 'grip');
    }
  }

  
  public async openAccountDashboardView(): Promise<void> {
    
    await this.registerAccountDashboardView();

    if (
      await this.revealExistingFunctionalLeaf(ACCOUNT_DASHBOARD_VIEW_TYPE, {
        label: t('view.account-dashboard'),
        icon: 'users',
      })
    ) {
      return;
    }

    
    const leaf = this.plugin.app.workspace.getLeaf('tab');

    if (leaf) {
      
      await leaf.setViewState({
        type: ACCOUNT_DASHBOARD_VIEW_TYPE,
        active: true,
      });

      this.syncGuideContextForLeaf(leaf);

      
      await Promise.resolve(this.plugin.app.workspace.revealLeaf(leaf));
      this.syncGuideContextForLeaf(leaf);

      this.trackRecentView(
        ACCOUNT_DASHBOARD_VIEW_TYPE,
        t('view.account-dashboard'),
        'users'
      );
    }
  }

  
  public async openTradeLogView(): Promise<void> {
    
    await this.registerTradeLogView();

    if (
      await this.revealExistingFunctionalLeaf(TRADE_LOG_VIEW_TYPE, {
        label: t('view.trade-log'),
        icon: 'folder-tree',
      })
    ) {
      return;
    }

    
    const leaf = this.plugin.app.workspace.getLeaf('tab');

    if (leaf) {
      
      await leaf.setViewState({
        type: TRADE_LOG_VIEW_TYPE,
        active: true,
      });

      this.syncGuideContextForLeaf(leaf);

      
      await Promise.resolve(this.plugin.app.workspace.revealLeaf(leaf));
      this.syncGuideContextForLeaf(leaf);

      this.trackRecentView(
        TRADE_LOG_VIEW_TYPE,
        t('view.trade-log'),
        'folder-tree'
      );
    }
  }

  public async openNewTradeLogView(): Promise<void> {
    await this.registerTradeLogView();

    const leaf = this.plugin.app.workspace.getLeaf('tab');
    if (!leaf) {
      return;
    }

    await leaf.setViewState({
      type: TRADE_LOG_VIEW_TYPE,
      active: true,
    });

    this.syncGuideContextForLeaf(leaf);
    await Promise.resolve(this.plugin.app.workspace.revealLeaf(leaf));
    this.syncGuideContextForLeaf(leaf);

    this.trackRecentView(
      TRADE_LOG_VIEW_TYPE,
      t('view.trade-log'),
      'folder-tree'
    );
  }

  public async reloadOrOpenTradeLogView(): Promise<void> {
    await this.registerTradeLogView();

    const [existingLeaf] =
      this.plugin.app.workspace.getLeavesOfType(TRADE_LOG_VIEW_TYPE);
    if (!existingLeaf) {
      await this.openTradeLogView();
      return;
    }

    await existingLeaf.setViewState({
      type: TRADE_LOG_VIEW_TYPE,
      active: true,
    });

    this.syncGuideContextForLeaf(existingLeaf);
    await Promise.resolve(this.plugin.app.workspace.revealLeaf(existingLeaf));
    this.syncGuideContextForLeaf(existingLeaf);

    this.trackRecentView(
      TRADE_LOG_VIEW_TYPE,
      t('view.trade-log'),
      'folder-tree'
    );
  }

  
  public async openHomeView(): Promise<void> {
    
    await this.registerHomeView();

    if (await this.revealExistingFunctionalLeaf(HOME_VIEW_TYPE)) {
      return;
    }

    
    const leaf = this.plugin.app.workspace.getLeaf('tab');

    if (leaf) {
      try {
        
        await leaf.setViewState({
          type: HOME_VIEW_TYPE,
          active: true,
        });

        this.syncGuideContextForLeaf(leaf);

        
        await Promise.resolve(this.plugin.app.workspace.revealLeaf(leaf));
        this.syncGuideContextForLeaf(leaf);

        
        
      } catch (error) {
        console.error('[Journalit] Failed to open home view:', error);
        throw error;
      }
    }
  }

  
  public async openCSVImportView(): Promise<void> {
    await this.registerCSVImportView();

    if (
      await this.revealExistingFunctionalLeaf(CSV_IMPORT_VIEW_TYPE, {
        label: t('view.csv-import'),
        icon: 'import',
      })
    ) {
      return;
    }

    const leaf = this.plugin.app.workspace.getLeaf('tab');
    if (leaf) {
      await leaf.setViewState({
        type: CSV_IMPORT_VIEW_TYPE,
        active: true,
      });
      this.syncGuideContextForLeaf(leaf);
      await Promise.resolve(this.plugin.app.workspace.revealLeaf(leaf));
      this.syncGuideContextForLeaf(leaf);

      this.trackRecentView(
        CSV_IMPORT_VIEW_TYPE,
        t('view.csv-import'),
        'import'
      );
    }
  }

  
  public async openOnboardingView(): Promise<void> {
    
    await this.registerOnboardingView();

    if (
      await this.revealExistingFunctionalLeaf(ONBOARDING_VIEW_TYPE, {
        label: t('onboarding.view.title'),
        icon: 'circle-dot-dashed',
      })
    ) {
      return;
    }

    
    const leaf = this.plugin.app.workspace.getLeaf('tab');

    if (leaf) {
      
      await leaf.setViewState({
        type: ONBOARDING_VIEW_TYPE,
        active: true,
      });

      this.syncGuideContextForLeaf(leaf);

      
      await Promise.resolve(this.plugin.app.workspace.revealLeaf(leaf));
      this.syncGuideContextForLeaf(leaf);

      this.trackRecentView(
        ONBOARDING_VIEW_TYPE,
        t('onboarding.view.title'),
        'circle-dot-dashed'
      );
    }
  }

  
  public async registerAccountPageView(): Promise<void> {
    if (this.registeredViews.has(ACCOUNT_PAGE_VIEW_TYPE)) {
      return;
    }

    try {
      const existingLeaves = this.plugin.app.workspace.getLeavesOfType(
        ACCOUNT_PAGE_VIEW_TYPE
      );
      if (existingLeaves.length > 0) {
        logger.debug(
          '[Journalit] Preserving existing account page view leaves during registration'
        );
      }

      
      this.plugin.registerView(
        ACCOUNT_PAGE_VIEW_TYPE,
        (leaf) => new AccountPageView(leaf)
      );

      this.registeredViews.add(ACCOUNT_PAGE_VIEW_TYPE);
      logger.debug('[Journalit] Account page view registered successfully');
    } catch (error) {
      console.error('[Journalit] Failed to register account page view:', error);
    }
  }

  
  public async openAccountPageView(accountName: string): Promise<void> {
    
    await this.registerAccountPageView();

    
    const existing = this.plugin.app.workspace.getLeavesOfType(
      ACCOUNT_PAGE_VIEW_TYPE
    );
    let matchingLeaf: (typeof existing)[number] | undefined;
    for (const leaf of existing) {
      const view = leaf.view;
      
      if (
        view instanceof AccountPageView &&
        typeof view.getAccountName === 'function'
      ) {
        if (view.getAccountName() === accountName) {
          matchingLeaf = leaf;
          break;
        }
      }
    }

    if (matchingLeaf) {
      this.syncGuideContextForLeaf(matchingLeaf);
      await Promise.resolve(this.plugin.app.workspace.revealLeaf(matchingLeaf));
      this.syncGuideContextForLeaf(matchingLeaf);
      
      if (typeof this.plugin.trackRecentView === 'function') {
        this.plugin.trackRecentView(
          ACCOUNT_PAGE_VIEW_TYPE,
          `Account: ${accountName}`,
          'user'
        );
      }
      return;
    }

    
    const leaf = this.plugin.app.workspace.getLeaf('tab');

    if (leaf) {
      
      await leaf.setViewState({
        type: ACCOUNT_PAGE_VIEW_TYPE,
        active: true,
        state: {
          accountName: accountName,
        },
      });

      this.syncGuideContextForLeaf(leaf);

      
      await Promise.resolve(this.plugin.app.workspace.revealLeaf(leaf));
      this.syncGuideContextForLeaf(leaf);

      
      if (typeof this.plugin.trackRecentView === 'function') {
        this.plugin.trackRecentView(
          ACCOUNT_PAGE_VIEW_TYPE,
          `Account: ${accountName}`,
          'user'
        );
      }
    }
  }

  
  public async renameAccountPageViews(
    oldAccountName: string,
    newAccountName: string
  ): Promise<void> {
    await this.registerAccountPageView();

    const existing = this.plugin.app.workspace.getLeavesOfType(
      ACCOUNT_PAGE_VIEW_TYPE
    );

    for (const leaf of existing) {
      const view = leaf.view;
      if (
        view instanceof AccountPageView &&
        typeof view.getAccountName === 'function'
      ) {
        if (view.getAccountName() === oldAccountName) {
          await leaf.setViewState({
            type: ACCOUNT_PAGE_VIEW_TYPE,
            active: true,
            state: {
              accountName: newAccountName,
            },
          });

          const updatedView = leaf.view;
          if (
            updatedView instanceof AccountPageView &&
            typeof updatedView.setAccountName === 'function'
          ) {
            updatedView.setAccountName(newAccountName);
            updatedView.refreshView();
          }

          this.syncGuideContextForLeaf(leaf);
          await Promise.resolve(this.plugin.app.workspace.revealLeaf(leaf));
          this.syncGuideContextForLeaf(leaf);

          if (typeof this.plugin.trackRecentView === 'function') {
            this.plugin.trackRecentView(
              ACCOUNT_PAGE_VIEW_TYPE,
              `Account: ${newAccountName}`,
              'user'
            );
          }
        }
      }
    }
  }

  
  public async closeAccountPageViews(accountName: string): Promise<void> {
    const existing = this.plugin.app.workspace.getLeavesOfType(
      ACCOUNT_PAGE_VIEW_TYPE
    );

    for (const leaf of existing) {
      const view = leaf.view;
      
      if (
        view instanceof AccountPageView &&
        typeof view.getAccountName === 'function'
      ) {
        if (view.getAccountName() === accountName) {
          
          leaf.detach();
        }
      }
    }
  }

  
  public async navigateToAccountDashboard(): Promise<void> {
    await this.openAccountDashboardView();
  }

  
  public async openTradeFormView(
    initialData?: Partial<TradeFormData>
  ): Promise<void> {
    
    const modal = new TradeFormModal({
      app: this.plugin.app,
      plugin: this.plugin,
      isEditMode: false,
      initialData: initialData || {},
      filePath: '',
    });
    modal.open();
  }

  
  public async openTradeFormInEditMode(
    tradeData: Partial<TradeFormData>,
    filePath: string,
    openOptions?: TradeFormOpenOptions
  ): Promise<void> {
    const modal = new TradeFormModal({
      app: this.plugin.app,
      plugin: this.plugin,
      isEditMode: true,
      initialData: tradeData || {},
      filePath: filePath || '',
      openOptions,
    });
    modal.open();
  }

  
  public async registerTemplateBuilderView(): Promise<void> {
    if (this.registeredViews.has(TEMPLATE_BUILDER_VIEW_TYPE)) {
      return;
    }

    try {
      const existingLeaves = this.plugin.app.workspace.getLeavesOfType(
        TEMPLATE_BUILDER_VIEW_TYPE
      );
      if (existingLeaves.length > 0) {
        logger.debug(
          '[Journalit] Preserving existing layout builder view leaves during registration'
        );
      }

      
      this.plugin.registerView(
        TEMPLATE_BUILDER_VIEW_TYPE,
        (leaf) => new TemplateBuilderView(leaf, this.plugin)
      );

      this.registeredViews.add(TEMPLATE_BUILDER_VIEW_TYPE);
      logger.debug('[Journalit] Layout builder view registered successfully');
    } catch (error) {
      console.error(
        '[Journalit] Failed to register layout builder view:',
        error
      );
    }
  }

  
  public async openTemplateBuilderView(): Promise<void> {
    
    await this.registerTemplateBuilderView();

    if (
      await this.revealExistingFunctionalLeaf(TEMPLATE_BUILDER_VIEW_TYPE, {
        label: t('view.layout-builder'),
        icon: 'lucide-blocks',
      })
    ) {
      return;
    }

    
    const leaf = this.plugin.app.workspace.getLeaf('tab');

    if (leaf) {
      
      await leaf.setViewState({
        type: TEMPLATE_BUILDER_VIEW_TYPE,
        active: true,
      });

      this.syncGuideContextForLeaf(leaf);

      
      await Promise.resolve(this.plugin.app.workspace.revealLeaf(leaf));
      this.syncGuideContextForLeaf(leaf);

      this.trackRecentView(
        TEMPLATE_BUILDER_VIEW_TYPE,
        t('view.layout-builder'),
        'lucide-blocks'
      );
    }
  }

  
  public async registerSetupsView(): Promise<void> {
    if (this.registeredViews.has(SETUPS_VIEW_TYPE)) {
      return;
    }

    try {
      const existingLeaves =
        this.plugin.app.workspace.getLeavesOfType(SETUPS_VIEW_TYPE);
      if (existingLeaves.length > 0) {
        logger.debug(
          '[Journalit] Preserving existing setups view leaves during registration'
        );
      }

      this.plugin.registerView(
        SETUPS_VIEW_TYPE,
        (leaf) => new SetupsView(leaf, this.plugin)
      );

      this.registeredViews.add(SETUPS_VIEW_TYPE);
      logger.debug('[Journalit] Setups view registered successfully');
    } catch (error) {
      console.error('[Journalit] Failed to register setups view:', error);
    }
  }

  
  public async openSetupsView(
    state?: Record<string, unknown>,
    options: SetupsViewOpenOptions = {}
  ): Promise<void> {
    await this.registerSetupsView();
    const newTab = options.newTab ?? true;
    const focusLeaf = options.focusLeaf ?? true;

    const requestedSetupId =
      state &&
      typeof state === 'object' &&
      'page' in state &&
      state.page === 'detail' &&
      'setupId' in state &&
      typeof state.setupId === 'string'
        ? state.setupId
        : null;
    const requestedSetupName =
      state &&
      typeof state === 'object' &&
      'setupName' in state &&
      typeof state.setupName === 'string'
        ? state.setupName
        : null;
    const requestsOverview =
      !state ||
      (typeof state === 'object' &&
        'page' in state &&
        state.page === 'overview');

    if (requestsOverview) {
      const existingLeaves =
        this.plugin.app.workspace.getLeavesOfType(SETUPS_VIEW_TYPE);
      let overviewLeaf: WorkspaceLeaf | null = null;

      for (const leaf of existingLeaves) {
        const view = leaf.view;
        if (view instanceof SetupsView) {
          if (view.getSetupsState().page === 'overview') {
            if (!overviewLeaf) {
              overviewLeaf = leaf;
            } else {
              leaf.detach();
            }
          }
        } else if (view?.getViewType?.() === SETUPS_VIEW_TYPE) {
          logger.debug(
            '[Journalit] Detaching broken restored setups view leaf during overview open'
          );
          leaf.detach();
        }
      }

      if (overviewLeaf) {
        this.syncGuideContextForLeaf(overviewLeaf);
        await Promise.resolve(
          this.plugin.app.workspace.revealLeaf(overviewLeaf)
        );
        this.plugin.app.workspace.setActiveLeaf(overviewLeaf, {
          focus: focusLeaf,
        });
        this.syncGuideContextForLeaf(overviewLeaf);
        this.trackRecentView(
          SETUPS_VIEW_TYPE,
          t('settings.customization.setups'),
          'flask-conical'
        );
        return;
      }
    }

    if (requestedSetupId) {
      const existingLeaves =
        this.plugin.app.workspace.getLeavesOfType(SETUPS_VIEW_TYPE);
      for (const leaf of existingLeaves) {
        const view = leaf.view;
        if (view instanceof SetupsView) {
          const existingState = view.getSetupsState();
          if (
            existingState.page === 'detail' &&
            (existingState.setupId === requestedSetupId ||
              existingState.setupName === requestedSetupId ||
              (requestedSetupName !== null &&
                (existingState.setupId === requestedSetupName ||
                  existingState.setupName === requestedSetupName)))
          ) {
            if (requestedSetupName && !existingState.setupName) {
              view.setSetupsState({
                ...existingState,
                setupName: requestedSetupName,
              });
            }
            this.syncGuideContextForLeaf(leaf);
            await Promise.resolve(this.plugin.app.workspace.revealLeaf(leaf));
            this.plugin.app.workspace.setActiveLeaf(leaf, {
              focus: focusLeaf,
            });
            this.syncGuideContextForLeaf(leaf);
            this.trackRecentView(
              SETUPS_VIEW_TYPE,
              requestedSetupName ?? t('settings.customization.setups'),
              'flask-conical'
            );
            return;
          }
        } else if (view?.getViewType?.() === SETUPS_VIEW_TYPE) {
          logger.debug(
            '[Journalit] Detaching broken restored setups view leaf during detail open'
          );
          leaf.detach();
        }
      }
    }

    const leaf = this.getNavigationTargetLeaf(newTab);

    if (leaf) {
      await leaf.setViewState({
        type: SETUPS_VIEW_TYPE,
        active: true,
        state,
      });

      this.syncGuideContextForLeaf(leaf);
      await Promise.resolve(this.plugin.app.workspace.revealLeaf(leaf));
      this.plugin.app.workspace.setActiveLeaf(leaf, { focus: focusLeaf });
      this.syncGuideContextForLeaf(leaf);

      this.trackRecentView(
        SETUPS_VIEW_TYPE,
        requestedSetupName ?? t('settings.customization.setups'),
        'flask-conical'
      );
    }
  }

  public async openSetupFileAsSetupsView(
    file: TFile,
    leaf?: WorkspaceLeaf | null
  ): Promise<void> {
    await this.registerSetupsView();
    const setupService = await this.plugin.serviceManager.getSetupService();
    if (!(await setupService.isSetupFile(file))) return;
    const setup = await setupService.getSetupByFilePath(file.path);
    if (!setup) return;

    this.clearMarkdownOpenSuppression(leaf, file.path);
    this.clearExplicitMarkdownOpen(leaf);

    const existingLeaf = this.findOpenSetupLeaf(file.path, leaf);
    if (existingLeaf) {
      await this.revealExistingSetupLeafAndDetachDuplicate(
        existingLeaf,
        leaf ?? existingLeaf
      );
      return;
    }

    const targetLeaf = leaf ?? this.findReusableSetupsLeaf();
    if (!targetLeaf) {
      return;
    }

    const setupState = {
      page: 'detail' as const,
      setupId: setup.id,
      setupName: setup.name,
      setupPath: setup.filePath,
    };

    if (targetLeaf.view instanceof SetupsView) {
      targetLeaf.view.setSetupsState(setupState);
      this.syncGuideContextForLeaf(targetLeaf);
      await Promise.resolve(this.plugin.app.workspace.revealLeaf(targetLeaf));
      this.plugin.app.workspace.setActiveLeaf(targetLeaf, { focus: true });
      this.syncGuideContextForLeaf(targetLeaf);
      this.trackRecentView(SETUPS_VIEW_TYPE, setup.name, 'flask-conical');
      return;
    }

    await targetLeaf.setViewState({
      type: SETUPS_VIEW_TYPE,
      active: true,
      state: setupState,
    });
  }

  private findReusableSetupsLeaf(): WorkspaceLeaf {
    const mostRecentLeaf = this.plugin.app.workspace.getMostRecentLeaf();
    if (mostRecentLeaf?.view instanceof SetupsView) return mostRecentLeaf;

    const setupLeaves =
      this.plugin.app.workspace.getLeavesOfType(SETUPS_VIEW_TYPE);
    const overviewLeaf = setupLeaves.find((leaf) => {
      const view = leaf.view;
      return (
        view instanceof SetupsView && view.getSetupsState().page === 'overview'
      );
    });
    if (overviewLeaf) return overviewLeaf;

    return this.plugin.app.workspace.getLeaf(false);
  }

  public async openSetupMarkdownView(
    setupReference: string,
    leaf: WorkspaceLeaf
  ): Promise<void> {
    const referencedFile =
      this.plugin.app.vault.getAbstractFileByPath(setupReference);
    let setupPath =
      referencedFile instanceof TFile &&
      this.isSetupFileFromCache(referencedFile)
        ? referencedFile.path
        : undefined;
    if (!setupPath) {
      const setupService = await this.plugin.serviceManager.getSetupService();
      const setup = await setupService.getSetupById(setupReference);
      setupPath = setup?.filePath;
    }
    if (!setupPath) return;
    const generation = this.beginExplicitMarkdownOpen(leaf, setupPath);
    this.suppressMarkdownOpen(leaf, setupPath);
    try {
      await leaf.setViewState({
        type: 'markdown',
        active: true,
        state: { file: setupPath, mode: 'source' },
      });
      const isCurrent =
        this.explicitMarkdownOpenGeneration.get(leaf) === generation;
      const pending = this.pendingExplicitMarkdownOpens.get(leaf);
      if (pending?.generation === generation) {
        this.pendingExplicitMarkdownOpens.delete(leaf);
      }
      if (isCurrent) {
        this.explicitMarkdownOpenPaths.set(leaf, setupPath);
      } else {
        const interruptedState =
          this.interruptedExplicitMarkdownStates.get(leaf);
        this.interruptedExplicitMarkdownStates.delete(leaf);
        if (interruptedState) {
          await leaf.setViewState(interruptedState);
        }
      }
    } finally {
      window.setTimeout(() => {
        this.clearMarkdownOpenSuppression(leaf, setupPath);
      }, 0);
    }
  }

  public async maybeOpenSetupMarkdownAsSetupsView(
    leaf: WorkspaceLeaf | null
  ): Promise<void> {
    if (!leaf || !(leaf.view instanceof MarkdownView) || !leaf.view.file) {
      return;
    }
    const file = leaf.view.file;
    if (this.isExplicitMarkdownOpen(leaf, file.path)) return;
    if (this.isMarkdownOpenSuppressed(leaf, file.path)) return;
    this.clearExplicitMarkdownOpen(leaf);
    await this.openSetupFileAsSetupsView(file, leaf);
  }

  
  public isViewRegistered(viewType: string): boolean {
    return this.registeredViews.has(viewType);
  }

  
  public cleanupViews(): void {
    try {
      
      this.registeredViews.clear();

      
      ViewManager.instance = null;
    } catch (e) {
      console.error('Error cleaning up view manager state:', e);
    }
  }

  public async registerNavigationView(): Promise<void> {
    if (this.registeredViews.has(NAVIGATION_VIEW_TYPE)) return;
    try {
      const existingLeaves =
        this.plugin.app.workspace.getLeavesOfType(NAVIGATION_VIEW_TYPE);
      if (existingLeaves.length > 0) {
        logger.debug(
          '[Journalit] Preserving existing navigation view leaves during registration'
        );
      }
      this.plugin.registerView(
        NAVIGATION_VIEW_TYPE,
        (leaf) => new NavigationView(leaf, this.plugin)
      );
      this.registeredViews.add(NAVIGATION_VIEW_TYPE);
      logger.debug('[Journalit] Navigation view registered successfully');
    } catch (error) {
      console.error('[Journalit] Failed to register navigation view:', error);
    }
  }

  public async activateNavigationSidebar(options?: {
    forceEnable?: boolean;
    revealExisting?: boolean;
  }): Promise<void> {
    const forceEnable = options?.forceEnable ?? false;
    const revealExisting = options?.revealExisting ?? false;

    if (
      !forceEnable &&
      (this.plugin.settings.navigation?.enabled ?? true) === false
    ) {
      return;
    }

    await this.registerNavigationView();

    const existing =
      this.plugin.app.workspace.getLeavesOfType(NAVIGATION_VIEW_TYPE);
    if (existing.length > 0) {
      if (revealExisting) {
        void this.plugin.app.workspace.revealLeaf(existing[0]);
      }
      return;
    }

    const leftLeaf = await this.plugin.app.workspace.ensureSideLeaf(
      NAVIGATION_VIEW_TYPE,
      'left',
      {
        active: true,
        split: false,
        reveal: true,
      }
    );

    if (leftLeaf) {
      void this.plugin.app.workspace.revealLeaf(leftLeaf);
    }
  }

  public async registerCalendarSidebarView(): Promise<void> {
    if (this.registeredViews.has(CALENDAR_SIDEBAR_VIEW_TYPE)) return;
    try {
      this.plugin.registerView(
        CALENDAR_SIDEBAR_VIEW_TYPE,
        (leaf) => new CalendarSidebarView(leaf, this.plugin)
      );
      this.registeredViews.add(CALENDAR_SIDEBAR_VIEW_TYPE);
      logger.debug('[Journalit] Calendar sidebar view registered successfully');
    } catch (error) {
      console.error(
        '[Journalit] Failed to register calendar sidebar view:',
        error
      );
    }
  }

  public async registerSessionModeView(): Promise<void> {
    if (this.registeredViews.has(SESSION_MODE_VIEW_TYPE)) return;
    try {
      this.plugin.registerView(
        SESSION_MODE_VIEW_TYPE,
        (leaf) => new SessionModeView(leaf, this.plugin)
      );
      this.registeredViews.add(SESSION_MODE_VIEW_TYPE);
      logger.debug('[Journalit] Session mode view registered successfully');
    } catch (error) {
      console.error('[Journalit] Failed to register session mode view:', error);
    }
  }

  public async activateSessionMode(options?: {
    revealExisting?: boolean;
  }): Promise<void> {
    const revealExisting = options?.revealExisting ?? false;

    await this.registerSessionModeView();

    const existing = this.plugin.app.workspace.getLeavesOfType(
      SESSION_MODE_VIEW_TYPE
    );
    if (existing.length > 0) {
      if (revealExisting) {
        void this.plugin.app.workspace.revealLeaf(existing[0]);
      }
      return;
    }

    const rightLeaf = await this.plugin.app.workspace.ensureSideLeaf(
      SESSION_MODE_VIEW_TYPE,
      'right',
      {
        active: true,
        split: false,
        reveal: true,
      }
    );

    if (rightLeaf) {
      void this.plugin.app.workspace.revealLeaf(rightLeaf);
    }
  }

  public async activateCalendarSidebar(options?: {
    revealExisting?: boolean;
  }): Promise<void> {
    const revealExisting = options?.revealExisting ?? false;

    await this.registerCalendarSidebarView();

    const existing = this.plugin.app.workspace.getLeavesOfType(
      CALENDAR_SIDEBAR_VIEW_TYPE
    );
    if (existing.length > 0) {
      if (revealExisting) {
        void this.plugin.app.workspace.revealLeaf(existing[0]);
      }
      return;
    }

    const leftLeaf = await this.plugin.app.workspace.ensureSideLeaf(
      CALENDAR_SIDEBAR_VIEW_TYPE,
      'left',
      {
        active: true,
        split: false,
        reveal: true,
      }
    );

    if (leftLeaf) {
      void this.plugin.app.workspace.revealLeaf(leftLeaf);
    }
  }

  public async navigateToView(
    viewType: string,
    state?: Record<string, unknown>,
    newTab: boolean = true,
    focusLeaf: boolean = true
  ): Promise<void> {
    await this.ensureViewRegistered(viewType);

    const recentViewMeta = this.getRecentViewMeta(viewType);
    if (
      await this.revealExistingFunctionalLeaf(
        viewType,
        recentViewMeta,
        focusLeaf
      )
    ) {
      return;
    }

    const leaf = this.getNavigationTargetLeaf(newTab);

    if (leaf) {
      await leaf.setViewState({
        type: viewType,
        active: true,
        state: state,
      });
      this.syncGuideContextForLeaf(leaf);
      void this.plugin.app.workspace.revealLeaf(leaf);
      this.plugin.app.workspace.setActiveLeaf(leaf, { focus: focusLeaf });
      this.syncGuideContextForLeaf(leaf);

      if (recentViewMeta) {
        this.trackRecentView(
          viewType,
          recentViewMeta.label,
          recentViewMeta.icon
        );
      }
    }
  }

  private getNavigationTargetLeaf(newTab: boolean): WorkspaceLeaf {
    if (newTab) {
      return this.plugin.app.workspace.getLeaf('tab');
    }

    const mostRecent = this.plugin.app.workspace.getMostRecentLeaf();
    if (
      mostRecent &&
      mostRecent.getRoot() === this.plugin.app.workspace.rootSplit &&
      mostRecent.view.getViewType() !== NAVIGATION_VIEW_TYPE
    ) {
      return mostRecent;
    }

    return this.plugin.app.workspace.getLeaf('tab');
  }
}
