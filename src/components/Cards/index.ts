import { ComponentType } from 'react';
import { MainProps } from '../../config';
import { ActivityOverviewCard } from './ActivityOverviewCard';
import { CodeMetricsCard } from './CodeMetricsCard';
import { CommitStreakCard } from './CommitStreakCard';
import { IssueTrackingCard } from './IssueTrackingCard';
import { LanguagesContent } from './LanguagesContent';
import { MainStatsCards } from './MainStatsCards';
import { ReadmeCard } from './ReadmeCard';
import { Stats } from './Stats';
import { TopLanguagesCard } from './TopLanguagesCard';
export type CardConfig = {
  id: string;
  component: ComponentType<{ userStats: MainProps['userStats'] }>;
  height: number;
  width?: number;
};

export const cards: CardConfig[] = [
  {
    id: 'stats',
    component: Stats,
    height: 230,
  },
  {
    id: 'languages',
    component: LanguagesContent,
    height: 180,
  },
  {
    id: 'readme',
    component: ReadmeCard,
    height: 350,
  },
  {
    id: 'main-stats',
    component: MainStatsCards,
    height: 273,
  },
  {
    id: 'issue-tracking',
    component: IssueTrackingCard,
    height: 178,
  },
  {
    id: 'code-metrics',
    component: CodeMetricsCard,
    height: 180,
  },
  {
    id: 'activity-overview',
    component: ActivityOverviewCard,
    height: 180,
  },
  {
    id: 'commit-streak',
    component: CommitStreakCard,
    height: 140,
  },
  {
    id: 'top-languages',
    component: TopLanguagesCard,
    height: 232,
  },

]; 
