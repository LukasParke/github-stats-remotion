import {CalculateMetadataFunction, Composition} from 'remotion';
import './style.css';

import {Main, MainProps, mainSchema} from './Main';
import {getUserStats} from './functions/setup';
import {Config} from './config';

const {FPS, DurationInFrames, Width, Height} = Config;

export const RemotionRoot = () => {
	const calculateMetadata: CalculateMetadataFunction<MainProps> = async (
		props
	) => {
		const userStats = await getUserStats();

		return {
			props: {
				...props,
				userStats,
			},
		};
	};

	return (
		<>
			<Composition
				id="main"
				component={Main}
				durationInFrames={DurationInFrames}
				fps={FPS}
				width={Width}
				height={Height}
				schema={mainSchema}
				calculateMetadata={calculateMetadata}
				defaultProps={{
					userStats: {
						name: 'Luke Hagar',
						username: 'lukehagar',
						repoViews: 2,
						codeByteTotal: 2400000,
						linesOfCodeChanged: 2400000,
						totalCommits: 2726,
						totalPullRequests: 179,
						topLanguages: [
							{
								languageName: 'TypeScript',
								color: '#3178c6',
								value: 4419.008459,
							},
							{
								languageName: 'JavaScript',
								color: '#f1e05a',
								value: 2239.867136,
							},
							{languageName: 'Go', color: '#00ADD8', value: 2225.640094},
							{languageName: 'Svelte', color: '#ff3e00', value: 1584.8068},
							{languageName: 'CSS', color: '#563d7c', value: 957.179542},
							{languageName: 'PowerShell', color: '#012456', value: 637.865716},
							{
								languageName: 'MDX',
								color: '#fcb32c',
								value: 502.19400200000007,
							},
							{
								languageName: 'Makefile',
								color: '#427819',
								value: 342.96481200000005,
							},
							{languageName: 'Mustache', color: '#724b3b', value: 340.13382},
							{
								languageName: 'Shell',
								color: '#89e051',
								value: 136.35571199999998,
							},
							{
								languageName: 'Java',
								color: '#b07219',
								value: 50.61637499999999,
							},
							{languageName: 'Python', color: '#3572A5', value: 41.396241},
							{languageName: 'C#', color: '#178600', value: 20.586607},
							{
								languageName: 'SCSS',
								color: '#c6538c',
								value: 15.905809999999999,
							},
							{languageName: 'PHP', color: '#4F5D95', value: 9.765732},
							{languageName: 'EJS', color: '#a91e50', value: 0},
							{languageName: 'Starlark', color: '#76d275', value: 0},
						],
						starCount: 81,
						forkCount: 16,
						totalContributions: 3343,
						closedIssues: 30,
						openIssues: 14,
						fetchedAt: 1706272208164,
						contributionData: [{contributionCount: 1, date: '2013-10-16'}],
					},
				}}
			/>
		</>
	);
};
