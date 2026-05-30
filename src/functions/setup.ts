import {MetricCard, RenderLanguage, SourceProps, UserStats} from '../config';

type UnknownRecord = Record<string, unknown>;

const defaultStatsTemplate = (username: string) =>
	`https://raw.githubusercontent.com/${username}/stats/main/github-user-stats.json`;

export async function getUserStats(inputProps: SourceProps): Promise<UserStats> {
	const allowPrivateRepositoryDetails =
		inputProps.allowPrivateRepositoryDetails === true;

	if (inputProps.stats) {
		return normalizeGithubStats(inputProps.stats, {
			allowPrivateRepositoryDetails,
		});
	}

	const urls = getStatsUrls(inputProps);
	const stats = await Promise.all(
		urls.map(async (url) => {
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error(`Failed to fetch stats from ${url}: ${response.status}`);
			}
			return normalizeGithubStats(await response.json(), {
				allowPrivateRepositoryDetails,
			});
		})
	);

	return mergeUserStats(stats);
}

function getStatsUrls(inputProps: SourceProps): string[] {
	if (inputProps.statsUrl) {
		return [inputProps.statsUrl];
	}

	const usernames = inputProps.usernames?.length
		? inputProps.usernames
		: [inputProps.username || 'LukasParke'];

	return usernames.map((username) => defaultStatsTemplate(username));
}

function normalizeGithubStats(
	rawValue: unknown,
	options: {allowPrivateRepositoryDetails: boolean}
): UserStats {
	const raw = asRecord(rawValue);
	const schemaVersion = asNumber(raw.schemaVersion, null);

	assertPublicSafe(raw, options.allowPrivateRepositoryDetails);

	if (schemaVersion === 2) {
		return normalizeV2Stats(raw);
	}

	return normalizeLegacyStats(raw);
}

function normalizeV2Stats(raw: UnknownRecord): UserStats {
	const profile = asRecord(raw.profile);
	const legacy = asRecord(raw.legacy);
	const presentation = asRecord(raw.presentation);
	const readmeSummary = asRecord(presentation.readmeSummary);
	const profileContributions = asRecord(raw.profileContributions);
	const activity = asRecord(raw.activity);
	const repoMetrics = asRecord(raw.repoMetrics);
	const contributorStats = asRecord(asRecord(repoMetrics.contributorStats));
	const traffic = asRecord(asRecord(repoMetrics.traffic));
	const repoStats = asRecord(asRecord(repoMetrics.repoStats));
	const computedStats = asRecord(asRecord(repoMetrics.computedStats));
	const contributionStats = asRecord(asRecord(legacy.contributionStats));
	const privacy = asRecord(raw.privacy);
	const collectionStatus = asRecord(raw.collectionStatus);
	const backfill = asRecord(collectionStatus.backfill);

	const topLanguages = normalizeLanguages(
		firstArray(
			readmeSummary.topLanguages,
			repoMetrics.topLanguages,
			legacy.topLanguages
		),
		asNumber(repoMetrics.codeByteTotal, asNumber(legacy.codeByteTotal, 0))
	);
	const totalContributions = asNumber(
		readmeSummary.totalContributions,
		asNumber(
			profileContributions.totalContributions,
			asNumber(legacy.totalContributions, 0)
		)
	);
	const starCount = asNumber(
		readmeSummary.starsReceived,
		asNumber(repoMetrics.starCount, asNumber(legacy.starCount, 0))
	);
	const forkCount = asNumber(
		readmeSummary.forksReceived,
		asNumber(repoMetrics.forkCount, asNumber(legacy.forkCount, 0))
	);
	const activeRepos = asNumber(
		readmeSummary.activeRepos,
		asNumber(repoStats.activeRepos, asNumber(computedStats.activeRepos, 0))
	);
	const totalRepos = asNumber(
		repoStats.totalRepos,
		asNumber(computedStats.totalRepos, activeRepos)
	);
	const fetchedAt = asNumber(legacy.fetchedAt, Date.parse(asString(raw.generatedAt)));
	const generatedAt =
		asString(raw.generatedAt) || new Date(fetchedAt || Date.now()).toISOString();
	const contributionCalendar = normalizeContributionCalendar(
		asRecord(profileContributions.contributionCalendar)
	);
	const timeline = normalizeTimeline(
		firstArray(
			presentation.timeline,
			asRecord(legacy.contributionStats).yearlyBreakdown
		)
	);
	const linesAdded = asNumber(
		contributorStats.linesAdded,
		asNumber(legacy.linesAdded, 0)
	);
	const linesDeleted = asNumber(
		contributorStats.linesDeleted,
		asNumber(legacy.linesDeleted, 0)
	);
	const linesOfCodeChanged = asNumber(
		contributorStats.linesOfCodeChanged,
		asNumber(legacy.linesOfCodeChanged, linesAdded + linesDeleted)
	);
	const linesChanged = asNumber(
		legacy.linesChanged,
		asNumber(contributorStats.linesOfCodeChanged, linesOfCodeChanged)
	);
	const backfillPending = asNumber(backfill.pending, 0);
	const isComplete = Boolean(
		readmeSummary.complete ??
			(collectionStatus.complete === true && backfillPending === 0)
	);

	return {
		schemaVersion: 2,
		name:
			asString(readmeSummary.name) ||
			asString(profile.name) ||
			asString(legacy.name) ||
			asString(profile.login) ||
			asString(legacy.username) ||
			'GitHub User',
		username:
			asString(readmeSummary.username) ||
			asString(profile.login) ||
			asString(legacy.username) ||
			'LukasParke',
		avatarUrl: asString(profile.avatarUrl) || asString(legacy.avatarUrl),
		bio: asNullableString(profile.bio ?? legacy.bio),
		websiteUrl: asNullableString(profile.websiteUrl ?? legacy.websiteUrl),
		location: asNullableString(profile.location ?? legacy.location),
		generatedAt,
		fetchedAt,
		isComplete,
		summary: {
			totalContributions,
			currentStreak: asNumber(
				readmeSummary.currentStreak,
				asNumber(contributionStats.currentStreak, 0)
			),
			longestStreak: asNumber(
				readmeSummary.longestStreak,
				asNumber(contributionStats.longestStreak, 0)
			),
			starsReceived: starCount,
			forksReceived: forkCount,
			activeRepos,
			totalRepos,
			languageCount: asNumber(
				computedStats.languageCount,
				asNumber(readmeSummary.languageCount, topLanguages.length)
			),
			refreshedAt: asString(readmeSummary.refreshedAt) || generatedAt,
		},
		contributions: {
			totalContributions,
			totalCommits: asNumber(
				contributorStats.totalCommits,
				asNumber(
					legacy.totalCommits,
					asNumber(profileContributions.totalCommitContributions, 0)
				)
			),
			restrictedContributionsCount: asNumber(
				profileContributions.restrictedContributionsCount,
				asNumber(
					asRecord(legacy.contributionsCollection).restrictedContributionsCount,
					0
				)
			),
			currentStreak: asNumber(
				readmeSummary.currentStreak,
				asNumber(contributionStats.currentStreak, 0)
			),
			longestStreak: asNumber(
				readmeSummary.longestStreak,
				asNumber(contributionStats.longestStreak, 0)
			),
			peakDay: normalizePeakDay(contributionStats.peakDay),
			mostProductiveMonth: normalizeMostProductiveMonth(
				computedStats.mostProductiveMonth
			),
			calendar: contributionCalendar,
			timeline,
		},
		code: {
			codeByteTotal: asNumber(repoMetrics.codeByteTotal, asNumber(legacy.codeByteTotal, 0)),
			linesAdded,
			linesDeleted,
			linesChanged,
			linesOfCodeChanged,
			contributorReposCompleted: asNumber(contributorStats.reposCompleted, 0),
			contributorReposPending: asNumber(contributorStats.reposPending, 0),
			contributorReposFailed: asNumber(contributorStats.reposFailed, 0),
		},
		community: {
			totalPullRequests: asNumber(
				activity.totalPullRequests,
				asNumber(legacy.totalPullRequests, 0)
			),
			totalPullRequestReviews: asNumber(
				legacy.totalPullRequestReviews,
				asNumber(profileContributions.totalPullRequestReviewContributions, 0)
			),
			openIssues: asNumber(activity.openIssues, asNumber(legacy.openIssues, 0)),
			closedIssues: asNumber(
				activity.closedIssues,
				asNumber(legacy.closedIssues, 0)
			),
			repositoriesContributedTo: asNumber(
				activity.repositoriesContributedTo,
				asNumber(legacy.repositoriesContributedTo, 0)
			),
			discussionsStarted: asNumber(
				activity.discussionsStarted,
				asNumber(legacy.discussionsStarted, 0)
			),
			discussionsAnswered: asNumber(
				activity.discussionsAnswered,
				asNumber(legacy.discussionsAnswered, 0)
			),
			starsGiven: asNumber(activity.starsGiven, asNumber(legacy.starsGiven, 0)),
			followers: asNumber(profile.followers, asNumber(legacy.followers, 0)),
			following: asNumber(profile.following, asNumber(legacy.following, 0)),
		},
		repositories: {
			totalRepos,
			publicRepos: asNumber(repoStats.publicRepos, asNumber(computedStats.publicRepos, 0)),
			privateRepos: asNumber(repoStats.privateRepos, asNumber(computedStats.privateRepos, 0)),
			activeRepos,
			archivedRepos: asNumber(repoStats.archivedRepos, asNumber(computedStats.archivedRepos, 0)),
			forkedRepos: asNumber(repoStats.forkedRepos, asNumber(computedStats.forkedRepos, 0)),
			originalRepos: asNumber(repoStats.originalRepos, asNumber(computedStats.originalRepos, 0)),
			reposWithStars: asNumber(repoStats.reposWithStars, asNumber(computedStats.reposWithStars, 0)),
			repoViews: asNumber(traffic.repoViews, asNumber(legacy.repoViews, 0)),
			repoViewUniques: asNumber(traffic.repoViewUniques, 0),
			trafficReposCompleted: asNumber(traffic.reposCompleted, 0),
			trafficReposPending: asNumber(traffic.reposPending, 0),
			trafficReposFailed: asNumber(traffic.reposFailed, 0),
			starCount,
			forkCount,
		},
		topLanguages,
		cards: normalizeMetricCards(presentation.cards),
		highlights: normalizeMetricCards(presentation.highlights),
		privacy: {
			privateRepositoryDetailsIncluded:
				privacy.privateRepositoryDetailsIncluded === true,
			privateCacheDetailsIncluded: privacy.privateCacheDetailsIncluded === true,
			redactedPrivateRepositories: asNumber(
				privacy.redactedPrivateRepositories,
				0
			),
			redactedRepositoryContributions: asNumber(
				privacy.redactedRepositoryContributions,
				0
			),
			redactedOptionalMetrics: asNumber(privacy.redactedOptionalMetrics, 0),
		},
		collectionStatus: {
			complete: isComplete,
			coreComplete: collectionStatus.coreComplete !== false,
			backfillPending,
			backfillCompletedThisRun: asNumber(backfill.completedThisRun, 0),
			backfillFailedThisRun: asNumber(backfill.failedThisRun, 0),
			warnings: asStringArray(collectionStatus.warnings),
			errors: asStringArray(collectionStatus.errors),
		},
		repoViews: asNumber(traffic.repoViews, asNumber(legacy.repoViews, 0)),
		linesOfCodeChanged,
		linesAdded,
		linesDeleted,
		linesChanged,
		totalCommits: asNumber(
			contributorStats.totalCommits,
			asNumber(legacy.totalCommits, 0)
		),
		totalPullRequests: asNumber(
			activity.totalPullRequests,
			asNumber(legacy.totalPullRequests, 0)
		),
		totalPullRequestReviews: asNumber(
			legacy.totalPullRequestReviews,
			asNumber(profileContributions.totalPullRequestReviewContributions, 0)
		),
		openIssues: asNumber(activity.openIssues, asNumber(legacy.openIssues, 0)),
		closedIssues: asNumber(activity.closedIssues, asNumber(legacy.closedIssues, 0)),
		forkCount,
		starCount,
		totalContributions,
		codeByteTotal: asNumber(repoMetrics.codeByteTotal, asNumber(legacy.codeByteTotal, 0)),
	};
}

function normalizeLegacyStats(raw: UnknownRecord): UserStats {
	const contributionStats = asRecord(raw.contributionStats);
	const repoStats = asRecord(raw.repoStats);
	const computedStats = asRecord(raw.computedStats);
	const contributionsCollection = asRecord(raw.contributionsCollection);
	const totalContributions = asNumber(raw.totalContributions, 0);
	const codeByteTotal = asNumber(raw.codeByteTotal, 0);
	const topLanguages = normalizeLanguages(raw.topLanguages, codeByteTotal);
	const fetchedAt = asNumber(raw.fetchedAt, Date.now());
	const generatedAt = new Date(fetchedAt).toISOString();
	const linesAdded = asNumber(raw.linesAdded, 0);
	const linesDeleted = asNumber(raw.linesDeleted, 0);
	const linesOfCodeChanged = asNumber(
		raw.linesOfCodeChanged,
		linesAdded + linesDeleted
	);

	return {
		schemaVersion: null,
		name: asString(raw.name) || asString(raw.username) || 'GitHub User',
		username: asString(raw.username) || 'LukasParke',
		avatarUrl: asString(raw.avatarUrl),
		bio: asNullableString(raw.bio),
		websiteUrl: asNullableString(raw.websiteUrl),
		location: asNullableString(raw.location),
		generatedAt,
		fetchedAt,
		isComplete: true,
		summary: {
			totalContributions,
			currentStreak: asNumber(contributionStats.currentStreak, 0),
			longestStreak: asNumber(contributionStats.longestStreak, 0),
			starsReceived: asNumber(raw.starCount, 0),
			forksReceived: asNumber(raw.forkCount, 0),
			activeRepos: asNumber(repoStats.activeRepos, 0),
			totalRepos: asNumber(repoStats.totalRepos, asNumber(raw.totalRepos, 0)),
			languageCount: asNumber(computedStats.languageCount, topLanguages.length),
			refreshedAt: generatedAt,
		},
		contributions: {
			totalContributions,
			totalCommits: asNumber(raw.totalCommits, asNumber(raw.commitCount, 0)),
			restrictedContributionsCount: asNumber(
				contributionsCollection.restrictedContributionsCount,
				0
			),
			currentStreak: asNumber(contributionStats.currentStreak, 0),
			longestStreak: asNumber(contributionStats.longestStreak, 0),
			peakDay: normalizePeakDay(contributionStats.peakDay),
			mostProductiveMonth: normalizeMostProductiveMonth(
				computedStats.mostProductiveMonth
			),
			calendar: normalizeContributionCalendar(
				asRecord(contributionsCollection.contributionCalendar)
			),
			timeline: normalizeTimeline(contributionStats.yearlyBreakdown),
		},
		code: {
			codeByteTotal,
			linesAdded,
			linesDeleted,
			linesChanged: asNumber(raw.linesChanged, linesOfCodeChanged),
			linesOfCodeChanged,
			contributorReposCompleted: 0,
			contributorReposPending: 0,
			contributorReposFailed: 0,
		},
		community: {
			totalPullRequests: asNumber(raw.totalPullRequests, 0),
			totalPullRequestReviews: asNumber(raw.totalPullRequestReviews, 0),
			openIssues: asNumber(raw.openIssues, 0),
			closedIssues: asNumber(raw.closedIssues, 0),
			repositoriesContributedTo: asNumber(raw.repositoriesContributedTo, 0),
			discussionsStarted: asNumber(raw.discussionsStarted, 0),
			discussionsAnswered: asNumber(raw.discussionsAnswered, 0),
			starsGiven: asNumber(raw.starsGiven, 0),
			followers: asNumber(raw.followers, 0),
			following: asNumber(raw.following, 0),
		},
		repositories: {
			totalRepos: asNumber(repoStats.totalRepos, asNumber(raw.totalRepos, 0)),
			publicRepos: asNumber(repoStats.publicRepos, 0),
			privateRepos: asNumber(repoStats.privateRepos, 0),
			activeRepos: asNumber(repoStats.activeRepos, 0),
			archivedRepos: asNumber(repoStats.archivedRepos, 0),
			forkedRepos: asNumber(repoStats.forkedRepos, 0),
			originalRepos: asNumber(repoStats.originalRepos, 0),
			reposWithStars: asNumber(repoStats.reposWithStars, 0),
			repoViews: asNumber(raw.repoViews, 0),
			repoViewUniques: 0,
			trafficReposCompleted: 0,
			trafficReposPending: 0,
			trafficReposFailed: 0,
			starCount: asNumber(raw.starCount, 0),
			forkCount: asNumber(raw.forkCount, 0),
		},
		topLanguages,
		cards: [],
		highlights: [],
		privacy: {
			privateRepositoryDetailsIncluded: false,
			privateCacheDetailsIncluded: false,
			redactedPrivateRepositories: 0,
			redactedRepositoryContributions: 0,
			redactedOptionalMetrics: 0,
		},
		collectionStatus: {
			complete: true,
			coreComplete: true,
			backfillPending: 0,
			backfillCompletedThisRun: 0,
			backfillFailedThisRun: 0,
			warnings: [],
			errors: [],
		},
		repoViews: asNumber(raw.repoViews, 0),
		linesOfCodeChanged,
		linesAdded,
		linesDeleted,
		linesChanged: asNumber(raw.linesChanged, linesOfCodeChanged),
		totalCommits: asNumber(raw.totalCommits, asNumber(raw.commitCount, 0)),
		totalPullRequests: asNumber(raw.totalPullRequests, 0),
		totalPullRequestReviews: asNumber(raw.totalPullRequestReviews, 0),
		openIssues: asNumber(raw.openIssues, 0),
		closedIssues: asNumber(raw.closedIssues, 0),
		forkCount: asNumber(raw.forkCount, 0),
		starCount: asNumber(raw.starCount, 0),
		totalContributions,
		codeByteTotal,
	};
}

function mergeUserStats(stats: UserStats[]): UserStats {
	if (stats.length === 0) {
		throw new Error('No GitHub stats were loaded');
	}

	const [first, ...rest] = stats;
	if (rest.length === 0) {
		return first;
	}

	for (const stat of rest) {
		first.summary.totalContributions += stat.summary.totalContributions;
		first.summary.starsReceived += stat.summary.starsReceived;
		first.summary.forksReceived += stat.summary.forksReceived;
		first.summary.activeRepos += stat.summary.activeRepos;
		first.summary.totalRepos += stat.summary.totalRepos;
		first.contributions.totalContributions += stat.contributions.totalContributions;
		first.contributions.totalCommits += stat.contributions.totalCommits;
		first.contributions.restrictedContributionsCount +=
			stat.contributions.restrictedContributionsCount;
		first.code.codeByteTotal += stat.code.codeByteTotal;
		first.code.linesAdded += stat.code.linesAdded;
		first.code.linesDeleted += stat.code.linesDeleted;
		first.code.linesChanged += stat.code.linesChanged;
		first.code.linesOfCodeChanged += stat.code.linesOfCodeChanged;
		first.community.totalPullRequests += stat.community.totalPullRequests;
		first.community.totalPullRequestReviews +=
			stat.community.totalPullRequestReviews;
		first.community.openIssues += stat.community.openIssues;
		first.community.closedIssues += stat.community.closedIssues;
		first.community.repositoriesContributedTo +=
			stat.community.repositoriesContributedTo;
		first.repositories.repoViews += stat.repositories.repoViews;
		first.repositories.repoViewUniques += stat.repositories.repoViewUniques;
		first.repositories.starCount += stat.repositories.starCount;
		first.repositories.forkCount += stat.repositories.forkCount;
		first.topLanguages = mergeLanguages(first.topLanguages, stat.topLanguages);
		first.contributions.timeline = mergeTimeline(
			first.contributions.timeline,
			stat.contributions.timeline
		);
	}

	first.repoViews = first.repositories.repoViews;
	first.linesOfCodeChanged = first.code.linesOfCodeChanged;
	first.linesAdded = first.code.linesAdded;
	first.linesDeleted = first.code.linesDeleted;
	first.linesChanged = first.code.linesChanged;
	first.totalCommits = first.contributions.totalCommits;
	first.totalPullRequests = first.community.totalPullRequests;
	first.totalPullRequestReviews = first.community.totalPullRequestReviews;
	first.openIssues = first.community.openIssues;
	first.closedIssues = first.community.closedIssues;
	first.forkCount = first.repositories.forkCount;
	first.starCount = first.repositories.starCount;
	first.totalContributions = first.contributions.totalContributions;
	first.codeByteTotal = first.code.codeByteTotal;

	return first;
}

function assertPublicSafe(
	raw: UnknownRecord,
	allowPrivateRepositoryDetails: boolean
) {
	const privacy = asRecord(raw.privacy);
	const repositories = asArray(raw.repositories);
	const includesPrivateDetails =
		privacy.privateRepositoryDetailsIncluded === true ||
		repositories.some((repo) => asRecord(repo).isPrivate === true);

	if (includesPrivateDetails && !allowPrivateRepositoryDetails) {
		throw new Error(
			'Stats JSON includes private repository details. Refusing to render public profile assets.'
		);
	}
}

function normalizeLanguages(value: unknown, totalBytes: number): RenderLanguage[] {
	const languages = asArray(value)
		.map((item) => {
			const record = asRecord(item);
			const languageName =
				asString(record.languageName) || asString(record.name) || 'Unknown';
			const bytes = asNumber(record.value, asNumber(record.bytes, 0));
			const percentageValue = asNumber(
				record.percentage,
				totalBytes > 0 ? (bytes / totalBytes) * 100 : 0
			);

			return {
				languageName,
				color: asNullableString(record.color),
				value: bytes,
				percentage: percentageValue,
			};
		})
		.filter((language) => language.value > 0);

	const byName = new Map<string, RenderLanguage>();
	for (const language of languages) {
		const current = byName.get(language.languageName);
		if (!current) {
			byName.set(language.languageName, language);
			continue;
		}
		current.value += language.value;
		current.percentage =
			totalBytes > 0 ? (current.value / totalBytes) * 100 : current.percentage;
	}

	return [...byName.values()].sort((a, b) => b.value - a.value);
}

function mergeLanguages(
	currentLanguages: RenderLanguage[],
	nextLanguages: RenderLanguage[]
): RenderLanguage[] {
	const totalBytes =
		sum(currentLanguages.map((language) => language.value)) +
		sum(nextLanguages.map((language) => language.value));
	return normalizeLanguages([...currentLanguages, ...nextLanguages], totalBytes);
}

function normalizeContributionCalendar(calendar: UnknownRecord) {
	return asArray(calendar.weeks).flatMap((week) =>
		asArray(asRecord(week).contributionDays).map((day) => {
			const record = asRecord(day);
			return {
				contributionCount: asNumber(record.contributionCount, 0),
				date: asString(record.date),
			};
		})
	);
}

function normalizeTimeline(value: unknown) {
	return asArray(value)
		.map((item) => {
			const record = asRecord(item);
			return {
				period: asString(record.period) || asString(record.year),
				contributions: asNumber(record.contributions, 0),
			};
		})
		.filter((item) => item.period)
		.sort((a, b) => a.period.localeCompare(b.period));
}

function mergeTimeline(
	currentTimeline: ReturnType<typeof normalizeTimeline>,
	nextTimeline: ReturnType<typeof normalizeTimeline>
) {
	const byPeriod = new Map<string, number>();
	for (const item of [...currentTimeline, ...nextTimeline]) {
		byPeriod.set(item.period, (byPeriod.get(item.period) || 0) + item.contributions);
	}
	return [...byPeriod.entries()]
		.map(([period, contributions]) => ({period, contributions}))
		.sort((a, b) => a.period.localeCompare(b.period));
}

function normalizeMetricCards(value: unknown): MetricCard[] {
	return asArray(value)
		.map((item) => {
			const record = asRecord(item);
			const id = asString(record.id);
			const label = asString(record.label);
			const rawValue = record.value;

			if (!id || !label || !isStringOrNumber(rawValue)) {
				return null;
			}

			const detail = asString(record.detail);
			const metric: MetricCard = {
				id,
				label,
				value: rawValue,
			};
			if (detail) {
				metric.detail = detail;
			}

			return metric;
		})
		.filter((item): item is MetricCard => item !== null);
}

function normalizePeakDay(value: unknown) {
	const record = asRecord(value);
	const date = asString(record.date);
	if (!date) {
		return null;
	}
	return {
		date,
		contributions: asNumber(record.contributions, 0),
	};
}

function normalizeMostProductiveMonth(value: unknown) {
	const record = asRecord(value);
	const month = asString(record.month);
	if (!month) {
		return null;
	}
	return {
		month,
		contributions: asNumber(record.contributions, 0),
	};
}

function firstArray(...values: unknown[]) {
	return values.find((value) => Array.isArray(value)) || [];
}

function asRecord(value: unknown): UnknownRecord {
	return value && typeof value === 'object' && !Array.isArray(value)
		? (value as UnknownRecord)
		: {};
}

function asArray(value: unknown): unknown[] {
	return Array.isArray(value) ? value : [];
}

function asNumber<T extends number | null>(value: unknown, fallback: T): number | T {
	if (typeof value === 'number' && Number.isFinite(value)) {
		return value;
	}
	if (typeof value === 'string' && value.trim() !== '') {
		const parsed = Number(value);
		if (Number.isFinite(parsed)) {
			return parsed;
		}
	}
	return fallback;
}

function asString(value: unknown): string {
	return typeof value === 'string' ? value : '';
}

function asNullableString(value: unknown): string | null {
	return typeof value === 'string' && value ? value : null;
}

function asStringArray(value: unknown): string[] {
	return asArray(value).filter((item): item is string => typeof item === 'string');
}

function isStringOrNumber(value: unknown): value is string | number {
	return typeof value === 'string' || typeof value === 'number';
}

function sum(values: number[]) {
	return values.reduce((total, value) => total + value, 0);
}
