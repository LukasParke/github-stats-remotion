import {UserStats} from '../../config';
import {MetricRow, Panel, ProgressBar} from './CardPrimitives';

export function RepositoryImpactCard({userStats}: {userStats: UserStats}) {
	const repos = userStats.repositories;
	const publicRepos = repos.publicRepos || repos.totalRepos - repos.privateRepos;
	const originalRepos = repos.originalRepos || repos.totalRepos - repos.forkedRepos;

	return (
		<Panel
			title="Repository Impact"
			subtitle={`${repos.privateRepos} private repos represented only as aggregates`}
		>
			<div className="grid grid-cols-[1fr_1fr] gap-4">
				<div className="space-y-2">
					<div>
						<div className="mb-1 flex justify-between text-xs">
							<span className="text-[#8b949e]">Public repositories</span>
							<span>{publicRepos}/{repos.totalRepos}</span>
						</div>
						<ProgressBar value={publicRepos} max={Math.max(1, repos.totalRepos)} />
					</div>
					<div>
						<div className="mb-1 flex justify-between text-xs">
							<span className="text-[#8b949e]">Original repositories</span>
							<span>{originalRepos}/{repos.totalRepos}</span>
						</div>
						<ProgressBar
							value={originalRepos}
							max={Math.max(1, repos.totalRepos)}
							color="#58a6ff"
						/>
					</div>
					<div>
						<div className="mb-1 flex justify-between text-xs">
							<span className="text-[#8b949e]">Active repositories</span>
							<span>{repos.activeRepos}</span>
						</div>
						<ProgressBar
							value={repos.activeRepos}
							max={Math.max(1, repos.totalRepos)}
							color="#f2cc60"
						/>
					</div>
				</div>
				<div className="space-y-1">
					<MetricRow label="Stars received" value={repos.starCount} />
					<MetricRow label="Forks received" value={repos.forkCount} delay={0.1} />
					<MetricRow
						label="Repo views"
						value={repos.repoViews}
						detail={`${repos.repoViewUniques} unique`}
						delay={0.2}
					/>
				</div>
			</div>
		</Panel>
	);
}
