
import React from 'react';
import {
  GroupedPerformanceWidget,
  type GroupedPerformanceWidgetProps,
} from './GroupedPerformanceWidget';

type TagPerformanceWidgetProps = Omit<GroupedPerformanceWidgetProps, 'kind'>;

export const TagPerformanceWidget = React.memo<TagPerformanceWidgetProps>(
  (props) => <GroupedPerformanceWidget {...props} kind="tag" />
);

TagPerformanceWidget.displayName = 'TagPerformanceWidget';
