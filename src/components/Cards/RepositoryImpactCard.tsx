import {UserStats} from '../../config';
import {MetricTile, Panel, ProgressBar, theme} from './CardPrimitives';
import {GitFork, ShieldCheck, Sparkles, Telescope} from 'lucide-react';

export function RepositoryImpactCard({userStats}: {userStats: UserStats}) {
	const repos = userStats.repositories;
	const publicRepos =
		repos.publicRepos || repos.totalRepos - repos.privateRepos;
	const originalRepos =
		repos.originalRepos || repos.totalRepos - repos.forkedRepos;
	const privacyDetail =
		repos.privateRepos > 0
			? `${repos.privateRepos} private repos aggregate-only`
			: 'Public repositories only';

	return (
		<Panel
			title="Repository Impact"
			subtitle={privacyDetail}
			accent={theme.green}
		>
			<div className="grid h-[188px] grid-cols-[1.1fr_0.9fr] gap-3">
				<div className="space-y-3 rounded-lg border border-white/10 bg-white/[0.035] p-3">
					<div>
						<div className="mb-1 flex justify-between gap-2 text-xs">
							<span className="truncate text-[#b7c0cc]">
								Public repositories
							</span>
							<span className="shrink-0 tabular-nums">
								{publicRepos}/{repos.totalRepos}
							</span>
						</div>
						<ProgressBar
							value={publicRepos}
							max={Math.max(1, repos.totalRepos)}
							color={theme.green}
							height={8}
						/>
					</div>
					<div>
						<div className="mb-1 flex justify-between gap-2 text-xs">
							<span className="truncate text-[#b7c0cc]">
								Original repositories
							</span>
							<span className="shrink-0 tabular-nums">
								{originalRepos}/{repos.totalRepos}
							</span>
						</div>
						<ProgressBar
							value={originalRepos}
							max={Math.max(1, repos.totalRepos)}
							color={theme.blue}
							delay={8}
							height={8}
						/>
					</div>
					<div>
						<div className="mb-1 flex justify-between gap-2 text-xs">
							<span className="truncate text-[#b7c0cc]">
								Active repositories
							</span>
							<span className="shrink-0 tabular-nums">{repos.activeRepos}</span>
						</div>
						<ProgressBar
							value={repos.activeRepos}
							max={Math.max(1, repos.totalRepos)}
							color={theme.yellow}
							delay={16}
							height={8}
						/>
					</div>
				</div>
				<div className="grid grid-cols-2 gap-2">
					<MetricTile
						icon={<Sparkles size={14} />}
						label="Stars"
						value={repos.starCount}
						accent={theme.yellow}
					/>
					<MetricTile
						icon={<GitFork size={14} />}
						label="Forks"
						value={repos.forkCount}
						delay={0.08}
						accent={theme.green}
					/>
					<MetricTile
						icon={<Telescope size={14} />}
						label="Views"
						value={repos.repoViews}
						detail={`${repos.repoViewUniques} unique`}
						delay={0.16}
						accent={theme.cyan}
					/>
					<MetricTile
						icon={<ShieldCheck size={14} />}
						label="Private"
						value={userStats.privacy.redactedPrivateRepositories}
						detail="redacted"
						delay={0.24}
						accent={theme.purple}
					/>
				</div>
			</div>
		</Panel>
	);
}
