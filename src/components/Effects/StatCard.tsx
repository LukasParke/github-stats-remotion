import {useCurrentFrame} from 'remotion';
import {fadeInAndSlideUp} from '../../functions/animations';
import {formatCompactNumber} from '../../functions/utils';
import {AnimatedCounter} from './AnimatedCounter';
import {theme} from '../Cards/CardPrimitives';

type StatCardProps = {
	title: string;
	value: number;
	detail?: string;
	accent?: string;
	delay?: number;
	compact?: boolean;
};

export const StatCard = ({
	title,
	value,
	detail,
	accent = '#60a5fa',
	delay = 0,
	compact = false,
}: StatCardProps) => {
	const frame = useCurrentFrame();
	const delayFrames = Math.round(delay * 24);

	return (
		<div
			className="relative flex h-full flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-white/[0.045] p-4 text-[#f0f3f6] shadow-2xl"
			style={{
				...fadeInAndSlideUp(frame, delayFrames),
				borderTopColor: accent,
				background:
					'linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.025))',
				boxShadow:
					'0 18px 42px rgba(0,0,0,0.34), inset 0 1px 0 rgba(255,255,255,0.07)',
			}}
			aria-label={`${title}: ${value}`}
		>
			<div
				className="absolute inset-x-0 top-0 h-px"
				style={{background: `linear-gradient(90deg, ${accent}, transparent)`}}
			/>
			<div
				className="absolute bottom-0 left-0 h-px"
				style={{
					width: `${Math.min(100, Math.max(18, value ? 78 : 18))}%`,
					backgroundColor: accent,
					opacity: 0.45,
				}}
			/>
			<h3 className="truncate text-xs font-semibold uppercase tracking-normal text-[#9ba7b4]">
				{title}
			</h3>
			<p
				className={`leading-none tabular-nums ${compact ? 'text-2xl' : 'text-3xl'} font-bold`}
			>
				{compact ? (
					formatCompactNumber(value)
				) : (
					<AnimatedCounter value={value} duration={2} delay={delay} />
				)}
			</p>
			{detail ? (
				<p className="truncate text-[11px] text-[#8b949e]">{detail}</p>
			) : (
				<p className="text-[11px]" style={{color: theme.faint}}>
					&nbsp;
				</p>
			)}
		</div>
	);
};
