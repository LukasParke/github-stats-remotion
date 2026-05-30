import {UserStats} from '../../config';
import {formatBytes, formatCompactNumber} from '../../functions/utils';
import {
	MetricRow,
	MetricTile,
	Panel,
	ProgressBar,
	theme,
} from './CardPrimitives';
import {Database, Diff, FileCode2} from 'lucide-react';

export function CodeMetricsCard({userStats}: {userStats: UserStats}) {
	const completed = userStats.code.contributorReposCompleted;
	const pending = userStats.code.contributorReposPending;
	const failed = userStats.code.contributorReposFailed;
	const totalQueued = completed + pending + failed;
	const lineMetricComplete = pending === 0 && failed === 0;

	return (
		<Panel
			title="Code Metrics"
			subtitle={
				lineMetricComplete
					? 'Contributor stats are current'
					: `${pending} repos still pending optional line backfill`
			}
			accent={theme.cyan}
		>
			<div className="grid h-[198px] grid-cols-[1fr_1fr] gap-3">
				<div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
					<MetricRow
						icon={<Database size={14} />}
						label="Code bytes"
						value={formatBytes(userStats.code.codeByteTotal)}
						accent={theme.blue}
					/>
					<MetricRow
						icon={<FileCode2 size={14} />}
						label="Lines added"
						value={userStats.code.linesAdded}
						delay={0.1}
						accent={theme.green}
					/>
					<MetricRow
						icon={<FileCode2 size={14} />}
						label="Lines deleted"
						value={userStats.code.linesDeleted}
						delay={0.2}
						accent={theme.red}
					/>
					<MetricRow
						icon={<Diff size={14} />}
						label="Lines changed"
						value={userStats.code.linesOfCodeChanged}
						detail={lineMetricComplete ? undefined : 'Optional REST backfill'}
						delay={0.3}
						accent={theme.yellow}
					/>
				</div>
				<div className="grid gap-2">
					<MetricTile
						large
						label="Metric queue"
						value={formatCompactNumber(completed)}
						detail="repos completed"
						accent={theme.cyan}
					/>
					<div className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
						<ProgressBar
							value={completed}
							max={Math.max(1, totalQueued)}
							color={theme.cyan}
							height={10}
						/>
						<p className="mt-2 text-[11px] text-[#8b949e]">
							{pending} pending, {failed} failed
						</p>
					</div>
				</div>
			</div>
		</Panel>
	);
}
