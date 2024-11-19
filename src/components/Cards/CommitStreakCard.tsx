import { motion } from 'framer-motion';
import { UserStats } from '../../config';
import { AnimatedCounter } from '../Effects/AnimatedCounter';

const CommitStreak = ({ streak }) => (
  <div className="flex flex-col items-center justify-center">
    <p className="text-3xl font-bold">
      <AnimatedCounter value={streak} duration={3} />
    </p>
    <p className="text-sm opacity-80">
      Day Streak
    </p>
  </div>

);

export function CommitStreakCard({ userStats }: { userStats: UserStats }) {
  return (
    <motion.div
      className="bg-gray-800 rounded-lg p-4 shadow-lg overflow-hidden relative text-white w-full"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold mb-4 opacity-80">Commit Streak</h2>
      <CommitStreak streak={200} />
    </motion.div>
  );
} 