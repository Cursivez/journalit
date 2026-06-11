import { WorkspaceLeaf } from 'obsidian';
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
import {
  CALENDAR_SIDEBAR_VIEW_TYPE,
  CalendarSidebarView,
} from './CalendarSidebarView';
import { TradeFormModal } from '../components/forms/trade/TradeFormModal';
import { TradeFormData } from '../components/forms/trade/types';
import { t } from '../lang/helpers';


const ACCOUNT_DASHBOARD_VIEW_TYPE = 'account-dashboard';

export class ViewManager {
  private static instance: ViewManager | null;

  private plugin: JournalitPlugin;

  
  private registeredViews: Set<string> = new Set();

  private constructor(plugin: JournalitPlugin) {
    this.plugin = plugin;
  }

  
  public static getInstance(plugin: JournalitPlugin): ViewManager {
    if (!ViewManager.instance) {
      ViewManager.instance = new ViewManager(plugin);
    }
    return ViewManager.instance;
  }

  private trackRecentView(viewType: string, label: string, icon: string): void {
    if (typeof this.plugin.trackRecentView === 'function') {
      this.plugin.trackRecentView(viewType, label, icon);
    }
  }

  private syncGuideContextForLeaf(leaf: WorkspaceLeaf): void {
    this.plugin.viewGuideService?.syncWorkspaceContext(leaf);
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
      case ACCOUNT_PAGE_VIEW_TYPE:
        await this.registerAccountPageView();
        return;
      case NAVIGATION_VIEW_TYPE:
        await this.registerNavigationView();
        return;
      case CALENDAR_SIDEBAR_VIEW_TYPE:
        await this.registerCalendarSidebarView();
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
    filePath: string
  ): Promise<void> {
    const modal = new TradeFormModal({
      app: this.plugin.app,
      plugin: this.plugin,
      isEditMode: true,
      initialData: tradeData || {},
      filePath: filePath || '',
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
        this.plugin.app.workspace.revealLeaf(existing[0]);
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
      this.plugin.app.workspace.revealLeaf(leftLeaf);
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
        this.plugin.app.workspace.revealLeaf(existing[0]);
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
      this.plugin.app.workspace.revealLeaf(leftLeaf);
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

    let leaf;
    if (newTab) {
      leaf = this.plugin.app.workspace.getLeaf('tab');
    } else {
      const mostRecent = this.plugin.app.workspace.getMostRecentLeaf();
      if (
        mostRecent &&
        mostRecent.getRoot() === this.plugin.app.workspace.rootSplit &&
        mostRecent.view.getViewType() !== NAVIGATION_VIEW_TYPE
      ) {
        leaf = mostRecent;
      } else {
        leaf = this.plugin.app.workspace.getLeaf('tab');
      }
    }

    if (leaf) {
      await leaf.setViewState({
        type: viewType,
        active: true,
        state: state,
      });
      this.syncGuideContextForLeaf(leaf);
      this.plugin.app.workspace.revealLeaf(leaf);
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
}
