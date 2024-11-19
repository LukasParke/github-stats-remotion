import { motion } from 'framer-motion';
import { UserStats } from '../../config';
import { AnimatedCounter } from '../Effects/AnimatedCounter';

const CommitStreak = ({ streak }) => (
  <svg viewBox="0 0 100 100" className="w-40 h-40">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#FFD700', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#FFA500', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <path
      d="M50 10 
         A40 40 0 0 1 90 50 
         A40 40 0 0 1 50 90 
         A40 40 0 0 1 10 50 
         A40 40 0 0 1 50 10 
         Z"
      fill="none"
      stroke="url(#grad)"
      strokeWidth="4"
    />
    <path
      d="M50 20 
         L60 5 L40 5 Z"
      fill="#FFD700"
    />
    <text x="50" y="55" fontFamily="Arial" fontSize="20" fill="white" textAnchor="middle">
      <AnimatedCounter value={streak} duration={3} />
    </text>
    <text x="50" y="70" fontFamily="Arial" fontSize="10" fill="white" textAnchor="middle">
      Day Streak
    </text>
  </svg>
);

export function CommitStreakCard({ userStats }: { userStats: UserStats }) {
  return (
    <motion.div
      className="bg-gray-800 rounded-lg p-4 shadow-lg overflow-hidden relative text-white w-full"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 3.0 }}
    >
      <h2 className="text-xl font-semibold mb-4 opacity-80">Commit Streak</h2>
      <div className="flex items-center justify-center">
        <CommitStreak streak={200} />
      </div>
    </motion.div>
  );
} 