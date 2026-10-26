import { useState } from 'react';
import type { useDateDraftGate } from '../../../core/DateDraftGate';
import type { TradeFormLayoutSettings } from '../../../../settings/types';
import type { TradeFormProps } from '../types';

type TradeFormTab = NonNullable<TradeFormProps['initialTab']>;

interface TradeFormNavigationOptions {
  initialTab: TradeFormTab;
  canShowDetailsTab: boolean;
  canShowAdvancedTab: boolean;
  isSubmitting: boolean;
  dateDraftGate: ReturnType<typeof useDateDraftGate>;
  onOpenCustomization: TradeFormProps['onOpenCustomization'];
  applySavedLayout: (layout: TradeFormLayoutSettings) => void;
}


export function useTradeFormNavigation({
  initialTab,
  canShowDetailsTab,
  canShowAdvancedTab,
  isSubmitting,
  dateDraftGate,
  onOpenCustomization,
  applySavedLayout,
}: TradeFormNavigationOptions) {
  const [activeTab, setActiveTab] = useState(initialTab);
  
  const effectiveActiveTab: TradeFormTab =
    (activeTab === 'details' && !canShowDetailsTab) ||
    (activeTab === 'advanced' && !canShowAdvancedTab)
      ? 'basic'
      : activeTab;

  const handleTabChange = (newTab: TradeFormTab) => {
    if (newTab !== activeTab && dateDraftGate.confirm()) setActiveTab(newTab);
  };

  const handleOpenLayoutSettings = () => {
    if (isSubmitting || !dateDraftGate.confirm()) return;
    onOpenCustomization?.(applySavedLayout);
  };

  return { effectiveActiveTab, handleTabChange, handleOpenLayoutSettings };
}
