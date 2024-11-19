import { useEffect, useState } from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { UserStats } from '../../config';
import { AnimatedCounter } from '../Effects/AnimatedCounter';
import { fadeInAndSlideUp } from '../../functions/animations';
import { formatBytes } from '../../functions/utils';
import { StatCard } from '../Effects/StatCard';

// const StatCard = ({ title, value, duration = 3, gradient, delay }) => {
//   const { fps } = useVideoConfig();
//   const frame = useCurrentFrame();
//   const startFrame = delay * fps;
  
//   const animation = fadeInAndSlideUp(frame, startFrame);

//   return (
//     <div
//       className={`bg-gray-800 rounded-lg p-4 shadow-lg ${gradient}`}
//       style={animation}
//       aria-label={`${title}: ${value}`}
//     >
//       <h3 className="text-lg font-semibold mb-2 opacity-80">{title}</h3>
//       <p className="text-3xl font-bold">
//         <AnimatedCounter value={value} duration={duration} startFrame={startFrame} />
//       </p>
//     </div>
//   );
// };

const LanguageItem = ({ language, bytes, color }) => (
  <div className="flex items-center mb-2 p-2 bg-gray-700 rounded-lg">
    <div className={`w-4 h-4 rounded-full mr-2`} style={{ backgroundColor: color }}></div>
    <span className="text-sm flex-grow">{language}</span>
    <span className="text-sm font-semibold">{formatBytes(bytes)}</span>
  </div>
);

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

export function StatsContent({userStats}: {userStats: UserStats}) {
  const [isLoading, setIsLoading] = useState(true);
  const frame = useCurrentFrame();

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <p className="text-2xl">Loading GitHub stats...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-5xl w-full space-y-8">
        <h1
          className="text-5xl font-bold text-center mb-8"
            style={fadeInAndSlideUp(frame)}
        >
          GitHub Profile Stats
        </h1>

        <div className="grid grid-cols-3 gap-6">
          <StatCard title="Total Stars" value={userStats.starCount} gradient="bg-gradient-to-br from-yellow-400/10 to-orange-500/10" delay={0.2} />
          <StatCard title="Total Forks" value={userStats.forkCount} gradient="bg-gradient-to-br from-green-400/10 to-blue-500/10" delay={0.6} />
          <StatCard title="Repo Views (2 weeks)" value={userStats.repoViews} gradient="bg-gradient-to-br from-purple-400/10 to-pink-500/10" delay={1.0} />
          <StatCard title="Total Commits" value={userStats.totalCommits} gradient="bg-gradient-to-br from-red-400/10 to-yellow-500/10" delay={1.4} />
          <StatCard title="Pull Requests" value={userStats.totalPullRequests} gradient="bg-gradient-to-br from-blue-400/10 to-indigo-500/10" delay={1.8} />
          <StatCard title="Total Contributions" value={userStats.totalContributions} gradient="bg-gradient-to-br from-green-400/10 to-teal-500/10" delay={2.2} />
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div
            className="bg-[#282a36] text-[#f8f8f2] rounded-lg p-4 shadow-lg"
            style={fadeInAndSlideUp(frame)}
          >
            <h2 className="text-xl font-semibold mb-4 opacity-80">Issue Tracking</h2>
            <div className="flex justify-between mb-2">
              <span className="opacity-80">Issues Opened:</span>
              <span className="font-semibold"><AnimatedCounter value={userStats.openIssues} duration={3} /></span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="opacity-80">Issues Closed:</span>
              <span className="font-semibold"><AnimatedCounter value={userStats.closedIssues} duration={3} /></span>
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
          </div>

          <div
            className="bg-[#282a36] text-[#f8f8f2] rounded-lg p-4 shadow-lg"
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
                />
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="opacity-80">Code Review Comments:</span>
              <span className="font-semibold">
                <AnimatedCounter value={200} duration={3} />
              </span>
            </div>
          </div>

          <div
            className="bg-[#282a36] text-[#f8f8f2] rounded-lg p-4 shadow-lg"
            style={fadeInAndSlideUp(frame)}
          >
            <h2 className="text-xl font-semibold mb-4 opacity-80">Activity Overview</h2>
            <div className="flex justify-between mb-2">
              <span className="opacity-80">Active Days:</span>
              <span className="font-semibold"><AnimatedCounter value={180} duration={3} /></span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="opacity-80">Repos Contributed To:</span>
              <span className="font-semibold"><AnimatedCounter value={25} duration={3} /></span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="opacity-80">Longest Streak:</span>
              <span className="font-semibold"><AnimatedCounter value={30} duration={3} /> days</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div
            className="bg-[#282a36] text-[#f8f8f2] rounded-lg p-4 shadow-lg overflow-hidden relative"
            style={fadeInAndSlideUp(frame)}
          >
            <h2 className="text-xl font-semibold mb-4 opacity-80">Commit Streak</h2>
            <div className="flex items-center justify-center">
              <CommitStreak streak={200} />
            </div>
          </div>

          <div
            className="bg-[#282a36] text-[#f8f8f2] rounded-lg p-4 shadow-lg"
            style={fadeInAndSlideUp(frame)}
          >
            <h2 className="text-xl font-semibold mb-4 opacity-80">Top Languages</h2>
            <div className="grid grid-cols-2 gap-2">
              {userStats.topLanguages.slice(0, 6).map((lang, index) => (
                <LanguageItem 
                  key={index} 
                  language={lang.languageName} 
                  bytes={lang.value} 
                  color={`hsl(${index * 60}, 70%, 50%)`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}