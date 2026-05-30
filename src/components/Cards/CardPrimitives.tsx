import {ReactNode} from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {formatCompactNumber, formatInteger} from '../../functions/utils';
import {AnimatedCounter} from '../Effects/AnimatedCounter';

type PanelProps = {
	title?: string;
	subtitle?: string;
	children: ReactNode;
	className?: string;
	accent?: string;
	compact?: boolean;
};

type MetricRowProps = {
	label: string;
	value: number | string;
	detail?: string;
	delay?: number;
	accent?: string;
	icon?: ReactNode;
};

type MetricTileProps = MetricRowProps & {
	large?: boolean;
};

export const theme = {
	background: '#080b12',
	panel: '#0d1117',
	panelLight: '#151b23',
	border: 'rgba(255,255,255,0.12)',
	text: '#f0f3f6',
	muted: '#8b949e',
	faint: '#6e7681',
	green: '#3fb950',
	blue: '#58a6ff',
	yellow: '#f2cc60',
	pink: '#ff7bcb',
	red: '#ff7b72',
	cyan: '#39c5cf',
	purple: '#bc8cff',
};

export function Panel({
	title,
	subtitle,
	children,
	className = '',
	accent = theme.blue,
	compact = false,
}: PanelProps) {
	return (
		<div
			className={`relative h-full w-full overflow-hidden rounded-xl border font-mono text-[#f0f3f6] shadow-2xl ${compact ? 'p-3' : 'p-4'} ${className}`}
			style={{
				background:
					'linear-gradient(135deg, rgba(8,11,18,0.98), rgba(13,17,23,0.98) 48%, rgba(18,24,33,0.96))',
				borderColor: theme.border,
				boxShadow:
					'0 18px 50px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.08)',
			}}
		>
			<div
				className="pointer-events-none absolute inset-0 opacity-[0.22]"
				style={{
					backgroundImage:
						'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
					backgroundSize: '32px 32px',
					maskImage:
						'linear-gradient(180deg, rgba(0,0,0,0.9), rgba(0,0,0,0.15))',
				}}
			/>
			<div
				className="pointer-events-none absolute inset-x-0 top-0 h-px"
				style={{
					background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
				}}
			/>
			<div className="relative z-10 h-full">
				{title ? (
					<div className="mb-3 flex items-start justify-between gap-3">
						<div className="min-w-0">
							<h2 className="truncate text-lg font-semibold leading-tight">
								{title}
							</h2>
							{subtitle ? (
								<p className="mt-1 truncate text-xs text-[#8b949e]">
									{subtitle}
								</p>
							) : null}
						</div>
					</div>
				) : null}
				{children}
			</div>
		</div>
	);
}

export function MetricRow({
	label,
	value,
	detail,
	delay = 0,
	accent = theme.blue,
	icon,
}: MetricRowProps) {
	const displayValue =
		typeof value === 'number' ? (
			<AnimatedCounter value={value} duration={2} delay={delay} />
		) : (
			value
		);

	return (
		<div className="flex min-h-[30px] items-center justify-between gap-3 border-b border-white/5 py-1.5 last:border-b-0">
			<div className="flex min-w-0 items-center gap-2">
				{icon ? (
					<span className="shrink-0" style={{color: accent}}>
						{icon}
					</span>
				) : null}
				<div className="min-w-0">
					<p className="truncate text-xs text-[#b7c0cc]">{label}</p>
					{detail ? (
						<p className="truncate text-[10px] text-[#7d8590]">{detail}</p>
					) : null}
				</div>
			</div>
			<p className="shrink-0 text-sm font-semibold tabular-nums">
				{displayValue}
			</p>
		</div>
	);
}

export function BigMetric({
	label,
	value,
	detail,
}: {
	label: string;
	value: number;
	detail?: string;
}) {
	return (
		<div>
			<p className="text-xs uppercase tracking-normal text-[#8b949e]">
				{label}
			</p>
			<p className="mt-1 text-4xl font-bold leading-none">
				{formatCompactNumber(value)}
			</p>
			{detail ? <p className="mt-1 text-xs text-[#8b949e]">{detail}</p> : null}
		</div>
	);
}

export function MetricTile({
	label,
	value,
	detail,
	delay = 0,
	accent = theme.blue,
	icon,
	large = false,
}: MetricTileProps) {
	const displayValue =
		typeof value === 'number' ? (
			<AnimatedCounter value={value} duration={1.8} delay={delay} />
		) : (
			value
		);

	return (
		<div
			className={`relative h-full overflow-hidden rounded-lg border border-white/10 bg-white/[0.045] ${large ? 'p-3' : 'p-2.5'}`}
			style={{
				boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
			}}
		>
			<div
				className="absolute inset-x-0 top-0 h-px"
				style={{background: `linear-gradient(90deg, ${accent}, transparent)`}}
			/>
			<div
				className={`flex h-full flex-col justify-between ${large ? 'gap-2' : 'gap-1'}`}
			>
				<div className="flex items-center gap-2 text-[#9ba7b4]">
					{icon ? (
						<span className="shrink-0" style={{color: accent}}>
							{icon}
						</span>
					) : null}
					<p className="truncate text-[11px] font-semibold uppercase tracking-normal">
						{label}
					</p>
				</div>
				<p
					className={`${large ? 'text-4xl' : 'text-2xl'} font-bold leading-none tabular-nums text-[#f0f3f6]`}
				>
					{displayValue}
				</p>
				{detail ? (
					<p className="truncate text-[11px] leading-tight text-[#8b949e]">
						{detail}
					</p>
				) : null}
			</div>
		</div>
	);
}

export function ProgressBar({
	value,
	max,
	color = '#3fb950',
	delay = 0,
	height = 8,
}: {
	value: number;
	max: number;
	color?: string;
	delay?: number;
	height?: number;
}) {
	const frame = useCurrentFrame();
	const percent = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
	const animatedPercent = interpolate(
		frame,
		[delay, delay + 42],
		[0, percent],
		{
			easing: Easing.bezier(0.22, 1, 0.36, 1),
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		},
	);

	return (
		<div className="overflow-hidden rounded-full bg-white/10" style={{height}}>
			<div
				className="h-full rounded-full"
				style={{
					width: `${animatedPercent}%`,
					background: `linear-gradient(90deg, ${color}, rgba(255,255,255,0.78))`,
					boxShadow: `0 0 18px ${color}66`,
				}}
			/>
		</div>
	);
}

export function labelNumber(value: number) {
	return formatInteger(value);
}
