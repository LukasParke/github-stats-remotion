import { motionValue, useTransform } from 'framer-motion';
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
import { AbsoluteFill, Img, useCurrentFrame } from 'remotion';
import { UserStats } from '../../config';
import { interpolateFactory } from '../../functions/utils';
import { AnimatedCounter } from '../Effects/AnimatedCounter';
import { GoogleGeminiEffect } from '../Effects/Gemini';


export function ReadmeCard({userStats}: {userStats: UserStats}) {
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
			<div className="bg-[#282a36] text-[#f8f8f2] p-3 h-full font-mono rounded-xl shadow-2xl overflow-hidden relative">
				<div className="flex flex-row justify-start gap-4 pb-4">
					<Img className="rounded-full size-10" src={userStats.avatarUrl} />
					<p className="my-auto">
						Hi, I'm {userStats.name || userStats.username}
					</p>
				</div>
				<div className="absolute left-0 right-0 bottom-0 top-[9rem] -rotate-[105deg] scale-[1.5]">
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
								<AnimatedCounter value={field.value} duration={3} startFrame={(i + 1) * 5} />
							</p>
						</div>
					))}
				</div>
			</div>
		</AbsoluteFill>
	);
}
