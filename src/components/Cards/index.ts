import {ComponentType} from 'react';
import {MainProps} from '../../config';
import {ActivityOverviewCard} from './ActivityOverviewCard';
import {CodeMetricsCard} from './CodeMetricsCard';
import {CommitStreakCard} from './CommitStreakCard';
import {IssueTrackingCard} from './IssueTrackingCard';
import {LanguagesContent} from './LanguagesContent';
import {MainStatsCards} from './MainStatsCards';
import {ReadmeCard, ReadmeClassicCard, ReadmeSpotlightCard} from './ReadmeCard';
import {RepositoryImpactCard} from './RepositoryImpactCard';
import {Stats} from './Stats';
import {TopLanguagesCard} from './TopLanguagesCard';
export type CardConfig = {
	id: string;
	component: ComponentType<{userStats: MainProps['userStats']}>;
	height: number;
	width?: number;
};

export const cards: CardConfig[] = [
	{
		id: 'readme',
		component: ReadmeCard,
		width: 900,
		height: 460,
	},
	{
		id: 'readme-classic',
		component: ReadmeClassicCard,
		height: 520,
	},
	{
		id: 'readme-spotlight',
		component: ReadmeSpotlightCard,
		width: 900,
		height: 460,
	},
	{
		id: 'stats',
		component: Stats,
		height: 360,
	},
	{
		id: 'languages',
		component: LanguagesContent,
		height: 270,
	},
	{
		id: 'main-stats',
		component: MainStatsCards,
		height: 300,
	},
	{
		id: 'repo-impact',
		component: RepositoryImpactCard,
		height: 280,
	},
	{
		id: 'issue-tracking',
		component: IssueTrackingCard,
		height: 280,
	},
	{
		id: 'code-metrics',
		component: CodeMetricsCard,
		height: 280,
	},
	{
		id: 'activity-overview',
		component: ActivityOverviewCard,
		height: 360,
	},
	{
		id: 'commit-streak',
		component: CommitStreakCard,
		height: 230,
	},
	{
		id: 'top-languages',
		component: TopLanguagesCard,
		height: 260,
	},
];
