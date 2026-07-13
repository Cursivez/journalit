export interface SessionLogTagDefinition {
  id: string;
  label: string;
  shortLabel: string;
  color: string;
  requiresResolution?: boolean;
  lessonTag?: boolean;
}

export interface SessionLogAlertRule {
  tagId: string;
  minimumCount: number;
  minimumPercentage: number;
  enabled: boolean;
}

export interface SessionLogEntry {
  id: string;
  timestamp: string;
  tagId: string;
  text: string;
  resolved?: boolean;
  promoted?: boolean;
}

export type SessionLogTimelineEntry =
  | {
      kind: 'manual';
      id: string;
      timestamp: Date;
      tagId: string;
      text: string;
      resolved: boolean;
      promoted: boolean;
    }
  | {
      kind: 'trade';
      id: string;
      timestamp: Date;
      tradePath: string;
      eventType: 'entry' | 'exit';
      instrument: string;
      direction: string;
      price: number | null;
      positionSize: number | null;
    };

export const DEFAULT_SESSION_LOG_TAGS: SessionLogTagDefinition[] = [
  {
    id: 'analysis',
    label: 'Analysis',
    shortLabel: 'AN',
    color: 'blue',
  },
  {
    id: 'market',
    label: 'Market',
    shortLabel: 'MK',
    color: 'purple',
  },
  {
    id: 'trade',
    label: 'Trade',
    shortLabel: 'TR',
    color: 'green',
  },
  {
    id: 'psychology',
    label: 'Psychology',
    shortLabel: 'PSY',
    color: 'pink',
  },
  {
    id: 'lesson',
    label: 'Lesson',
    shortLabel: 'LSN',
    color: 'amber',
    lessonTag: true,
  },
  {
    id: 'uncategorized',
    label: 'Uncategorized',
    shortLabel: '?',
    color: 'orange',
    requiresResolution: true,
  },
];

export const DEFAULT_SESSION_LOG_ALERT_RULE: SessionLogAlertRule = {
  tagId: 'psychology',
  minimumCount: 3,
  minimumPercentage: 40,
  enabled: true,
};
