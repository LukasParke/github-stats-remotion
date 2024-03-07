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

const ContributionDay = z.object({
	contributionCount: z.number(),
	date: z.string(),
});

const Week = z.object({
	contributionDays: z.array(ContributionDay),
});

const ContributionCalendar = z.object({
	totalContributions: z.number(),
	weeks: z.array(Week),
});

const ContributionsCollection = z.object({
	totalCommitContributions: z.number(),
	restrictedContributionsCount: z.number(),
	totalIssueContributions: z.number(),
	totalRepositoryContributions: z.number(),
	totalPullRequestContributions: z.number(),
	totalPullRequestReviewContributions: z.number(),
	contributionCalendar: ContributionCalendar,
});

export const userStatsSchema = z.object({
	name: z.string(),
	avatarUrl: z.string(),
	username: z.string(),
	repoViews: z.number(),
	linesOfCodeChanged: z.number(),
	linesAdded: z.number(),
	linesDeleted: z.number(),
	linesChanged: z.number(),
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
	contributionsCollection: ContributionsCollection,
	contributionCalendar: z.array(ContributionDay),
});

export const mainSchema = z.object({
	userStats: userStatsSchema,
});

export type MainProps = typeof mainSchema._output;
export type UserStats = typeof userStatsSchema._output;
