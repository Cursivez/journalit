

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
import type { OnboardingStepId } from '../../services/onboarding/types';

interface OnboardingComponentProps {
  plugin: JournalitPlugin;
}

interface OnboardingFlowProps {
  plugin: JournalitPlugin;
  service: OnboardingService;
}

type OnboardingFlowModel = ReturnType<typeof useOnboardingFlowModel>;

interface OnboardingScreenContext extends OnboardingFlowModel {
  
  canExploreSample: boolean;
}

const familiarityOptionsFor = ({
  advance,
}: OnboardingScreenContext): OnboardingPathOption[] => [
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

const dataSourceOptionsFor = ({
  advance,
  canExploreSample,
  handleExploreSample,
}: OnboardingScreenContext): OnboardingPathOption[] => [
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
  ...(canExploreSample && handleExploreSample
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

type OnboardingScreen = (context: OnboardingScreenContext) => React.ReactNode;

const ONBOARDING_SCREENS: Partial<Record<OnboardingStepId, OnboardingScreen>> =
  {
    welcome: ({ advance, handleSkip }) => (
      <WelcomeStep
        onNext={() => advance('obsidian-familiarity')}
        onSkip={handleSkip}
      />
    ),
    'obsidian-familiarity': (context) => (
      <ChoosePathStep
        kicker={t('onboarding.familiarity.kicker')}
        title={t('onboarding.familiarity.title')}
        subtitle={t('onboarding.familiarity.subtitle')}
        options={familiarityOptionsFor(context)}
        showGraphic={false}
        busy={context.busy}
        onBack={() => context.advance('welcome')}
      />
    ),
    orientation: ({ advance, handleRevealSidebar, sidebarRevealed }) => (
      <ObsidianOrientationStep
        onRevealSidebar={handleRevealSidebar}
        sidebarRevealed={sidebarRevealed}
        onContinue={() => advance('data-source')}
        onBack={() => advance('obsidian-familiarity')}
      />
    ),
    'data-source': (context) => (
      <ChoosePathStep
        kicker={t('onboarding.data-source.kicker')}
        title={t('onboarding.data-source.title')}
        subtitle={t('onboarding.data-source.subtitle')}
        options={dataSourceOptionsFor(context)}
        busy={context.busy}
        onBack={() => context.advance(stepAfterFamiliarity(context.data))}
      />
    ),
    broker: ({
      brokerOptions,
      brokerStatusText,
      busy,
      chooseBroker,
      advance,
    }) => (
      <BrokerStep
        options={brokerOptions}
        statusText={brokerStatusText}
        busy={busy}
        onChoose={chooseBroker}
        onBack={() => advance('data-source')}
      />
    ),
    personalise: ({
      data,
      askAssetFocus,
      busy,
      handlePersonaliseContinue,
      advance,
    }) => (
      <PersonaliseStep
        key={`${data.answers.dataSource ?? ''}:${data.answers.brokerId ?? ''}`}
        initial={data.answers}
        askAssetFocus={askAssetFocus}
        busy={busy}
        onContinue={handlePersonaliseContinue}
        onBack={() => advance(stepBeforePersonalise(data))}
      />
    ),
    'first-trade': ({
      busy,
      handleAddTrade,
      canExploreSample,
      handleExploreSample,
      advance,
    }) => (
      <FirstTradeStep
        busy={busy}
        onAddTrade={handleAddTrade}
        onExploreSample={
          canExploreSample && handleExploreSample
            ? () => handleExploreSample('first-trade')
            : undefined
        }
        onBack={() => advance('personalise')}
      />
    ),
    'preparing-sample': ({
      handleRetrySample,
      sampleSnapshot,
      sampleStalled,
      busy,
      handleLeaveSample,
    }) =>
      handleRetrySample && (
        <PreparingSampleStep
          snapshot={sampleSnapshot}
          stalled={sampleStalled}
          busy={busy}
          onRetry={handleRetrySample}
          onBack={handleLeaveSample}
        />
      ),
    'sample-exploring': ({
      handleExitSample,
      busy,
      sampleSnapshot,
      handleSkip,
    }) =>
      handleExitSample && (
        <SampleExploringStep
          busy={busy}
          sampleFailed={sampleSnapshot.phase === 'failed'}
          onExitSample={handleExitSample}
          onSkip={handleSkip}
        />
      ),
    'awaiting-completion': ({
      data,
      busy,
      signedOut,
      handleSignIn,
      handleAwaitingPrimary,
      advance,
      handleSkip,
    }) =>
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
      ),
  };

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ plugin, service }) => {
  const model = useOnboardingFlowModel(plugin, service);
  const context: OnboardingScreenContext = {
    ...model,
    canExploreSample:
      Boolean(model.handleExploreSample) && !model.data.sampleExplored,
  };
  const renderScreen = ONBOARDING_SCREENS[model.data.step];

  return (
    <div className="journalit-onboarding-container">
      
      <React.Fragment key={model.data.step}>
        {renderScreen?.(context)}
      </React.Fragment>
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
