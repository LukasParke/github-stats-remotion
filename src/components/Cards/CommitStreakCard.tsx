import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {UserStats} from '../../config';
import {AnimatedCounter} from '../Effects/AnimatedCounter';
import {Panel, ProgressBar, theme} from './CardPrimitives';

export function CommitStreakCard({userStats}: {userStats: UserStats}) {
	const frame = useCurrentFrame();
	const current = userStats.contributions.currentStreak;
	const longest = Math.max(userStats.contributions.longestStreak, current, 1);
	const progress = current / longest;
	const circumference = 295;
	const dashOffset = interpolate(
		frame,
		[0, 50],
		[circumference, circumference * (1 - progress)],
		{
			easing: Easing.bezier(0.22, 1, 0.36, 1),
			extrapolateRight: 'clamp',
		},
	);

	return (
		<Panel
			title="Commit Streak"
			subtitle={`${longest} day longest streak`}
			accent={theme.green}
		>
			<div className="grid h-[158px] grid-cols-[142px_1fr] items-center gap-4">
				<svg viewBox="0 0 120 120" className="h-[118px] w-[118px]">
					<defs>
						<linearGradient
							id="streak-ring"
							x1="0%"
							y1="0%"
							x2="100%"
							y2="100%"
						>
							<stop offset="0%" stopColor={theme.green} />
							<stop offset="100%" stopColor={theme.cyan} />
						</linearGradient>
					</defs>
					<circle
						cx="60"
						cy="60"
						r="47"
						fill="none"
						stroke="rgba(255,255,255,0.1)"
						strokeWidth="11"
					/>
					<circle
						cx="60"
						cy="60"
						r="47"
						fill="none"
						stroke="url(#streak-ring)"
						strokeLinecap="round"
						strokeWidth="11"
						strokeDasharray={circumference}
						strokeDashoffset={dashOffset}
						transform="rotate(-90 60 60)"
					/>
					<text
						x="60"
						y="65"
						textAnchor="middle"
						fontSize="24"
						fontWeight="700"
						fill="#f0f3f6"
					>
						{Math.round(progress * 100)}%
					</text>
				</svg>
				<div className="min-w-0">
					<p className="text-5xl font-bold leading-none tabular-nums">
						<AnimatedCounter value={current} duration={2} />
					</p>
					<p className="mt-1 text-sm text-[#b7c0cc]">day current streak</p>
					<div className="mt-4">
						<ProgressBar value={current} max={longest} color={theme.green} />
					</div>
					<p className="mt-2 truncate text-xs text-[#8b949e]">
						{Math.round(progress * 100)}% of longest contribution streak
					</p>
				</div>
			</div>
		</Panel>
	);
}
