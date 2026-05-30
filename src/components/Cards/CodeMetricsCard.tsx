import {UserStats} from '../../config';
import {formatBytes, formatCompactNumber} from '../../functions/utils';
import {MetricRow, Panel, ProgressBar} from './CardPrimitives';

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
		>
			<div className="grid grid-cols-[1fr_1fr] gap-4">
				<div className="space-y-2">
					<MetricRow
						label="Code bytes"
						value={formatBytes(userStats.code.codeByteTotal)}
					/>
					<MetricRow
						label="Lines added"
						value={userStats.code.linesAdded}
						delay={0.1}
					/>
					<MetricRow
						label="Lines deleted"
						value={userStats.code.linesDeleted}
						delay={0.2}
					/>
					<MetricRow
						label="Lines changed"
						value={userStats.code.linesOfCodeChanged}
						detail={lineMetricComplete ? undefined : 'Optional REST backfill'}
						delay={0.3}
					/>
				</div>
				<div className="flex flex-col justify-center rounded-lg border border-white/10 bg-white/[0.03] p-3">
					<p className="text-xs uppercase tracking-normal text-[#8b949e]">
						Metric Queue
					</p>
					<p className="mt-1 text-3xl font-bold">
						{formatCompactNumber(completed)}
					</p>
					<p className="text-xs text-[#8b949e]">repos completed</p>
					<div className="mt-4">
						<ProgressBar value={completed} max={Math.max(1, totalQueued)} />
					</div>
					<p className="mt-2 text-[11px] text-[#8b949e]">
						{pending} pending, {failed} failed
					</p>
				</div>
			</div>
		</Panel>
	);
}
