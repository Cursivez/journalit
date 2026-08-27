

import React from 'react';
import { WorkspaceLeaf } from 'obsidian';
import { ReactView } from './ReactView';
import { RenderFunction } from './types';
import type JournalitPlugin from '../main';
import { EconomicCalendarPanel } from '../components/economicCalendar/EconomicCalendarPanel';
import { t } from '../lang/helpers';

export const ECONOMIC_CALENDAR_VIEW_TYPE = 'journalit-economic-calendar-view';

export class EconomicCalendarView extends ReactView {
  constructor(
    leaf: WorkspaceLeaf,
    private plugin: JournalitPlugin
  ) {
    super(leaf, {
      containerClass: 'journalit-economic-calendar-view-container',
      rootId: 'journalit-economic-calendar-view',
    });
  }

  getViewType(): string {
    return ECONOMIC_CALENDAR_VIEW_TYPE;
  }

  getDisplayText(): string {
    return t('view.economic-calendar.title');
  }

  getIcon(): string {
    return 'calendar-range';
  }

  protected getRenderFunction(): RenderFunction {
    const EconomicCalendarRenderer = () => (
      <EconomicCalendarPanel plugin={this.plugin} />
    );
    EconomicCalendarRenderer.displayName = 'EconomicCalendarRenderer';
    return EconomicCalendarRenderer;
  }
}
