import {ContributionData, Language} from '../Types';
import {UserStats} from '../config';
import {getStatsFromGitHub} from './getStatsFromGitHub';

export function getUsernamesAndTokens(): {
	usernames: string[];
	tokenMap: Map<string, string>;
} {
	const usernames: string[] = [];
	const tokenMap = new Map<string, string>();

	if (process.env.USERNAMES) {
		for (const username of process.env.USERNAMES.split(',')) {
			usernames.push(username);
		}
	} else {
		usernames.push(process.env.USERNAME!);
	}

	if (usernames.length > 1) {
		for (const username of usernames) {
			const userNameToCheck = username.replaceAll('-', '');
			const token = process.env[`TOKEN_${userNameToCheck}`];
			if (!token) {
				throw new Error(`Token for ${userNameToCheck} is missing`);
			}
			tokenMap.set(username, token);
		}
	}

	return {usernames, tokenMap};
}

export async function getUsersStatsFromGithub(
	usernames: string[],
	tokenMap: Map<string, string>
) {
	const promises = [];

	for (const username of usernames) {
		promises.push(
			getStatsFromGitHub({
				username,
				token: tokenMap.get(username) || '',
			})
		);
	}

	return Promise.all(promises);
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

export function sortAndMergeTopLanguages(userStats: UserStats) {
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

export async function getUserStats() {
	const {usernames, tokenMap} = getUsernamesAndTokens();
	const stats = getUsersStatsFromGithub(usernames, tokenMap);
	let userStats = mergeUsersStats(await stats);
	sortAndMergeContributionData(userStats);
	userStats = sortAndMergeTopLanguages(userStats);
	return userStats;
}
