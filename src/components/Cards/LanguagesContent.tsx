import {UserStats} from '../../config';
import {Panel, ProgressBar, theme} from './CardPrimitives';
import {formatBytes} from '../../functions/utils';

export function LanguagesContent({userStats}: {userStats: UserStats}) {
	const languages = userStats.topLanguages.slice(0, 6);
	const accent = languages[0]?.color || theme.blue;

	return (
		<Panel
			title="Language Mix"
			subtitle={`${userStats.summary.languageCount} languages, ${formatBytes(userStats.code.codeByteTotal)} analyzed`}
			accent={accent}
		>
			<div className="flex h-[188px] flex-col gap-3">
				<div className="flex h-3 overflow-hidden rounded-full bg-white/10">
					{languages.map((language) => (
						<div
							key={language.languageName}
							style={{
								width: `${Math.max(2, language.percentage || 0)}%`,
								backgroundColor: language.color || theme.blue,
							}}
						/>
					))}
				</div>
				<div className="grid flex-1 grid-cols-2 gap-2">
					{languages.map((language, index) => (
						<div
							key={language.languageName}
							className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2"
						>
							<div className="mb-1 flex items-center justify-between gap-2">
								<p className="flex min-w-0 items-center gap-2 text-xs font-semibold">
									<span
										className="size-2 shrink-0 rounded-full"
										style={{backgroundColor: language.color || theme.blue}}
									/>
									<span className="truncate">{language.languageName}</span>
								</p>
								<p className="shrink-0 text-xs text-[#9ba7b4]">
									{(language.percentage || 0).toFixed(1)}%
								</p>
							</div>
							<ProgressBar
								value={language.percentage || 0}
								max={100}
								color={language.color || theme.blue}
								delay={index * 5}
								height={6}
							/>
						</div>
					))}
				</div>
			</div>
		</Panel>
	);
}
