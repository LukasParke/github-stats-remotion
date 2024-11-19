import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { UserStats } from '../../config';
import { interpolateFactory } from '../../functions/utils';
import Close from '../SVGs/close';
import Commit from '../SVGs/commit';
import Contribution from '../SVGs/contribution';
import Fork from '../SVGs/fork';
import Open from '../SVGs/open';
import PlusMinus from '../SVGs/plusminus';
import PullRequest from '../SVGs/pull-request';
import Star from '../SVGs/star';
import View from '../SVGs/view';
import { AnimatedCounter } from '../Effects/AnimatedCounter';

export function Stats({ userStats }: { userStats: UserStats }) {
	const frame = useCurrentFrame();

	const firstFields: {
		icon?;
		label: string;
		value: number;
	}[] = [
			{
				icon: Star,
				label: 'Stars',
				value: userStats.starCount,
			},
			{ icon: Fork, label: 'Forks', value: userStats.forkCount },
			{ icon: Commit, label: 'Commits', value: userStats.totalCommits },
			{
				icon: PullRequest,
				label: 'Pull Requests',
				value: userStats.totalPullRequests,
			},
			{ icon: Open, label: 'Opened Issues', value: userStats.openIssues },
			{ icon: Close, label: 'Closed Issues', value: userStats.closedIssues },
			{ icon: View, label: 'Repo Views (2 wks)', value: userStats.repoViews },
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
		<AbsoluteFill className="bg-transparent p-1">
			<div className="bg-[#282a36] p-3 text-[#f8f8f2] h-full font-mono rounded-xl shadow-2xl">
				<div className="flex flex-col justify-between h-full">
					{firstFields.map((field, i) => (
						<div
							key={`${field.label}`}
							className="flex flex-row justify-between gap-2"
							style={{ opacity: interpolateFactory(frame, i / 5, 1) }}
						>
							<div className="flex gap-2">
								{field.icon && <field.icon className="w-5 h-5" />}
								<p className="text-sm whitespace-nowrap my-auto">
									{field.label}:
								</p>
							</div>
							<p className="text-start text-sm my-auto">
								<AnimatedCounter value={field.value} duration={3} startFrame={(i + 1) * 5} />
							</p>
						</div>
					))}
				</div>
			</div>
		</AbsoluteFill>
	);
}
