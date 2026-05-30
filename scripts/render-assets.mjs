import {existsSync} from 'node:fs';
import {mkdir, rm, writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {spawn} from 'node:child_process';

const cards = [
	'readme',
	'main-stats',
	'stats',
	'repo-impact',
	'languages',
	'top-languages',
	'activity-overview',
	'commit-streak',
	'issue-tracking',
	'code-metrics',
];

const args = new Map(
	process.argv
		.slice(2)
		.filter((arg) => arg.startsWith('--'))
		.map((arg) => {
			const [key, value = 'true'] = arg.slice(2).split('=');
			return [key, value];
		})
);

const formats = (args.get('formats') || process.env.RENDER_FORMATS || 'webp,gif')
	.split(',')
	.map((format) => format.trim())
	.filter(Boolean);
const outputDir = args.get('out-dir') || process.env.RENDER_OUT_DIR || 'pages';
const cardConcurrency = parsePositiveInt(
	args.get('card-concurrency') || process.env.RENDER_CARD_CONCURRENCY,
	1
);
const remotionConcurrency =
	args.get('remotion-concurrency') || process.env.REMOTION_CONCURRENCY;
const propsPath =
	args.get('props') ||
	process.env.RENDER_PROPS ||
	(existsSync('input.generated.json') ? 'input.generated.json' : 'input.json');
const needsGif = formats.includes('gif') || formats.includes('webp');
const keepGif = formats.includes('gif');
const tempDir = join(outputDir, '.tmp');

await rm(outputDir, {recursive: true, force: true});
await mkdir(outputDir, {recursive: true});
if (needsGif && !keepGif) {
	await mkdir(tempDir, {recursive: true});
}

console.log(
	`Rendering ${cards.length} cards to ${outputDir} with card concurrency ${cardConcurrency}`
);

await runPool(cards, Math.min(cardConcurrency, cards.length), renderCard);

if (existsSync(tempDir)) {
	await rm(tempDir, {recursive: true, force: true});
}

await writeFile(join(outputDir, 'index.html'), buildIndexHtml(), 'utf8');

async function renderCard(card) {
	const gifPath = keepGif
		? join(outputDir, `${card}.gif`)
		: join(tempDir, `${card}.gif`);

	if (needsGif) {
		const remotionArgs = [
			'remotion',
			'render',
			'--props',
			propsPath,
			card,
			gifPath,
			'--codec',
			'gif',
		];
		if (remotionConcurrency) {
			remotionArgs.push('--concurrency', remotionConcurrency);
		}
		await run('yarn', remotionArgs);
	}

	if (formats.includes('webp')) {
		await run('ffmpeg', [
			'-y',
			'-i',
			gifPath,
			'-loop',
			'0',
			'-c:v',
			'libwebp',
			'-quality',
			'82',
			'-compression_level',
			'6',
			'-preset',
			'picture',
			'-an',
			'-fps_mode',
			'passthrough',
			join(outputDir, `${card}.webp`),
		]);
	}
}

async function runPool(items, concurrency, worker) {
	let index = 0;
	const workers = Array.from({length: concurrency}, async () => {
		while (index < items.length) {
			const currentIndex = index;
			index += 1;
			await worker(items[currentIndex]);
		}
	});
	await Promise.all(workers);
}

function run(command, commandArgs) {
	return new Promise((resolve, reject) => {
		const child = spawn(command, commandArgs, {stdio: 'inherit'});
		child.on('error', reject);
		child.on('exit', (code) => {
			if (code === 0) {
				resolve();
				return;
			}
			reject(new Error(`${command} ${commandArgs.join(' ')} failed`));
		});
	});
}

function parsePositiveInt(value, fallback) {
	const parsed = Number(value);
	if (Number.isInteger(parsed) && parsed > 0) {
		return parsed;
	}
	return fallback;
}

function buildIndexHtml() {
	const images = cards
		.map((card) => {
			const webp = formats.includes('webp')
				? `<img src="./${card}.webp" alt="${card}" />`
				: '';
			const gif = formats.includes('gif')
				? `<img src="./${card}.gif" alt="${card} gif fallback" />`
				: '';
			return `<section><h2>${card}</h2>${webp}${gif}</section>`;
		})
		.join('\n');

	return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>GitHub Stats Remotion Assets</title>
  <style>
    body { margin: 0; padding: 24px; background: #0d1117; color: #f0f3f6; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
    main { display: grid; gap: 24px; max-width: 900px; margin: 0 auto; }
    section { display: grid; gap: 8px; }
    h1, h2 { margin: 0; }
    h2 { color: #8b949e; font-size: 14px; }
    img { max-width: 100%; height: auto; }
  </style>
</head>
<body>
  <main>
    <h1>GitHub Stats Remotion Assets</h1>
    ${images}
  </main>
</body>
</html>
`;
}
