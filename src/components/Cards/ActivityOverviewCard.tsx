import { motion } from 'framer-motion';
import { interpolate, useCurrentFrame } from 'remotion';
import { UserStats } from '../../config';
import { AnimatedCounter } from '../Effects/AnimatedCounter';

export function ActivityOverviewCard({ userStats }: { userStats: UserStats }) {
  const frame = useCurrentFrame();
  const fadeIn = (delay = 0) =>
    interpolate(frame - delay, [0, 30], [0, 1], {
      extrapolateRight: 'clamp',
    });

  return (
    <motion.div
      style={{ opacity: fadeIn(1) }}
      className="bg-gray-800 rounded-lg p-4 shadow-lg text-white w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 2.4 }}
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
    </motion.div>
  );
} 