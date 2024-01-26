import {UserStats} from '../Main';
import {Language} from '../Types';
import {NOT_LANGUAGES} from '../config';

import {
	getContributionCollection,
	getGraphQLData,
	getReposContributorsStats,
	getReposViewCount,
	getTotalCommits,
	getUserDetails,
} from './ocktokit';

const NOT_LANGUAGES_OBJ = Object.fromEntries(
	NOT_LANGUAGES.map((l) => [l, true])
);

export const getStatsFromGitHub = async ({
	username,
	token,
}: {
	username: string;
	token: string;
}): Promise<UserStats> => {
	const fetchedAt = Date.now();

	const userDetails = await getUserDetails(username, token);

	const [graphQLData, totalCommits, contributionsCollection] =
		await Promise.all([
			getGraphQLData(username, token),
			getTotalCommits(username, token),
			getContributionCollection(userDetails.data.created_at, token),
		]);

	let starCount = 0;
	let forkCount = 0;
	for (const repo of graphQLData.user.repositories.nodes) {
		starCount += repo.stargazers.totalCount;
		forkCount += repo.forkCount;
	}

	const contributorStatsPromises = [];
	const viewCountPromises = [];
	for (const repo of graphQLData.user.repositories.nodes) {
		contributorStatsPromises.push(
			getReposContributorsStats(username, repo.name, token)
		);
		viewCountPromises.push(getReposViewCount(username, repo.name, token));
	}

	const contributorStats = (await Promise.all(contributorStatsPromises))
		.filter((entry) => entry !== null || entry !== undefined)
		.map((entry) => {
			return (Array.isArray(entry.data) ? entry.data : [entry.data])
				.filter(
					(contributor) => contributor.author?.login === userDetails.data.login
				)
				.map((contributor) => contributor.weeks);
		});

	let linesOfCodeChanged = 0;

	for (const repo of contributorStats) {
		for (const week of repo) {
			for (const day of week) {
				linesOfCodeChanged += (day.a || 0) + (day.d || 0) + (day.c || 0);
			}
		}
	}

	const viewCounts = await Promise.all(viewCountPromises);

	let repoViews = 0;
	for (const viewCount of viewCounts) {
		repoViews += viewCount.data.count;
	}

	const topLanguages: Language[] = [];
	let codeByteTotal = 0;

	for (const node of graphQLData.user.repositories.nodes) {
		for (const edge of node.languages.edges) {
			if (NOT_LANGUAGES_OBJ[edge.node.name.toLowerCase()]) {
				continue;
			}

			const existingLanguage = topLanguages.find(
				(l) => l.languageName === edge.node.name
			);

			if (existingLanguage) {
				existingLanguage.value += edge.size;
				codeByteTotal += edge.size;
			} else {
				topLanguages.push({
					languageName: edge.node.name,
					color: edge.node.color,
					value: edge.size,
				});
				codeByteTotal += edge.size;
			}
		}
	}

	const allDays = contributionsCollection.contributionCalendar.weeks
		.map((w) => w.contributionDays)
		.flat(1);

	return {
		name: userDetails.data.name || '',
		username,
		repoViews,
		linesOfCodeChanged,
		totalCommits: totalCommits.data.total_count,
		totalPullRequests: graphQLData.user.pullRequests.totalCount,
		codeByteTotal,
		topLanguages,
		forkCount,
		starCount,
		totalContributions:
			contributionsCollection.contributionCalendar.totalContributions,
		closedIssues: graphQLData.viewer.closedIssues.totalCount,
		openIssues: graphQLData.viewer.openIssues.totalCount,
		fetchedAt,
		contributionData: allDays,
	};
};
