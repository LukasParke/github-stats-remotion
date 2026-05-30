import {
	BookOpen,
	Code2,
	GitCommitHorizontal,
	GitPullRequest,
	Sparkles,
	Telescope,
} from 'lucide-react';
import {UserStats} from '../../config';
import {MetricRow, Panel} from './CardPrimitives';

export function Stats({userStats}: {userStats: UserStats}) {
	const rows = [
		{
			icon: <Sparkles size={16} />,
			label: 'Stars received',
			value: userStats.summary.starsReceived,
		},
		{
			icon: <GitCommitHorizontal size={16} />,
			label: 'Profile commits',
			value: userStats.contributions.totalCommits,
		},
		{
			icon: <GitPullRequest size={16} />,
			label: 'Pull requests',
			value: userStats.community.totalPullRequests,
		},
		{
			icon: <BookOpen size={16} />,
			label: 'Public repositories',
			value: userStats.repositories.publicRepos || userStats.repositories.totalRepos,
		},
		{
			icon: <Code2 size={16} />,
			label: 'Languages',
			value: userStats.summary.languageCount,
		},
		{
			icon: <Telescope size={16} />,
			label: 'Repo views',
			value: userStats.repositories.repoViews,
			detail: 'Last 14 days when traffic is available',
		},
	];

	return (
		<Panel
			title="GitHub Stats"
			subtitle={userStats.isComplete ? 'Current collection' : 'Core complete, optional backfill pending'}
		>
			<div className="space-y-0">
				{rows.map((row, index) => (
					<div key={row.label} className="flex items-center gap-2">
						<div className="text-[#58a6ff]">{row.icon}</div>
						<div className="min-w-0 flex-1">
							<MetricRow
								label={row.label}
								value={row.value}
								detail={row.detail}
								delay={index * 0.08}
							/>
						</div>
					</div>
				))}
			</div>
		</Panel>
	);
}
