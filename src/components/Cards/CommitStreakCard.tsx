import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {UserStats} from '../../config';
import {AnimatedCounter} from '../Effects/AnimatedCounter';
import {Panel} from './CardPrimitives';

export function CommitStreakCard({userStats}: {userStats: UserStats}) {
	const frame = useCurrentFrame();
	const current = userStats.contributions.currentStreak;
	const longest = Math.max(userStats.contributions.longestStreak, current, 1);
	const progress = current / longest;
	const dashOffset = interpolate(frame, [0, 50], [283, 283 * (1 - progress)], {
		easing: Easing.bezier(0.22, 1, 0.36, 1),
		extrapolateRight: 'clamp',
	});

	return (
		<Panel title="Commit Streak" subtitle={`${longest} day longest streak`}>
			<div className="flex h-[78px] items-center justify-center gap-6">
				<svg viewBox="0 0 110 110" className="h-[86px] w-[86px]">
					<circle
						cx="55"
						cy="55"
						r="45"
						fill="none"
						stroke="rgba(255,255,255,0.1)"
						strokeWidth="10"
					/>
					<circle
						cx="55"
						cy="55"
						r="45"
						fill="none"
						stroke="#3fb950"
						strokeLinecap="round"
						strokeWidth="10"
						strokeDasharray="283"
						strokeDashoffset={dashOffset}
						transform="rotate(-90 55 55)"
					/>
				</svg>
				<div>
					<p className="text-4xl font-bold leading-none">
						<AnimatedCounter value={current} duration={2} />
					</p>
					<p className="mt-1 text-xs text-[#8b949e]">day current streak</p>
					<p className="mt-2 text-xs text-[#8b949e]">
						{Math.round(progress * 100)}% of longest
					</p>
				</div>
			</div>
		</Panel>
	);
}
