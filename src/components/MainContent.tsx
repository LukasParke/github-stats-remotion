import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Config, UserStats} from '../config';
import {addCommas} from '../functions/utils';
import Star from './SVGs/star';
import Fork from './SVGs/fork';
import Commit from './SVGs/commit';
import PullRequest from './SVGs/pull-request';
import PlusMinus from './SVGs/plusminus';
import Close from './SVGs/close';
import Open from './SVGs/open';
import View from './SVGs/view';
import Contribution from './SVGs/contribution';

const {FPS} = Config;

function interpolateFactory(
	frame: number,
	delayInSeconds: number,
	durationInSeconds: number,
	finalOpacity: number = 1
) {
	const delay = delayInSeconds * FPS;
	const duration = durationInSeconds * FPS + delay;
	return interpolate(frame, [delay, duration], [0, finalOpacity], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
}

export function MainContent({userStats}: {userStats: UserStats}) {
	const frame = useCurrentFrame();

	const firstFields: {
		icon?: any;
		label: string;
		value: number;
	}[] = [
		{
			icon: Star,
			label: 'Stars',
			value: userStats.starCount,
		},
		{icon: Fork, label: 'Forks', value: userStats.forkCount},
		{icon: Commit, label: 'Commits', value: userStats.totalCommits},
		{
			icon: PullRequest,
			label: 'Pull Requests',
			value: userStats.totalPullRequests,
		},
		{icon: Open, label: 'Opened Issues', value: userStats.openIssues},
		{icon: Close, label: 'Closed Issues', value: userStats.closedIssues},
		{icon: View, label: 'Repo Views (2 wks)', value: userStats.repoViews},
		{
			icon: PlusMinus,
			label: 'Lines of code changed',
			value: userStats.linesOfCodeChanged,
		},
		{
			icon: Contribution,
			label: 'Total contributions',
			value: userStats.totalContributions,
		},
	];

	return (
		<AbsoluteFill className="bg-[#151a24] p-2 text-gray-300 font-mono">
			<div className="flex flex-col justify-between grow">
				{firstFields.map((field, i) => (
					<div
						key={`${field.label}`}
						className="flex flex-row justify-between gap-2"
						style={{opacity: interpolateFactory(frame, i / 5, 1)}}
					>
						<div className="flex gap-2">
							{field.icon && <field.icon className="w-5 h-5" />}
							<p className="text-sm whitespace-nowrap my-auto">
								{field.label}:
							</p>
						</div>
						<p className="text-start text-sm my-auto">
							{addCommas(field.value)}
						</p>
					</div>
				))}
			</div>
		</AbsoluteFill>
	);
}
