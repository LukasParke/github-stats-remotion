import {useCurrentFrame} from 'remotion';
import {fadeInAndSlideUp} from '../../functions/animations';
import {formatCompactNumber} from '../../functions/utils';
import {AnimatedCounter} from './AnimatedCounter';

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

	return (
		<div
			className="flex h-full flex-col justify-between rounded-lg border border-white/10 bg-[#161b22] p-3 text-[#f0f3f6] shadow-lg"
			style={{
				...fadeInAndSlideUp(frame, delay),
				borderTopColor: accent,
			}}
			aria-label={`${title}: ${value}`}
		>
			<h3 className="text-xs font-semibold uppercase tracking-normal text-[#8b949e]">
				{title}
			</h3>
			<p className={compact ? 'text-2xl font-bold' : 'text-3xl font-bold'}>
				{compact ? (
					formatCompactNumber(value)
				) : (
					<AnimatedCounter value={value} duration={2} delay={delay} />
				)}
			</p>
			{detail ? <p className="text-[11px] text-[#8b949e]">{detail}</p> : null}
		</div>
	);
};
