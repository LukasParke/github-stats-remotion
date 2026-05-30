import {UserStats} from '../../config';
import {formatCompactNumber} from '../../functions/utils';
import {MetricTile, Panel, ProgressBar, theme} from './CardPrimitives';

export function ActivityOverviewCard({userStats}: {userStats: UserStats}) {
	const timeline = userStats.contributions.timeline.slice(-6);
	const maxContributions = Math.max(
		1,
		...timeline.map((item) => item.contributions),
	);
	const peakDay = userStats.contributions.peakDay;

	return (
		<Panel
			title="Activity Overview"
			subtitle={`${formatCompactNumber(userStats.contributions.totalContributions)} total contributions`}
			accent={theme.green}
		>
			<div className="grid h-[278px] grid-cols-[1fr_170px] gap-3">
				<div className="space-y-2 rounded-lg border border-white/10 bg-white/[0.035] p-3">
					{timeline.map((item, index) => (
						<div
							key={item.period}
							className="grid grid-cols-[48px_1fr_56px] items-center gap-2"
						>
							<p className="text-xs text-[#9ba7b4]">{item.period}</p>
							<ProgressBar
								value={item.contributions}
								max={maxContributions}
								color={theme.green}
								delay={index * 4}
								height={8}
							/>
							<p className="text-right text-xs font-semibold">
								{formatCompactNumber(item.contributions)}
							</p>
						</div>
					))}
				</div>
				<div className="grid gap-2">
					<MetricTile
						label="Current streak"
						value={userStats.contributions.currentStreak}
						detail="days"
						accent={theme.green}
					/>
					<MetricTile
						label="Longest streak"
						value={userStats.contributions.longestStreak}
						detail="days"
						delay={0.1}
						accent={theme.yellow}
					/>
					<MetricTile
						label="Peak day"
						value={peakDay ? peakDay.contributions : 0}
						detail={peakDay?.date}
						delay={0.2}
						accent={theme.blue}
					/>
				</div>
			</div>
		</Panel>
	);
}
