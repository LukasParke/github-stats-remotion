import {
	Activity,
	Code2,
	GitBranch,
	GitPullRequest,
	ShieldCheck,
} from 'lucide-react';
import {Img} from 'remotion';
import {UserStats} from '../../config';
import {formatBytes, formatCompactNumber} from '../../functions/utils';
import {BigMetric, Panel, formatDisplayDate} from './CardPrimitives';

export function ReadmeCard({userStats}: {userStats: UserStats}) {
	const topLanguage = userStats.topLanguages[0];
	const statusText = userStats.isComplete
		? 'Complete'
		: `${userStats.collectionStatus.backfillPending} optional metrics pending`;
	const privacyText =
		userStats.privacy.redactedPrivateRepositories > 0
			? `${userStats.privacy.redactedPrivateRepositories} private repos redacted`
			: 'Public-safe output';

	return (
		<Panel className="relative bg-[#0d1117]">
			<div className="relative z-10 flex h-full flex-col justify-between">
				<div className="flex items-center gap-4">
					<Img
						className="size-16 rounded-full border border-white/10"
						src={userStats.avatarUrl || `https://github.com/${userStats.username}.png`}
					/>
					<div className="min-w-0">
						<p className="truncate text-2xl font-bold leading-tight">
							{userStats.name || userStats.username}
						</p>
						<p className="text-sm text-[#8b949e]">@{userStats.username}</p>
						{userStats.bio ? (
							<p className="mt-1 truncate text-xs text-[#c9d1d9]">
								{userStats.bio}
							</p>
						) : null}
					</div>
				</div>

				<div className="grid grid-cols-3 gap-3">
					<BigMetric
						label="Contributions"
						value={userStats.summary.totalContributions}
						detail={`${formatCompactNumber(userStats.summary.currentStreak)} day current streak`}
					/>
					<BigMetric
						label="Stars"
						value={userStats.summary.starsReceived}
						detail={`${formatCompactNumber(userStats.summary.forksReceived)} forks received`}
					/>
					<BigMetric
						label="Repos"
						value={userStats.summary.totalRepos}
						detail={`${formatCompactNumber(userStats.summary.activeRepos)} active`}
					/>
				</div>

				<div className="grid grid-cols-2 gap-2 text-xs text-[#c9d1d9]">
					<FooterItem
						icon={<Code2 size={14} />}
						label={topLanguage?.languageName || 'Languages'}
						value={
							topLanguage?.percentage
								? `${topLanguage.percentage.toFixed(1)}% of code`
								: `${userStats.summary.languageCount} languages`
						}
					/>
					<FooterItem
						icon={<GitPullRequest size={14} />}
						label="Community"
						value={`${formatCompactNumber(userStats.community.totalPullRequests)} PRs, ${formatCompactNumber(userStats.community.totalPullRequestReviews)} reviews`}
					/>
					<FooterItem
						icon={<GitBranch size={14} />}
						label="Code volume"
						value={formatBytes(userStats.code.codeByteTotal)}
					/>
					<FooterItem icon={<ShieldCheck size={14} />} label={statusText} value={privacyText} />
				</div>

				<div className="flex items-center justify-between text-[11px] text-[#8b949e]">
					<span className="flex items-center gap-1">
						<Activity size={12} />
						Updated {formatDisplayDate(userStats.summary.refreshedAt)}
					</span>
					<span>{userStats.schemaVersion ? `schema v${userStats.schemaVersion}` : 'legacy stats'}</span>
				</div>
			</div>
		</Panel>
	);
}

function FooterItem({
	icon,
	label,
	value,
}: {
	icon: JSX.Element;
	label: string;
	value: string;
}) {
	return (
		<div className="rounded-lg border border-white/10 bg-white/[0.03] p-2">
			<p className="flex items-center gap-1 font-semibold text-[#f0f3f6]">
				<span className="text-[#3fb950]">{icon}</span>
				{label}
			</p>
			<p className="mt-1 text-[#8b949e]">{value}</p>
		</div>
	);
}
