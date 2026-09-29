import React from 'react';

import { t } from '../../lang/helpers';
import { BrokerImportRecoveryNotice } from './BrokerImportRecoveryNotice';
import type { BrokerImportAnalyseRecovery } from './brokerImportRecovery';
import { BROKER_GUIDE_URLS } from './brokerGuides';

interface NativeSourceRecoveryCopyContext {
  selectedSource: string;
}

interface NativeSourceRecoveryCopyOverride {
  title?: string;
  message?: string;
}


const NATIVE_SOURCE_RECOVERY_COPY_OVERRIDES: Partial<
  Record<
    string,
    (
      context: NativeSourceRecoveryCopyContext
    ) => NativeSourceRecoveryCopyOverride
  >
> = {
  DEEPCHARTS: ({ selectedSource }) => {
    if (selectedSource === 'RITHMIC') {
      return {
        message: t('trade-import.source-recovery.deepcharts.rithmic-message'),
      };
    }
    if (selectedSource === 'MANUAL') {
      return {
        message: t('trade-import.source-recovery.deepcharts.manual-message'),
      };
    }
    return {};
  },
  MOTIVEWAVE: () => ({
    title: t('trade-import.source-recovery.motivewave.title'),
    message: t('trade-import.source-recovery.motivewave.message'),
  }),
  METATRADER: ({ selectedSource }) =>
    selectedSource === 'MANUAL'
      ? { message: t('trade-import.source-recovery.metatrader.message') }
      : {},
};

interface NativeSourceRecoveryNoticeProps {
  className: string;
  disabled?: boolean;
  iconSize: number;
  
  onContinueWithSelectedSource: () => void;
  onSwitchSource: () => void;
  recovery: BrokerImportAnalyseRecovery;
  selectedSource: string;
  selectedSourceLabel: string;
}

export const NativeSourceRecoveryNotice: React.FC<
  NativeSourceRecoveryNoticeProps
> = ({
  className,
  disabled,
  iconSize,
  onContinueWithSelectedSource,
  onSwitchSource,
  recovery,
  selectedSource,
  selectedSourceLabel,
}) => {
  const source = recovery.recommendedSourceLabel;
  const override =
    NATIVE_SOURCE_RECOVERY_COPY_OVERRIDES[recovery.recommendedSource]?.({
      selectedSource,
    }) ?? {};
  const guideUrl = BROKER_GUIDE_URLS[recovery.recommendedSource];

  return (
    <BrokerImportRecoveryNotice
      actionLabel={t('trade-import.source-recovery.switch', { source })}
      className={className}
      continueLabel={t('trade-import.source-recovery.continue', {
        selected: selectedSourceLabel,
      })}
      disabled={disabled}
      guideLabel={t('trade-import.source-recovery.guide', { source })}
      guideUrl={guideUrl}
      iconSize={iconSize}
      message={
        override.message ??
        t('trade-import.source-recovery.message', {
          source,
          selected: selectedSourceLabel,
        })
      }
      onContinue={onContinueWithSelectedSource}
      onSwitchSource={onSwitchSource}
      title={
        override.title ?? t('trade-import.source-recovery.title', { source })
      }
    />
  );
};
