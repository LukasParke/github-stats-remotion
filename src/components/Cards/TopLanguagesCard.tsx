import { motion } from 'framer-motion';
import { UserStats } from '../../config';
import { formatBytes } from '../../functions/utils';

export function TopLanguagesCard({ userStats }: { userStats: UserStats }) {

  return (
    <motion.div
      className="bg-gray-800 rounded-lg p-4 shadow-lg text-white w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold mb-2 opacity-80">Top Languages</h2>
      <div className="grid grid-cols-2 gap-1">
        {userStats.topLanguages.slice(0, 8).map((lang, index) => (
          <motion.div
          initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex items-center p-2 bg-gray-700 rounded-lg"
          >
            <div className={`w-4 h-4 rounded-full mr-2`} style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }}></div>
            <span className="text-sm flex-grow">{lang.languageName}</span>
            <span className="text-sm font-semibold">{formatBytes(lang.value)}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
} 