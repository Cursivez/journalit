

import React from 'react';
import { t } from '../../lang/helpers';
import type JournalitPlugin from '../../main';
import type { OnboardingService } from '../../services/onboarding/OnboardingService';
import { WelcomeStep } from './steps/WelcomeStep';
import {
  ChoosePathStep,
  type OnboardingPathOption,
} from './steps/ChoosePathStep';
import { ObsidianOrientationStep } from './steps/ObsidianOrientationStep';
import { BrokerStep } from './steps/BrokerStep';
import { PersonaliseStep } from './steps/PersonaliseStep';
import { FirstTradeStep } from './steps/FirstTradeStep';
import { AwaitingCompletionStep } from './steps/AwaitingCompletionStep';
import { PreparingSampleStep } from './steps/PreparingSampleStep';
import { SampleExploringStep } from './steps/SampleExploringStep';
import {
  stepAfterFamiliarity,
  stepBeforePersonalise,
  useOnboardingFlowModel,
  useOnboardingService,
} from './useOnboardingFlowModel';

interface OnboardingComponentProps {
  plugin: JournalitPlugin;
}

interface OnboardingFlowProps {
  plugin: JournalitPlugin;
  service: OnboardingService;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ plugin, service }) => {
  const {
    data,
    busy,
    signedOut,
    sidebarRevealed,
    brokerOptions,
    brokerStatusText,
    askAssetFocus,
    advance,
    chooseBroker,
    handleSkip,
    handleRevealSidebar,
    handlePersonaliseContinue,
    handleAwaitingPrimary,
    handleSignIn,
    handleAddTrade,
    handleExploreSample,
    sampleSnapshot,
    sampleStalled,
    handleLeaveSample,
    handleRetrySample,
    handleExitSample,
  } = useOnboardingFlowModel(plugin, service);

  const familiarityOptions: OnboardingPathOption[] = [
    {
      id: 'experienced',
      label: t('onboarding.familiarity.option.yes.label'),
      description: t('onboarding.familiarity.option.yes.description'),
      onChoose: () =>
        advance('data-source', { obsidianFamiliarity: 'experienced' }),
    },
    {
      id: 'new',
      label: t('onboarding.familiarity.option.no.label'),
      description: t('onboarding.familiarity.option.no.description'),
      onChoose: () => advance('orientation', { obsidianFamiliarity: 'new' }),
    },
  ];

  const dataSourceOptions: OnboardingPathOption[] = [
    {
      id: 'broker',
      label: t('onboarding.data-source.option.broker.label'),
      description: t('onboarding.data-source.option.broker.description'),
      onChoose: () =>
        advance('broker', {
          dataSource: 'broker',
          brokerId: undefined,
          assetFocus: undefined,
        }),
    },
    {
      id: 'file',
      label: t('onboarding.data-source.option.file.label'),
      description: t('onboarding.data-source.option.file.description'),
      onChoose: () =>
        advance('personalise', {
          dataSource: 'file',
          brokerId: undefined,
          assetFocus: undefined,
        }),
    },
    {
      id: 'fresh',
      label: t('onboarding.data-source.option.fresh.label'),
      description: t('onboarding.data-source.option.fresh.description'),
      onChoose: () =>
        advance('personalise', {
          dataSource: 'fresh',
          brokerId: undefined,
          assetFocus: undefined,
        }),
    },
    ...(handleExploreSample && !data.sampleExplored
      ? [
          {
            id: 'sample',
            label: t('onboarding.data-source.option.sample.label'),
            description: t('onboarding.data-source.option.sample.description'),
            onChoose: () => handleExploreSample('data-source'),
          },
        ]
      : []),
  ];

  return (
    <div className="journalit-onboarding-container">
      {data.step === 'welcome' && (
        <WelcomeStep
          onNext={() => advance('obsidian-familiarity')}
          onSkip={handleSkip}
        />
      )}
      {data.step === 'obsidian-familiarity' && (
        <ChoosePathStep
          kicker={t('onboarding.familiarity.kicker')}
          title={t('onboarding.familiarity.title')}
          subtitle={t('onboarding.familiarity.subtitle')}
          options={familiarityOptions}
          showGraphic={false}
          busy={busy}
          onBack={() => advance('welcome')}
        />
      )}
      {data.step === 'orientation' && (
        <ObsidianOrientationStep
          onRevealSidebar={handleRevealSidebar}
          sidebarRevealed={sidebarRevealed}
          onContinue={() => advance('data-source')}
          onBack={() => advance('obsidian-familiarity')}
        />
      )}
      {data.step === 'data-source' && (
        <ChoosePathStep
          kicker={t('onboarding.data-source.kicker')}
          title={t('onboarding.data-source.title')}
          subtitle={t('onboarding.data-source.subtitle')}
          options={dataSourceOptions}
          busy={busy}
          onBack={() => advance(stepAfterFamiliarity(data))}
        />
      )}
      {data.step === 'broker' && (
        <BrokerStep
          options={brokerOptions}
          statusText={brokerStatusText}
          busy={busy}
          onChoose={chooseBroker}
          onBack={() => advance('data-source')}
        />
      )}
      {data.step === 'personalise' && (
        <PersonaliseStep
          key={`${data.answers.dataSource ?? ''}:${data.answers.brokerId ?? ''}`}
          initial={data.answers}
          askAssetFocus={askAssetFocus}
          busy={busy}
          onContinue={handlePersonaliseContinue}
          onBack={() => advance(stepBeforePersonalise(data))}
        />
      )}
      {data.step === 'first-trade' && (
        <FirstTradeStep
          busy={busy}
          onAddTrade={handleAddTrade}
          onExploreSample={
            handleExploreSample && !data.sampleExplored
              ? () => handleExploreSample('first-trade')
              : undefined
          }
          onBack={() => advance('personalise')}
        />
      )}
      {data.step === 'preparing-sample' && handleRetrySample && (
        <PreparingSampleStep
          snapshot={sampleSnapshot}
          stalled={sampleStalled}
          busy={busy}
          onRetry={handleRetrySample}
          onBack={handleLeaveSample}
        />
      )}
      {data.step === 'sample-exploring' && handleExitSample && (
        <SampleExploringStep
          busy={busy}
          sampleFailed={sampleSnapshot.phase === 'failed'}
          onExitSample={handleExitSample}
          onSkip={handleSkip}
        />
      )}
      {data.step === 'awaiting-completion' &&
        data.pendingCompletion &&
        data.pendingCompletion !== 'sample-journal' && (
          <AwaitingCompletionStep
            pending={data.pendingCompletion}
            busy={busy}
            signedOut={signedOut}
            onSignIn={handleSignIn}
            onPrimary={handleAwaitingPrimary}
            onChangeRoute={() => advance('data-source')}
            onSkip={handleSkip}
          />
        )}
    </div>
  );
};

export const OnboardingComponent: React.FC<OnboardingComponentProps> = ({
  plugin,
}) => {
  const service = useOnboardingService(plugin);
  if (!service) {
    return <div className="journalit-onboarding-container" />;
  }
  return <OnboardingFlow plugin={plugin} service={service} />;
};
