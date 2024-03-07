import {
	ArrowDownFromLine,
	ArrowUpFromLine,
	Diff,
	GitCommitHorizontal,
	GitFork,
	GitPullRequest,
	HandHeart,
	Sparkles,
	Telescope,
} from 'lucide-react';
import {AbsoluteFill, Img, interpolate, useCurrentFrame} from 'remotion';
import {Config, UserStats} from '../config';
import {addCommas} from '../functions/utils';
import {GoogleGeminiEffect} from './Gemini';
import {motionValue, useTransform} from 'framer-motion';

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

export function ReadmeContent({userStats}: {userStats: UserStats}) {
	const frame = useCurrentFrame();

	const pathLengthFirst = useTransform(
		motionValue(interpolateFactory(frame, 0, 10, 0.8)),
		[0, 0.8],
		[0.2, 1.2]
	);
	const pathLengthSecond = useTransform(
		motionValue(interpolateFactory(frame, 0, 10, 0.8)),
		[0, 0.8],
		[0.15, 1.2]
	);
	const pathLengthThird = useTransform(
		motionValue(interpolateFactory(frame, 0, 10, 0.8)),
		[0, 0.8],
		[0.1, 1.2]
	);
	const pathLengthFourth = useTransform(
		motionValue(interpolateFactory(frame, 0, 10, 0.8)),
		[0, 0.8],
		[0.05, 1.2]
	);
	const pathLengthFifth = useTransform(
		motionValue(interpolateFactory(frame, 0, 10, 0.8)),
		[0, 0.8],
		[0, 1.2]
	);

	const firstFields: {
		icon?;
		label: string;
		value: number;
	}[] = [
		{
			icon: <Sparkles size={20} />,
			label: 'Stars',
			value: userStats.starCount,
		},
		{icon: <GitFork size={20} />, label: 'Forks', value: userStats.forkCount},
		{
			icon: <GitCommitHorizontal size={20} />,
			label: 'Commits',
			value: userStats.totalCommits,
		},
		{
			icon: <GitPullRequest size={20} />,
			label: 'Pull Requests',
			value: userStats.totalPullRequests,
		},
		{
			icon: <ArrowUpFromLine size={20} />,
			label: 'Opened Issues',
			value: userStats.openIssues,
		},
		{
			icon: <ArrowDownFromLine size={20} />,
			label: 'Closed Issues',
			value: userStats.closedIssues,
		},
		{
			icon: <Telescope size={20} />,
			label: 'Repo Views (2 wks)',
			value: userStats.repoViews,
		},
		{
			icon: <Diff size={20} />,
			label: 'Lines of code changed',
			value: userStats.linesOfCodeChanged,
		},
		{
			icon: <HandHeart size={20} />,
			label: 'Total contributions',
			value: userStats.totalContributions,
		},
	];

	return (
		<AbsoluteFill className="bg-transparent p-1">
			<div className="bg-[#282a36] p-3 text-[#f8f8f2] h-full font-mono rounded-xl shadow-2xl overflow-hidden relative">
				<div className="flex flex-row justify-start gap-4 pb-4">
					<Img className="rounded-full size-10" src={userStats.avatarUrl} />
					<p className="my-auto">
						Hi My name is {userStats.name || userStats.username}
					</p>
				</div>
				<div className="absolute left-0 right-0 bottom-0 top-[5rem] -rotate-[69deg] scale-[1.5]">
					<GoogleGeminiEffect
						pathLengths={[
							pathLengthFirst,
							pathLengthSecond,
							pathLengthThird,
							pathLengthFourth,
							pathLengthFifth,
						]}
					/>
				</div>
				<div className="flex flex-col justify-start gap-2 h-full">
					{firstFields.map((field, i) => (
						<div
							key={`${field.label}`}
							className="flex flex-row justify-between gap-2"
							style={{opacity: interpolateFactory(frame, i / 5, 1)}}
						>
							<div className="flex gap-2">
								{field.icon}

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
			</div>
		</AbsoluteFill>
	);
}
