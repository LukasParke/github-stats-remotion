import {writeFile} from 'node:fs/promises';

const DEFAULT_STATS_URL =
	'https://raw.githubusercontent.com/LukasParke/stats/main/github-user-stats.json';

const statsUrl = process.env.STATS_JSON_URL || DEFAULT_STATS_URL;
const outputPath = process.env.RENDER_INPUT_PATH || 'input.generated.json';
const allowPrivateRepositoryDetails =
	process.env.ALLOW_PRIVATE_REPOSITORY_DETAILS === 'true';

const response = await fetch(statsUrl, {
	headers: {
		accept: 'application/json',
		'user-agent': 'github-stats-remotion-renderer',
	},
});

if (!response.ok) {
	throw new Error(`Failed to download stats JSON from ${statsUrl}: ${response.status}`);
}

const stats = await response.json();
assertPublicSafe(stats);

await writeFile(
	outputPath,
	`${JSON.stringify(
		{
			username: 'LukasParke',
			statsUrl,
			allowPrivateRepositoryDetails,
			stats,
		},
		null,
		2
	)}\n`
);

console.log(`Prepared Remotion input at ${outputPath}`);

function assertPublicSafe(stats) {
	const includesPrivateDetails =
		stats?.privacy?.privateRepositoryDetailsIncluded === true ||
		(Array.isArray(stats?.repositories) &&
			stats.repositories.some((repository) => repository?.isPrivate === true));

	if (includesPrivateDetails && !allowPrivateRepositoryDetails) {
		throw new Error(
			'Stats JSON includes private repository details. Refusing to prepare public render input.'
		);
	}
}
