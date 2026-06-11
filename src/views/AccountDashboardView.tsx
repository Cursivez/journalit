

import React from 'react';
import { WorkspaceLeaf } from 'obsidian';
import JournalitPlugin from '../main';
import { AccountDashboard } from '../components/account/dashboard';
import { t } from '../lang/helpers';
import { ReactView } from './ReactView';
import { RenderFunction } from './types';

export const ACCOUNT_DASHBOARD_VIEW_TYPE = 'account-dashboard';

export class AccountDashboardView extends ReactView {
  private plugin: JournalitPlugin;

  constructor(leaf: WorkspaceLeaf, plugin: JournalitPlugin) {
    super(leaf, {
      containerClass: 'journalit-account-dashboard-container',
    });
    this.plugin = plugin;
  }

  getViewType(): string {
    return ACCOUNT_DASHBOARD_VIEW_TYPE;
  }

  getDisplayText(): string {
    return t('account-dashboard.title');
  }

  getIcon(): string {
    return 'users';
  }

  async onOpen(): Promise<void> {
    await super.onOpen();
  }

  async onClose(): Promise<void> {
    await super.onClose();
  }

  protected getRenderFunction(): RenderFunction {
    const AccountDashboardRender = () => (
      <AccountDashboard plugin={this.plugin} leaf={this.leaf} />
    );
    AccountDashboardRender.displayName = 'AccountDashboardRender';
    return AccountDashboardRender;
  }
}
