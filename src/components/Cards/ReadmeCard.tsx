import {
	ArrowDownFromLine,
	ArrowUpFromLine,
	Code2,
	Diff,
	GitCommitHorizontal,
	GitFork,
	GitPullRequest,
	HandHeart,
	MapPin,
	Sparkles,
	Telescope,
} from 'lucide-react';
import {Easing, Img, interpolate, useCurrentFrame} from 'remotion';
import {UserStats} from '../../config';
import {formatBytes, formatCompactNumber} from '../../functions/utils';
import {AnimatedCounter} from '../Effects/AnimatedCounter';
import {GeminiBeams} from '../Effects/GeminiBeams';
import {ProgressBar, theme} from './CardPrimitives';

type ReadmeVariantProps = {
	userStats: UserStats;
};

type ReadmeMetric = {
	icon: JSX.Element;
	label: string;
	value: number;
	detail?: string;
	accent: string;
};

export function ReadmeCard({userStats}: ReadmeVariantProps) {
	const frame = useCurrentFrame();
	const topLanguage = userStats.topLanguages[0];
	const profileSlide = interpolate(frame, [0, 38], [18, 0], {
		easing: Easing.bezier(0.22, 1, 0.36, 1),
		extrapolateRight: 'clamp',
	});

	return (
		<ReadmeShell className="bg-[#0c0f17]">
			<GeminiBeams
				className="left-[30%] top-[2%] h-[118%] w-[92%] opacity-80"
				rotate={-6}
				scale={1.18}
			/>
			<div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,11,18,0.98)_0%,rgba(8,11,18,0.88)_44%,rgba(8,11,18,0.36)_100%)]" />
			<div className="relative z-10 grid h-full grid-cols-[1.05fr_0.95fr] gap-5 p-6">
				<div
					className="flex min-w-0 flex-col justify-between"
					style={{transform: `translateY(${profileSlide}px)`}}
				>
					<div>
						<div className="mb-5 flex items-center gap-4">
							<ProfileImage userStats={userStats} size="large" />
							<div className="min-w-0">
								<p className="text-sm font-semibold uppercase tracking-normal text-[#9ba7b4]">
									GitHub profile telemetry
								</p>
								<h1 className="truncate text-5xl font-black leading-none text-[#f8fafc]">
									{userStats.name || userStats.username}
								</h1>
								<div className="mt-2 flex items-center gap-2 text-sm text-[#b7c0cc]">
									<span>@{userStats.username}</span>
									{userStats.location ? (
										<>
											<span className="text-[#6e7681]">/</span>
											<span className="flex min-w-0 items-center gap-1">
												<MapPin size={13} />
												<span className="truncate">{userStats.location}</span>
											</span>
										</>
									) : null}
								</div>
							</div>
						</div>
						<p
							className="max-w-[470px] overflow-hidden text-base leading-relaxed text-[#dbe3ec]"
							style={{
								display: '-webkit-box',
								WebkitLineClamp: 2,
								WebkitBoxOrient: 'vertical',
							}}
						>
							{userStats.bio ||
								'Building software, systems, and public projects across GitHub.'}
						</p>
					</div>

					<div className="grid grid-cols-3 gap-3">
						<HeroMetric
							label="Contributions"
							value={userStats.summary.totalContributions}
							detail={`${formatCompactNumber(userStats.summary.currentStreak)} day streak`}
							accent={theme.green}
						/>
						<HeroMetric
							label="Stars"
							value={userStats.summary.starsReceived}
							detail={`${formatCompactNumber(userStats.summary.forksReceived)} forks`}
							accent={theme.yellow}
							delay={0.12}
						/>
						<HeroMetric
							label="Repos"
							value={userStats.summary.totalRepos}
							detail={`${formatCompactNumber(userStats.summary.activeRepos)} active`}
							accent={theme.blue}
							delay={0.24}
						/>
					</div>
				</div>

				<div className="grid min-w-0 grid-rows-[1fr_142px] gap-3">
					<div className="grid grid-cols-2 gap-3">
						<ReadmeMetricCard
							icon={<GitCommitHorizontal size={18} />}
							label="Commits"
							value={userStats.contributions.totalCommits}
							detail={`${formatCompactNumber(userStats.summary.totalContributions)} contributions`}
							accent={theme.green}
						/>
						<ReadmeMetricCard
							icon={<GitPullRequest size={18} />}
							label="Pull requests"
							value={userStats.community.totalPullRequests}
							detail={`${formatCompactNumber(userStats.community.totalPullRequestReviews)} reviews`}
							accent={theme.purple}
							delay={0.08}
						/>
						<ReadmeMetricCard
							icon={<Telescope size={18} />}
							label="Repo views"
							value={userStats.repositories.repoViews}
							detail="14 day traffic"
							accent={theme.cyan}
							delay={0.16}
						/>
						<ReadmeMetricCard
							icon={<Code2 size={18} />}
							label={topLanguage?.languageName || 'Languages'}
							value={userStats.summary.languageCount}
							detail={
								topLanguage?.percentage
									? `${topLanguage.percentage.toFixed(1)}% top language`
									: 'languages detected'
							}
							accent={topLanguage?.color || theme.red}
							delay={0.24}
						/>
					</div>

					<div className="rounded-xl border border-white/10 bg-white/[0.045] p-4">
						<div className="mb-3 flex items-start justify-between gap-4">
							<div className="min-w-0">
								<p className="truncate text-xs font-semibold uppercase tracking-normal text-[#9ba7b4]">
									Code footprint
								</p>
								<p className="mt-1 truncate text-sm text-[#f0f3f6]">
									{formatBytes(userStats.code.codeByteTotal)} across{' '}
									{userStats.summary.languageCount} languages
								</p>
							</div>
							<div className="shrink-0 text-right">
								<p className="text-xs font-semibold uppercase tracking-normal text-[#9ba7b4]">
									Active repos
								</p>
								<p className="mt-1 text-xl font-black leading-none text-[#58a6ff]">
									{formatCompactNumber(userStats.summary.activeRepos)}
								</p>
							</div>
						</div>
						<ProgressBar
							value={topLanguage?.percentage || 0}
							max={100}
							color={topLanguage?.color || theme.cyan}
							height={10}
						/>
						<p className="mt-3 truncate text-xs text-[#8b949e]">
							{topLanguage?.languageName || 'Top language'} leads with{' '}
							{(topLanguage?.percentage || 0).toFixed(1)}% of indexed code
						</p>
					</div>
				</div>
			</div>
		</ReadmeShell>
	);
}

export function ReadmeClassicCard({userStats}: ReadmeVariantProps) {
	const frame = useCurrentFrame();
	const metrics = getClassicMetrics(userStats);

	return (
		<ReadmeShell className="bg-[#282a36]">
			<div className="absolute inset-0 opacity-70">
				<GeminiBeams
					className="left-[-28%] top-[28%] h-[92%] w-[168%]"
					rotate={-105}
					scale={1.38}
				/>
			</div>
			<div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(40,42,54,0.98),rgba(40,42,54,0.82)_58%,rgba(40,42,54,0.95))]" />
			<div className="relative z-10 flex h-full flex-col p-5 text-[#f8f8f2]">
				<div className="mb-4 flex items-center gap-3">
					<ProfileImage userStats={userStats} />
					<div className="min-w-0">
						<p className="truncate text-lg font-bold">
							Hi, I'm {userStats.name || userStats.username}
						</p>
						<p className="truncate text-xs text-[#bd93f9]">
							@{userStats.username}
						</p>
					</div>
				</div>

				<div className="grid flex-1 content-start gap-2">
					{metrics.map((metric, index) => (
						<div
							key={metric.label}
							className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-[#1d1f29]/75 px-3 py-2"
							style={{
								opacity: interpolate(
									frame,
									[index * 5, index * 5 + 18],
									[0, 1],
									{
										extrapolateLeft: 'clamp',
										extrapolateRight: 'clamp',
									},
								),
								transform: `translateX(${interpolate(
									frame,
									[index * 5, index * 5 + 18],
									[-16, 0],
									{
										easing: Easing.bezier(0.22, 1, 0.36, 1),
										extrapolateLeft: 'clamp',
										extrapolateRight: 'clamp',
									},
								)}px)`,
							}}
						>
							<div className="flex min-w-0 items-center gap-2">
								<span className="shrink-0" style={{color: metric.accent}}>
									{metric.icon}
								</span>
								<p className="truncate text-sm">{metric.label}</p>
							</div>
							<p className="shrink-0 text-sm font-bold tabular-nums">
								<AnimatedCounter
									value={metric.value}
									duration={2.2}
									delay={index * 0.05}
								/>
							</p>
						</div>
					))}
				</div>
			</div>
		</ReadmeShell>
	);
}

export function ReadmeSpotlightCard({userStats}: ReadmeVariantProps) {
	const topLanguages = userStats.topLanguages.slice(0, 5);
	const timeline = userStats.contributions.timeline.slice(-6);
	const maxTimeline = Math.max(
		1,
		...timeline.map((item) => item.contributions),
	);

	return (
		<ReadmeShell className="bg-[#070a10]">
			<GeminiBeams
				className="left-[8%] top-[-22%] h-[122%] w-[110%] opacity-60"
				rotate={2}
				scale={1.08}
				speed={0.72}
			/>
			<div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,10,16,0.42),rgba(7,10,16,0.96)_72%)]" />
			<div className="relative z-10 grid h-full grid-cols-[310px_1fr] gap-5 p-6">
				<div className="flex flex-col justify-between rounded-xl border border-white/10 bg-black/30 p-5">
					<div>
						<ProfileImage userStats={userStats} size="large" />
						<h1 className="mt-4 text-4xl font-black leading-none">
							{userStats.name || userStats.username}
						</h1>
						<p className="mt-2 text-sm text-[#9ba7b4]">@{userStats.username}</p>
					</div>
					<div className="grid grid-cols-2 gap-2">
						<MiniStat label="Followers" value={userStats.community.followers} />
						<MiniStat label="Stars" value={userStats.summary.starsReceived} />
						<MiniStat label="Repos" value={userStats.summary.totalRepos} />
						<MiniStat
							label="Languages"
							value={userStats.summary.languageCount}
						/>
					</div>
				</div>

				<div className="grid min-w-0 grid-rows-[1fr_116px] gap-4">
					<div className="grid grid-cols-[1fr_230px] gap-4">
						<div className="rounded-xl border border-white/10 bg-white/[0.045] p-5">
							<p className="text-xs font-semibold uppercase tracking-normal text-[#9ba7b4]">
								Contribution signal
							</p>
							<div className="mt-4 grid grid-cols-3 gap-3">
								<HeroMetric
									label="Total"
									value={userStats.summary.totalContributions}
									detail="contribs"
									accent={theme.green}
								/>
								<HeroMetric
									label="Current"
									value={userStats.summary.currentStreak}
									detail="current"
									accent={theme.yellow}
									delay={0.12}
								/>
								<HeroMetric
									label="Longest"
									value={userStats.summary.longestStreak}
									detail="longest"
									accent={theme.cyan}
									delay={0.24}
								/>
							</div>
							<div className="mt-5">
								<ContributionHeatmap userStats={userStats} />
							</div>
						</div>

						<div className="rounded-xl border border-white/10 bg-white/[0.045] p-4">
							<p className="mb-3 text-xs font-semibold uppercase tracking-normal text-[#9ba7b4]">
								Language leaders
							</p>
							<div className="space-y-2">
								{topLanguages.map((language, index) => (
									<div key={language.languageName}>
										<div className="mb-1 flex justify-between gap-2 text-xs">
											<span className="truncate">{language.languageName}</span>
											<span className="shrink-0 text-[#8b949e]">
												{(language.percentage || 0).toFixed(1)}%
											</span>
										</div>
										<ProgressBar
											value={language.percentage || 0}
											max={100}
											color={language.color || theme.blue}
											delay={index * 5}
											height={7}
										/>
									</div>
								))}
							</div>
						</div>
					</div>

					<div className="grid grid-cols-6 gap-2 rounded-xl border border-white/10 bg-black/25 p-3">
						{timeline.map((item) => (
							<div
								key={item.period}
								className="flex min-w-0 flex-col justify-between"
							>
								<p className="truncate text-[10px] text-[#8b949e]">
									{item.period}
								</p>
								<div className="mt-2 flex h-12 items-end">
									<div
										className="w-full rounded-t"
										style={{
											height: `${Math.max(8, (item.contributions / maxTimeline) * 48)}px`,
											background: `linear-gradient(180deg, ${theme.green}, ${theme.cyan})`,
										}}
									/>
								</div>
								<p className="mt-1 truncate text-xs font-semibold">
									{formatCompactNumber(item.contributions)}
								</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</ReadmeShell>
	);
}

function ReadmeShell({
	children,
	className = '',
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div
			className={`relative h-full w-full overflow-hidden rounded-2xl border border-white/10 font-mono text-[#f0f3f6] shadow-2xl ${className}`}
			style={{
				boxShadow:
					'0 24px 80px rgba(0,0,0,0.48), inset 0 1px 0 rgba(255,255,255,0.08)',
			}}
		>
			<div
				className="pointer-events-none absolute inset-0 opacity-[0.18]"
				style={{
					backgroundImage:
						'linear-gradient(rgba(255,255,255,0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.09) 1px, transparent 1px)',
					backgroundSize: '36px 36px',
				}}
			/>
			<div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
			{children}
		</div>
	);
}

function ProfileImage({
	userStats,
	size = 'normal',
}: {
	userStats: UserStats;
	size?: 'normal' | 'large';
}) {
	return (
		<Img
			className={`${size === 'large' ? 'size-20' : 'size-12'} shrink-0 rounded-full border border-white/15 object-cover shadow-2xl`}
			src={
				userStats.avatarUrl || `https://github.com/${userStats.username}.png`
			}
		/>
	);
}

function HeroMetric({
	label,
	value,
	detail,
	accent,
	delay = 0,
}: {
	label: string;
	value: number;
	detail: string;
	accent: string;
	delay?: number;
}) {
	return (
		<div>
			<p className="text-[11px] font-semibold uppercase tracking-normal text-[#9ba7b4]">
				{label}
			</p>
			<p className="mt-1 text-4xl font-black leading-none tabular-nums">
				<span style={{color: accent}}>
					{value >= 1000 ? (
						formatCompactNumber(value)
					) : (
						<AnimatedCounter value={value} duration={1.8} delay={delay} />
					)}
				</span>
			</p>
			<p className="mt-1 truncate text-xs text-[#8b949e]">{detail}</p>
		</div>
	);
}

function ReadmeMetricCard({
	icon,
	label,
	value,
	detail,
	accent,
	delay = 0,
}: ReadmeMetric & {delay?: number}) {
	return (
		<div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.05] p-4">
			<div
				className="absolute inset-x-0 top-0 h-px"
				style={{background: `linear-gradient(90deg, ${accent}, transparent)`}}
			/>
			<div className="flex items-center gap-2 text-[#9ba7b4]">
				<span style={{color: accent}}>{icon}</span>
				<p className="truncate text-xs font-semibold uppercase tracking-normal">
					{label}
				</p>
			</div>
			<p className="mt-3 text-3xl font-black leading-none tabular-nums">
				<AnimatedCounter value={value} duration={1.8} delay={delay} />
			</p>
			<p className="mt-2 truncate text-xs text-[#8b949e]">{detail}</p>
		</div>
	);
}

function MiniStat({label, value}: {label: string; value: number}) {
	return (
		<div className="rounded-lg border border-white/10 bg-white/[0.05] p-3">
			<p className="text-[10px] font-semibold uppercase tracking-normal text-[#9ba7b4]">
				{label}
			</p>
			<p className="mt-1 text-xl font-bold tabular-nums">
				{formatCompactNumber(value)}
			</p>
		</div>
	);
}

function ContributionHeatmap({userStats}: {userStats: UserStats}) {
	const days = userStats.contributions.calendar.slice(-91);
	const max = Math.max(1, ...days.map((day) => day.contributionCount));

	return (
		<div
			className="grid grid-flow-col gap-1"
			style={{gridTemplateRows: 'repeat(7, 8px)'}}
		>
			{days.map((day) => (
				<div
					key={day.date}
					className="size-2 rounded-[2px]"
					style={{
						backgroundColor: contributionColor(day.contributionCount, max),
					}}
				/>
			))}
		</div>
	);
}

function contributionColor(count: number, max: number) {
	if (count === 0) {
		return 'rgba(255,255,255,0.08)';
	}
	const ratio = count / max;
	if (ratio > 0.72) {
		return '#3fb950';
	}
	if (ratio > 0.45) {
		return '#2ea043';
	}
	if (ratio > 0.22) {
		return '#238636';
	}
	return '#0e4429';
}

function getClassicMetrics(userStats: UserStats): ReadmeMetric[] {
	return [
		{
			icon: <Sparkles size={18} />,
			label: 'Stars',
			value: userStats.summary.starsReceived,
			accent: theme.yellow,
		},
		{
			icon: <GitFork size={18} />,
			label: 'Forks',
			value: userStats.summary.forksReceived,
			accent: theme.green,
		},
		{
			icon: <GitCommitHorizontal size={18} />,
			label: 'Commits',
			value: userStats.contributions.totalCommits,
			accent: theme.green,
		},
		{
			icon: <GitPullRequest size={18} />,
			label: 'Pull Requests',
			value: userStats.community.totalPullRequests,
			accent: theme.purple,
		},
		{
			icon: <ArrowUpFromLine size={18} />,
			label: 'Opened Issues',
			value: userStats.community.openIssues,
			accent: theme.red,
		},
		{
			icon: <ArrowDownFromLine size={18} />,
			label: 'Closed Issues',
			value: userStats.community.closedIssues,
			accent: theme.green,
		},
		{
			icon: <Telescope size={18} />,
			label: 'Repo Views (2 wks)',
			value: userStats.repositories.repoViews,
			accent: theme.cyan,
		},
		{
			icon: <Diff size={18} />,
			label: 'Lines of code changed',
			value: userStats.code.linesOfCodeChanged,
			accent: theme.yellow,
		},
		{
			icon: <HandHeart size={18} />,
			label: 'Total contributions',
			value: userStats.summary.totalContributions,
			accent: theme.green,
		},
	];
}
