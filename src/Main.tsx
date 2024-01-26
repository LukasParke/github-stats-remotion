import {z} from 'zod';
import {Content} from './components/Content';

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

export function Main({userStats}: MainProps) {
	console.log(userStats);

	if (!userStats) {
		return null;
	}

	return <Content userStats={userStats} />;
}
