import { useCurrentFrame } from 'remotion';
import { fadeInAndSlideUp } from '../../functions/animations';
import { UserStats } from '../../config';
import { AnimatedCounter } from '../Effects/AnimatedCounter';

export function ActivityOverviewCard({ userStats }: { userStats: UserStats }) {
  const frame = useCurrentFrame();

  return (
    <div
      className="bg-[#282a36] text-[#f8f8f2] rounded-lg p-4 shadow-lg text-white w-full"
      style={fadeInAndSlideUp(frame)}
    >
      <h2 className="text-xl font-semibold mb-4 opacity-80">Activity Overview</h2>
      <div className="flex justify-between mb-2">
        <span className="opacity-80">Active Days:</span>
        <span className="font-semibold"><AnimatedCounter value={180} duration={3} delay={0} /></span>
      </div>
      <div className="flex justify-between mb-2">
        <span className="opacity-80">Repos Contributed To:</span>
        <span className="font-semibold"><AnimatedCounter value={25} duration={3} delay={1} /></span>
      </div>
      <div className="flex justify-between mb-2">
        <span className="opacity-80">Longest Streak:</span>
        <span className="font-semibold"><AnimatedCounter value={30} duration={3} delay={2} /> days</span>
      </div>
    </div>
  );
} 