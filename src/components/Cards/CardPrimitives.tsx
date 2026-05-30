import {ReactNode} from 'react';
import {formatCompactNumber, formatInteger} from '../../functions/utils';
import {AnimatedCounter} from '../Effects/AnimatedCounter';

type PanelProps = {
	title?: string;
	subtitle?: string;
	children: ReactNode;
	className?: string;
};

type MetricRowProps = {
	label: string;
	value: number | string;
	detail?: string;
	delay?: number;
};

export function Panel({title, subtitle, children, className = ''}: PanelProps) {
	return (
		<div
			className={`h-full w-full overflow-hidden rounded-lg border border-white/10 bg-[#0d1117] p-4 font-mono text-[#f0f3f6] shadow-lg ${className}`}
		>
			{title ? (
				<div className="mb-3 flex items-start justify-between gap-3">
					<div>
						<h2 className="text-lg font-semibold leading-tight">{title}</h2>
						{subtitle ? (
							<p className="mt-1 text-xs text-[#8b949e]">{subtitle}</p>
						) : null}
					</div>
				</div>
			) : null}
			{children}
		</div>
	);
}

export function MetricRow({label, value, detail, delay = 0}: MetricRowProps) {
	const displayValue =
		typeof value === 'number' ? (
			<AnimatedCounter value={value} duration={2} delay={delay} />
		) : (
			value
		);

	return (
		<div className="flex items-center justify-between gap-3 border-b border-white/5 py-1.5 last:border-b-0">
			<div className="min-w-0">
				<p className="text-xs text-[#8b949e]">{label}</p>
				{detail ? <p className="truncate text-[10px] text-[#6e7681]">{detail}</p> : null}
			</div>
			<p className="shrink-0 text-sm font-semibold">{displayValue}</p>
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
			<p className="text-xs uppercase tracking-normal text-[#8b949e]">{label}</p>
			<p className="mt-1 text-4xl font-bold leading-none">
				{formatCompactNumber(value)}
			</p>
			{detail ? <p className="mt-1 text-xs text-[#8b949e]">{detail}</p> : null}
		</div>
	);
}

export function ProgressBar({
	value,
	max,
	color = '#3fb950',
}: {
	value: number;
	max: number;
	color?: string;
}) {
	const percent = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;

	return (
		<div className="h-2 overflow-hidden rounded-full bg-white/10">
			<div
				className="h-full rounded-full"
				style={{width: `${percent}%`, backgroundColor: color}}
			/>
		</div>
	);
}

export function formatDisplayDate(date: string) {
	if (!date) {
		return '';
	}
	const parsed = new Date(date);
	if (Number.isNaN(parsed.getTime())) {
		return date;
	}
	return parsed.toLocaleDateString('en', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	});
}

export function labelNumber(value: number) {
	return formatInteger(value);
}
