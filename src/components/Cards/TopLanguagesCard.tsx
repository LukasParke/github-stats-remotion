import { useCurrentFrame } from 'remotion';
import { UserStats } from '../../config';
import { formatBytes } from '../../functions/utils';
import { fadeInAndSlideUp } from '../../functions/animations';

export function TopLanguagesCard({ userStats }: { userStats: UserStats }) {
  const frame = useCurrentFrame();

  return (
    <div
      className="bg-[#282a36] text-[#f8f8f2] rounded-lg p-4 shadow-lg text-white w-full"
      style={fadeInAndSlideUp(frame)}
    >
      <h2 className="text-xl font-semibold mb-2 opacity-80">Top Languages</h2>
      <div className="grid grid-cols-2 gap-1">
        {userStats.topLanguages.slice(0, 8).map((lang, index) => (
          <div
            key={lang.languageName}
            className="flex items-center p-2 bg-gray-700 rounded-lg"
            style={fadeInAndSlideUp(frame - (index * 2))}
          >
            <div className={`w-4 h-4 rounded-full mr-2`} style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }}></div>
            <span className="text-sm flex-grow">{lang.languageName}</span>
            <span className="text-sm font-semibold">{formatBytes(lang.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 