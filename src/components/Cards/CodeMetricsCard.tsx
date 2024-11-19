import { motion } from 'framer-motion';
import { UserStats } from '../../config';
import { AnimatedCounter } from '../Effects/AnimatedCounter';

export function CodeMetricsCard({ userStats }: { userStats: UserStats }) {

  return (
    <motion.div
      className="bg-gray-800 rounded-lg p-4 shadow-lg text-white w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
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
    </motion.div>
  );
} 