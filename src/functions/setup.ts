import {ContributionData, Language} from '../Types';
import {UserStats} from '../config';

const statsTemplate = (username: string) =>
	`https://raw.githubusercontent.com/${username}/stats/main/github-user-stats.json`;

export async function getUsersStatsFromGithub(usernames: string[]) {
	const stats: UserStats[] = [];

	for (const username of usernames) {
		const resp = await fetch(statsTemplate(username));

		const userStats = await resp.json();

		stats.push(userStats);
	}

	return stats;
}

export function mergeUsersStats(stats: UserStats[]): UserStats {
	const userStats = stats[0];
	for (const stat of stats.slice(1)) {
		userStats.closedIssues += stat.closedIssues;
		userStats.contributionData = [
			...userStats.contributionData,
			...stat.contributionData,
		];
		userStats.starCount += stat.starCount;
		userStats.openIssues += stat.openIssues;
		userStats.topLanguages = [...userStats.topLanguages, ...stat.topLanguages];
		userStats.totalCommits += stat.totalCommits;
		userStats.totalContributions += stat.totalContributions;
		userStats.totalPullRequests += stat.totalPullRequests;
		userStats.repoViews += stat.repoViews;
		userStats.linesOfCodeChanged += stat.linesOfCodeChanged;
		userStats.codeByteTotal += stat.codeByteTotal;
		userStats.forkCount += stat.forkCount;
	}

	return userStats;
}

export function sortAndMergeContributionData(userStats: UserStats) {
	userStats.contributionData.sort(
		(a: ContributionData, b: ContributionData) => {
			// @ts-expect-error This is a valid comparison
			return new Date(a.date) - new Date(b.date);
		}
	);

	for (let index = 0; index < userStats.contributionData.length - 1; index++) {
		if (
			userStats.contributionData[index].date ===
			userStats.contributionData[index + 1].date
		) {
			userStats.contributionData[index].contributionCount +=
				userStats.contributionData[index + 1].contributionCount;
			userStats.contributionData.splice(index + 1, 1);
		}
	}
}

export function sortAndMergeTopLanguages(userStats: UserStats): UserStats {
	const topLanguages: Language[] = [];
	for (const language of userStats.topLanguages) {
		if (
			topLanguages.some((lang) => lang.languageName === language.languageName)
		)
			continue;
		const tempLang: Language = {
			languageName: language.languageName,
			color: language.color,
			value: 0,
		};
		for (const lang of userStats.topLanguages.filter(
			(lang: Language) => lang.languageName === language.languageName
		)) {
			tempLang.value += lang.value;
		}
		topLanguages.push(tempLang);
	}

	topLanguages.sort((a, b) => {
		return b.value - a.value;
	});

	userStats.topLanguages = topLanguages;

	return userStats;
}

export async function getUserStats(usernames: string[]) {
	const stats = getUsersStatsFromGithub(usernames);
	let userStats = mergeUsersStats(await stats);
	sortAndMergeContributionData(userStats);
	userStats = sortAndMergeTopLanguages(userStats);
	return userStats;
}
