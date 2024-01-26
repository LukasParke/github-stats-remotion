import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {UserStats} from '../Main';
import {Config} from '../config';
import {Languages} from '../Languages';
import {addCommas, percentage} from '../functions/utils';

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

export function Content({userStats}: {userStats: UserStats}) {
	const frame = useCurrentFrame();

	const firstFields = [
		{label: 'Stars', value: userStats.starCount},
		{label: 'Forks', value: userStats.forkCount},
		{label: 'Commits', value: userStats.totalCommits},
		{label: 'Pull Requests', value: userStats.totalPullRequests},
		{label: 'Opened Issues', value: userStats.openIssues},
		{label: 'Closed Issues', value: userStats.closedIssues},
		{label: 'Repo Views (2 wks)', value: userStats.repoViews},
		{
			label: 'Lines of code changed',
			value: userStats.linesOfCodeChanged,
		},
		{
			label: 'Total contributions',
			value: userStats.totalContributions,
		},
	];

	return (
		<AbsoluteFill className="bg-[#112142] p-2 text-gray-300 font-mono">
			<div className="flex flex-col justify-between gap-2">
				<div className="flex flex-row justify-start gap-2 p-1">
					<div className="flex flex-col justify-between grow">
						{firstFields.map((field, i) => (
							<div
								key={`${field.label}`}
								className="flex flex-row justify-between gap-2"
							>
								<p
									style={{opacity: interpolateFactory(frame, i / 5, 1)}}
									className="text-sm whitespace-nowrap"
								>
									{field.label}:
								</p>
								<p
									className="text-start text-sm"
									style={{opacity: interpolateFactory(frame, i / 5, 1)}}
								>
									{addCommas(field.value)}
								</p>
							</div>
						))}
					</div>
				</div>
				<div
					style={{opacity: interpolateFactory(frame, 1 / 5, 1)}}
					className="bg-white rounded-lg p-2"
				>
					<div className="grid grid-rows-3 grid-cols-3 gap-2">
						{userStats.topLanguages.slice(0, 9).map((lang, i) => (
							<div
								key={`${lang.languageName}`}
								style={{
									opacity: interpolateFactory(
										frame,
										(i + 1 + firstFields.length) / 5,
										1
									),
								}}
							>
								<p
									className={`text-md ${
										// @ts-expect-error Ain't nobody got time to list all those types
										Languages[lang.languageName].color
									} font-bold text-center`}
								>
									{lang.languageName}
								</p>
								<p className="text-black text-sm font-bold text-center my-0">
									{percentage(lang.value, userStats.codeByteTotal).toFixed(1)}%
								</p>
							</div>
						))}
					</div>
				</div>
				<p
					style={{opacity: interpolateFactory(frame, 5, 1, 0.5)}}
					className="text-xs text-end my-auto"
				>
					{`Last updated ${new Date(userStats.fetchedAt).toLocaleString()}`}
				</p>
			</div>
		</AbsoluteFill>
	);
}
