import {
	BookOpen,
	Code2,
	GitCommitHorizontal,
	GitPullRequest,
	Sparkles,
	Telescope,
} from 'lucide-react';
import {UserStats} from '../../config';
import {MetricTile, Panel, theme} from './CardPrimitives';
import {formatCompactNumber} from '../../functions/utils';

export function Stats({userStats}: {userStats: UserStats}) {
	const rows = [
		{
			icon: <Sparkles size={16} />,
			label: 'Stars received',
			value: userStats.summary.starsReceived,
			detail: `${formatCompactNumber(userStats.summary.forksReceived)} forks`,
			accent: theme.yellow,
		},
		{
			icon: <GitCommitHorizontal size={16} />,
			label: 'Profile commits',
			value: userStats.contributions.totalCommits,
			detail: `${formatCompactNumber(userStats.contributions.totalContributions)} contributions`,
			accent: theme.green,
		},
		{
			icon: <GitPullRequest size={16} />,
			label: 'Pull requests',
			value: userStats.community.totalPullRequests,
			detail: `${formatCompactNumber(userStats.community.totalPullRequestReviews)} reviews`,
			accent: theme.purple,
		},
		{
			icon: <BookOpen size={16} />,
			label: 'Public repositories',
			value:
				userStats.repositories.publicRepos || userStats.repositories.totalRepos,
			detail: `${formatCompactNumber(userStats.repositories.activeRepos)} active`,
			accent: theme.blue,
		},
		{
			icon: <Code2 size={16} />,
			label: 'Languages',
			value: userStats.summary.languageCount,
			detail: userStats.topLanguages[0]?.languageName || 'detected',
			accent: theme.red,
		},
		{
			icon: <Telescope size={16} />,
			label: 'Repo views',
			value: userStats.repositories.repoViews,
			detail: '14 day traffic when available',
			accent: theme.cyan,
		},
	];

	return (
		<Panel
			title="GitHub Stats"
			subtitle={
				userStats.isComplete
					? 'Current collection'
					: 'Core complete, optional backfill pending'
			}
			accent={theme.blue}
		>
			<div className="grid h-[268px] grid-cols-2 gap-2">
				{rows.map((row, index) => (
					<MetricTile
						key={row.label}
						icon={row.icon}
						label={row.label}
						value={row.value}
						detail={row.detail}
						delay={index * 0.08}
						accent={row.accent}
					/>
				))}
			</div>
		</Panel>
	);
}
