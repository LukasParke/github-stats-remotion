import {UserStats} from '../../config';
import {StatCard} from '../Effects/StatCard';
import {theme} from './CardPrimitives';

export function MainStatsCards({userStats}: {userStats: UserStats}) {
	return (
		<div
			className="grid h-full grid-cols-3 grid-rows-2 gap-3 rounded-xl border border-white/10 p-3 text-white"
			style={{
				background:
					'linear-gradient(135deg, rgba(8,11,18,0.96), rgba(13,17,23,0.98))',
				boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
			}}
		>
			<StatCard
				title="Contributions"
				value={userStats.summary.totalContributions}
				detail={`${userStats.summary.currentStreak} day streak`}
				accent={theme.green}
				delay={0}
			/>
			<StatCard
				title="Stars"
				value={userStats.summary.starsReceived}
				detail="received"
				accent={theme.yellow}
				delay={0.12}
			/>
			<StatCard
				title="Repos"
				value={userStats.summary.totalRepos}
				detail={`${userStats.summary.activeRepos} active`}
				accent={theme.blue}
				delay={0.24}
			/>
			<StatCard
				title="Pull Requests"
				value={userStats.community.totalPullRequests}
				detail={`${userStats.community.totalPullRequestReviews} reviews`}
				accent={theme.purple}
				delay={0.36}
			/>
			<StatCard
				title="Languages"
				value={userStats.summary.languageCount}
				detail={userStats.topLanguages[0]?.languageName}
				accent={theme.red}
				delay={0.48}
			/>
			<StatCard
				title="Repo Views"
				value={userStats.repositories.repoViews}
				detail="14 day traffic"
				accent={theme.cyan}
				delay={0.6}
			/>
		</div>
	);
}
