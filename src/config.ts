import {z} from 'zod';

export const FPS = 30;
export const DurationInSeconds = 10;
export const DurationInFrames = FPS * DurationInSeconds;

export const Config = {
	FPS,
	DurationInSeconds,
	DurationInFrames,
};

export const NOT_LANGUAGES = [
	'html',
	'markdown',
	'dockerfile',
	'roff',
	'rich text format',
	'powershell',
	'css',
	'php',
];

export const userStatsSchema = z.object({
	name: z.string(),
	username: z.string(),
	repoViews: z.number(),
	linesOfCodeChanged: z.number(),
	totalCommits: z.number(),
	totalPullRequests: z.number(),
	openIssues: z.number(),
	closedIssues: z.number(),
	fetchedAt: z.number(),
	forkCount: z.number(),
	starCount: z.number(),
	totalContributions: z.number(),
	codeByteTotal: z.number(),
	topLanguages: z.array(
		z.object({
			languageName: z.string(),
			color: z.string().nullable(),
			value: z.number(),
		})
	),
	contributionData: z.array(
		z.object({contributionCount: z.number(), date: z.string()})
	),
});

export const mainSchema = z.object({
	userStats: userStatsSchema,
});

export type MainProps = typeof mainSchema._output;
export type UserStats = typeof userStatsSchema._output;
