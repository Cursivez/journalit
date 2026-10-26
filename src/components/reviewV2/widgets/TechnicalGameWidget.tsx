

import React, { useMemo } from 'react';
import type JournalitPlugin from '../../../main';
import type {
  WeeklyGamePerformance,
  GradeDistribution,
} from '../../../services/monthly/types';
import {
  GameGradeWidget,
  type GameGradeMonth,
  type GameGradePreviewData,
  type GameGradeWidgetConfig,
} from './GameGradeWidget';


interface TechnicalMonthlyGameData {
  month: number;
  year: number;
  monthName: string;
  technicalGradeDistribution: GradeDistribution;
  technicalRating?: number;
}

interface TechnicalGamePreviewData {
  weeks: WeeklyGamePerformance[];
  noteType?: GameGradePreviewData['noteType'];
  
  monthlyData?: TechnicalMonthlyGameData[];
}

interface TechnicalGameWidgetProps {
  filePath: string;
  plugin: JournalitPlugin;
  config?: GameGradeWidgetConfig;
  preview?: boolean;
  previewData?: TechnicalGamePreviewData;
}

const toGameGradeMonth = (month: TechnicalMonthlyGameData): GameGradeMonth => ({
  month: month.month,
  year: month.year,
  monthName: month.monthName,
  gradeDistribution: month.technicalGradeDistribution,
  rating: month.technicalRating,
});

export const TechnicalGameWidget: React.FC<TechnicalGameWidgetProps> =
  React.memo(({ previewData, ...props }) => {
    
    const gamePreviewData = useMemo<GameGradePreviewData | undefined>(
      () =>
        previewData && {
          ...previewData,
          monthlyData: previewData.monthlyData?.map(toGameGradeMonth),
        },
      [previewData]
    );
    return (
      <GameGradeWidget
        kind="technical"
        previewData={gamePreviewData}
        {...props}
      />
    );
  });

TechnicalGameWidget.displayName = 'TechnicalGameWidget';
