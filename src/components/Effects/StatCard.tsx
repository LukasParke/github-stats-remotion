import { motion } from 'framer-motion';
import { useVideoConfig } from 'remotion';
import { AnimatedCounter } from './AnimatedCounter';

export const StatCard = ({ title, value, duration = 3, gradient, delay }) => {
  const { fps } = useVideoConfig();
  const startFrame = delay * fps;

  return (
    <motion.div
      className={`bg-gray-800 rounded-lg p-4 shadow-lg ${gradient} flex flex-col h-[120px]`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      aria-label={`${title}: ${value}`}
    >
      <h3 className="text-sm whitespace-nowrap font-semibold opacity-80">{title}</h3>
      <div className="flex-grow flex items-center">
        <p className="text-3xl font-bold">
          <AnimatedCounter value={value} duration={duration} startFrame={startFrame} />
        </p>
      </div>
    </motion.div>
  );
}; 