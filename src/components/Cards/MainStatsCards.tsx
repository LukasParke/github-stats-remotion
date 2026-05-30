import {UserStats} from '../../config';
import {StatCard} from '../Effects/StatCard';

export function MainStatsCards({userStats}: {userStats: UserStats}) {
	return (
		<div className="grid h-full grid-cols-3 grid-rows-2 gap-3 text-white">
			<StatCard
				title="Contributions"
				value={userStats.summary.totalContributions}
				detail={`${userStats.summary.currentStreak} day streak`}
				accent="#3fb950"
				delay={0}
			/>
			<StatCard
				title="Stars"
				value={userStats.summary.starsReceived}
				detail="received"
				accent="#f2cc60"
				delay={3}
			/>
			<StatCard
				title="Repos"
				value={userStats.summary.totalRepos}
				detail={`${userStats.summary.activeRepos} active`}
				accent="#58a6ff"
				delay={6}
			/>
			<StatCard
				title="Pull Requests"
				value={userStats.community.totalPullRequests}
				detail={`${userStats.community.totalPullRequestReviews} reviews`}
				accent="#bc8cff"
				delay={9}
			/>
			<StatCard
				title="Languages"
				value={userStats.summary.languageCount}
				detail={userStats.topLanguages[0]?.languageName}
				accent="#ff7b72"
				delay={12}
			/>
			<StatCard
				title="Repo Views"
				value={userStats.repositories.repoViews}
				detail="14 day traffic"
				accent="#39c5cf"
				delay={15}
			/>
		</div>
	);
}
