

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


interface MentalMonthlyGameData {
  month: number;
  year: number;
  monthName: string;
  mentalGradeDistribution: GradeDistribution;
  mentalRating?: number;
}

interface MentalGamePreviewData {
  weeks: WeeklyGamePerformance[];
  noteType?: GameGradePreviewData['noteType'];
  
  monthlyData?: MentalMonthlyGameData[];
}

interface MentalGameWidgetProps {
  filePath: string;
  plugin: JournalitPlugin;
  config?: GameGradeWidgetConfig;
  preview?: boolean;
  previewData?: MentalGamePreviewData;
}

const toGameGradeMonth = (month: MentalMonthlyGameData): GameGradeMonth => ({
  month: month.month,
  year: month.year,
  monthName: month.monthName,
  gradeDistribution: month.mentalGradeDistribution,
  rating: month.mentalRating,
});

export const MentalGameWidget: React.FC<MentalGameWidgetProps> = React.memo(
  ({ previewData, ...props }) => {
    
    const gamePreviewData = useMemo<GameGradePreviewData | undefined>(
      () =>
        previewData && {
          ...previewData,
          monthlyData: previewData.monthlyData?.map(toGameGradeMonth),
        },
      [previewData]
    );
    return (
      <GameGradeWidget kind="mental" previewData={gamePreviewData} {...props} />
    );
  }
);

MentalGameWidget.displayName = 'MentalGameWidget';
