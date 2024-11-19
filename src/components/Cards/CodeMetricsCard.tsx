import { useCurrentFrame } from 'remotion';
import { fadeInAndSlideUp } from '../../functions/animations';
import { UserStats } from '../../config';
import { AnimatedCounter } from '../Effects/AnimatedCounter';

export function CodeMetricsCard({ userStats }: { userStats: UserStats }) {
  const frame = useCurrentFrame();

  return (
    <div
      className="bg-[#282a36] text-[#f8f8f2] rounded-lg p-4 shadow-lg text-white w-full"
      style={fadeInAndSlideUp(frame)}
    >
      <h2 className="text-xl font-semibold mb-4 opacity-80">Code Metrics</h2>
      <div className="flex justify-between mb-2">
        <span className="opacity-80">Lines Changed:</span>
        <span className="font-semibold"><AnimatedCounter value={userStats.linesOfCodeChanged} duration={3} /></span>
      </div>
      <div className="flex justify-between mb-2">
        <span className="opacity-80">Avg. Commits per PR:</span>
        <span className="font-semibold">
          <AnimatedCounter
            value={Math.round(userStats.totalCommits / userStats.totalPullRequests)}
            duration={3}
            delay={1}
          />
        </span>
      </div>
      <div className="flex justify-between mb-2">
        <span className="opacity-80">Code Review Comments:</span>
        <span className="font-semibold">
          <AnimatedCounter value={200} duration={3} delay={2} />
        </span>
      </div>
    </div>
  );
} 