import {UserStats} from '../../config';
import {formatCompactNumber} from '../../functions/utils';
import {MetricRow, Panel, ProgressBar} from './CardPrimitives';

export function ActivityOverviewCard({userStats}: {userStats: UserStats}) {
	const timeline = userStats.contributions.timeline.slice(-5);
	const maxContributions = Math.max(
		1,
		...timeline.map((item) => item.contributions)
	);
	const peakDay = userStats.contributions.peakDay;

	return (
		<Panel
			title="Activity Overview"
			subtitle={`${formatCompactNumber(userStats.contributions.totalContributions)} total contributions`}
		>
			<div className="grid grid-cols-[1fr_150px] gap-4">
				<div className="space-y-2">
					{timeline.map((item) => (
						<div key={item.period} className="grid grid-cols-[44px_1fr_52px] items-center gap-2">
							<p className="text-xs text-[#8b949e]">{item.period}</p>
							<ProgressBar
								value={item.contributions}
								max={maxContributions}
								color="#3fb950"
							/>
							<p className="text-right text-xs font-semibold">
								{formatCompactNumber(item.contributions)}
							</p>
						</div>
					))}
				</div>
				<div>
					<MetricRow
						label="Current streak"
						value={userStats.contributions.currentStreak}
						detail="days"
					/>
					<MetricRow
						label="Longest streak"
						value={userStats.contributions.longestStreak}
						detail="days"
						delay={0.1}
					/>
					<MetricRow
						label="Peak day"
						value={peakDay ? peakDay.contributions : 0}
						detail={peakDay?.date}
						delay={0.2}
					/>
				</div>
			</div>
		</Panel>
	);
}
