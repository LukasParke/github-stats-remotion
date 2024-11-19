import { UserStats } from '../../config';
import { StatCard } from '../Effects/StatCard';

export function MainStatsCards({ userStats }: { userStats: UserStats }) {
  return (
    <div className="grid grid-cols-3 gap-6 text-white">
      <StatCard title="Total Stars" value={userStats.starCount} gradient="bg-gradient-to-br from-yellow-400/10 to-orange-500/10" delay={0} />
      <StatCard title="Total Forks" value={userStats.forkCount} gradient="bg-gradient-to-br from-green-400/10 to-blue-500/10" delay={0.5} />
      <StatCard title="Repo Views" value={userStats.repoViews} gradient="bg-gradient-to-br from-purple-400/10 to-pink-500/10" delay={1} />
      <StatCard title="Total Commits" value={userStats.totalCommits} gradient="bg-gradient-to-br from-red-400/10 to-yellow-500/10" delay={1.5} />
      <StatCard title="Pull Requests" value={userStats.totalPullRequests} gradient="bg-gradient-to-br from-blue-400/10 to-indigo-500/10" delay={2} />
      <StatCard title="Contributions" value={userStats.totalContributions} gradient="bg-gradient-to-br from-green-400/10 to-teal-500/10" delay={2.5} />
    </div>
  );
} 