import { WorkspaceLeaf } from 'obsidian';

export const VIEW_GUIDE_SCHEMA_VERSION = 1;

export type GuideStatus =
  | 'not_started'
  | 'in_progress'
  | 'skipped'
  | 'completed';

export interface PersistedGuideState {
  guideId: string;
  viewType: string;
  guideVersion: number;
  status: Exclude<GuideStatus, 'not_started'>;
  updatedAt: number;
  currentStepId?: string;
}

export interface PersistedViewGuideData {
  schemaVersion: number;
  guides: Record<string, PersistedGuideState>;
}

export interface ViewGuideSession {
  sessionId: string;
  guideId: string;
  viewType: string;
  guideVersion: number;
  leafId: string;
  currentStepId: string;
  status: 'active' | 'paused' | 'ended';
  startedAt: number;
  updatedAt: number;
}

export interface StartGuideSessionOptions {
  guideId: string;
  guideVersion: number;
  leaf: WorkspaceLeaf;
  initialStepId: string;
  forceRestart?: boolean;
}

export interface StartGuideSessionResult {
  session: ViewGuideSession | null;
  reason:
    | 'started'
    | 'resumed'
    | 'already-running'
    | 'already-running-in-other-leaf'
    | 'suppressed'
    | 'invalid-initial-step';
}

export type GuideStepProgression = 'manual' | 'action-required';
export type GuideStepPlacement = 'auto' | 'center' | 'right' | 'right-top';

export interface GuideStepDefinition {
  id: string;
  title: string;
  description: string;
  progression: GuideStepProgression;
  targetId?: string;
  requiredActionId?: string;
  placement?: GuideStepPlacement;
  skipIfTargetMissing?: boolean;
}

export interface GuideDefinition {
  id: string;
  viewType: string;
  version: number;
  initialStepId: string;
  steps: GuideStepDefinition[];
  priority?: number;
  autoShow?: boolean;
}

export interface ActiveLeafContext {
  leafId: string | null;
  viewType: string | null;
}
