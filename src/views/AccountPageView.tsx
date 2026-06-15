

import React from 'react';
import { WorkspaceLeaf, ViewStateResult } from 'obsidian';
import { ReactView } from './ReactView';
import { RenderFunction } from './types';
import { usePlugin } from '../hooks/usePlugin';
import { useAccountPageService } from '../hooks/useService';
import { AccountPageDataProvider } from '../components/accountPage/context/AccountPageDataContext';
import { AccountPageContent } from '../components/accountPage/AccountPageContent';
import { t } from '../lang/helpers';
import type JournalitPlugin from '../main';


export const ACCOUNT_PAGE_VIEW_TYPE = 'journalit-account-page-view';


export class AccountPageView extends ReactView {
  private accountName: string = '';

  constructor(leaf: WorkspaceLeaf) {
    super(leaf, {
      containerClass: 'journalit-account-page-view-container',
    });
  }

  
  getDisplayText(): string {
    return this.accountName
      ? t('view.account-page.title', { name: this.accountName })
      : t('view.account-page.title-default');
  }

  
  getViewType(): string {
    return ACCOUNT_PAGE_VIEW_TYPE;
  }

  
  getIcon(): string {
    return 'user-circle';
  }

  
  async onOpen(): Promise<void> {
    try {
      
      await super.onOpen();

      
    } catch (error) {
      console.error('Error in AccountPageView.onOpen:', error);
    }
  }

  
  async onClose(): Promise<void> {
    try {
      
      
      await super.onClose();
    } catch (error) {
      console.error('Error in AccountPageView.onClose:', error);
    }
  }

  
  public setAccountName(accountName: string): void {
    this.accountName = accountName;
    
    if (this.leaf) {
      this.leaf.view = this; 
    }
  }

  
  public refreshView(): void {
    this.renderComponent();
  }

  
  public getAccountName(): string {
    return this.accountName;
  }

  
  async setState(state: unknown, result: ViewStateResult): Promise<void> {
    await super.setState(state, result);

    if (state && typeof state === 'object' && 'accountName' in state) {
      const accountName = Reflect.get(state, 'accountName');
      if (typeof accountName === 'string') {
        this.setAccountName(accountName);
      }
    }
  }

  
  getState(): Record<string, unknown> {
    const state = super.getState();
    return {
      ...state,
      accountName: this.accountName,
    };
  }

  
  protected getRenderFunction(): RenderFunction {
    const AccountPageRender = () => (
      <AccountPageComponent leaf={this.leaf} view={this} />
    );
    AccountPageRender.displayName = 'AccountPageRender';
    return AccountPageRender;
  }
}




const AccountPageComponent: React.FC<{
  leaf: WorkspaceLeaf;
  view: AccountPageView;
}> = ({ leaf: _leaf, view }) => {
  const plugin = usePlugin();
  const accountName = view.getAccountName();

  
  if (!plugin) {
    return (
      <div className="journalit-account-page-view">{t('common.loading')}</div>
    );
  }

  
  if (!accountName) {
    return (
      <div className="journalit-account-page-view">
        <div className="account-page-error">
          <h3>{t('view.account-page.no-account-selected')}</h3>
          <p>{t('view.account-page.no-account-instructions')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="journalit-account-page-view">
      <AccountPageWrapper
        leaf={_leaf}
        accountName={accountName}
        plugin={plugin}
      />
    </div>
  );
};

AccountPageComponent.displayName = 'AccountPageComponent';


const AccountPageWrapper: React.FC<{
  leaf: WorkspaceLeaf;
  accountName: string;
  plugin: JournalitPlugin;
}> = ({ leaf, accountName, plugin }) => {
  const { service: accountPageService } = useAccountPageService();

  
  if (!accountPageService) {
    return (
      <div className="account-page-loading">
        <p>{t('view.account-page.service-loading')}</p>
      </div>
    );
  }

  return (
    <AccountPageDataProvider
      app={plugin.app}
      accountPageService={accountPageService}
      accountName={accountName}
      plugin={plugin}
    >
      <div className="account-page-wrapper">
        <AccountPageContent leaf={leaf} />
      </div>
    </AccountPageDataProvider>
  );
};
