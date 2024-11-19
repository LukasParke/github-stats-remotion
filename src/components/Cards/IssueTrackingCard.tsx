import { motion } from 'framer-motion';
import { interpolate, useCurrentFrame } from 'remotion';
import { UserStats } from '../../config';
import { AnimatedCounter } from '../Effects/AnimatedCounter';

export function IssueTrackingCard({ userStats }: { userStats: UserStats }) {
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
      transition={{ duration: 0.5, delay: 1.4 }}
    >
      <h2 className="text-xl font-semibold mb-4 opacity-80">Issue Tracking</h2>
      <div className="flex justify-between mb-2">
        <span className="opacity-80">Issues Opened:</span>
        <span className="font-semibold"><AnimatedCounter value={userStats.openIssues} duration={3} /></span>
      </div>
      <div className="flex justify-between mb-2">
        <span className="opacity-80">Issues Closed:</span>
        <span className="font-semibold"><AnimatedCounter value={userStats.closedIssues} duration={3} delay={1} /></span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2 flex">
        <div 
          className="bg-green-600 h-2.5 rounded-l-full" 
          style={{ width: `${(userStats.closedIssues / (userStats.openIssues + userStats.closedIssues) > 0 ? (userStats.closedIssues / (userStats.openIssues + userStats.closedIssues)) * 100 : 0)}%` }}
        ></div>
        <div 
          className="bg-red-600 h-2.5 rounded-r-full" 
          style={{ width: `${(userStats.openIssues / (userStats.openIssues + userStats.closedIssues) > 0 ? (userStats.openIssues / (userStats.openIssues + userStats.closedIssues)) * 100 : 0)}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-xs mt-1">
        <span>Closed</span>
        <span>Open</span>
      </div>
    </motion.div>
  );
} 