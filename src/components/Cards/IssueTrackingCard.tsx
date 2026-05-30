import {UserStats} from '../../config';
import {MetricRow, Panel, ProgressBar} from './CardPrimitives';

export function IssueTrackingCard({userStats}: {userStats: UserStats}) {
	const opened = userStats.community.openIssues;
	const closed = userStats.community.closedIssues;
	const total = opened + closed;

	return (
		<Panel
			title="Community Work"
			subtitle={`${userStats.community.repositoriesContributedTo} repositories contributed to`}
		>
			<div className="grid grid-cols-[1fr_1fr] gap-4">
				<div className="space-y-1">
					<MetricRow label="Pull requests" value={userStats.community.totalPullRequests} />
					<MetricRow
						label="PR reviews"
						value={userStats.community.totalPullRequestReviews}
						delay={0.1}
					/>
					<MetricRow
						label="Discussions"
						value={
							userStats.community.discussionsStarted +
							userStats.community.discussionsAnswered
						}
						detail={`${userStats.community.discussionsAnswered} answered`}
						delay={0.2}
					/>
				</div>
				<div className="space-y-2">
					<div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
						<div className="flex items-center justify-between">
							<p className="text-xs text-[#8b949e]">Issues closed</p>
							<p className="text-sm font-semibold">{closed}</p>
						</div>
						<div className="mt-2">
							<ProgressBar value={closed} max={Math.max(1, total)} color="#3fb950" />
						</div>
						<p className="mt-2 text-[11px] text-[#8b949e]">
							{opened} open, {closed} closed
						</p>
					</div>
					<MetricRow
						label="Followers"
						value={userStats.community.followers}
						detail={`${userStats.community.following} following`}
					/>
				</div>
			</div>
		</Panel>
	);
}
