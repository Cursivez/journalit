
import React from 'react';
import {
  GroupedPerformanceWidget,
  type GroupedPerformanceWidgetConfig,
  type GroupedPerformanceWidgetProps,
} from './GroupedPerformanceWidget';

type SetupPerformanceWidgetProps = Omit<GroupedPerformanceWidgetProps, 'kind'>;

export type SetupPerformanceWidgetConfig = GroupedPerformanceWidgetConfig;

export const SetupPerformanceWidget = React.memo<SetupPerformanceWidgetProps>(
  (props) => <GroupedPerformanceWidget {...props} kind="setup" />
);

SetupPerformanceWidget.displayName = 'SetupPerformanceWidget';
