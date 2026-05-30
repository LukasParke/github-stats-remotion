import {UserStats} from '../../config';
import {Panel, ProgressBar} from './CardPrimitives';

export function LanguagesContent({userStats}: {userStats: UserStats}) {
	const languages = userStats.topLanguages.slice(0, 6);

	return (
		<Panel
			title="Language Mix"
			subtitle={`${userStats.summary.languageCount} languages detected`}
		>
			<div className="grid grid-cols-2 gap-3">
				{languages.map((language) => (
					<div key={language.languageName}>
						<div className="mb-1 flex items-center justify-between gap-2">
							<p className="truncate text-xs font-semibold">
								{language.languageName}
							</p>
							<p className="text-xs text-[#8b949e]">
								{(language.percentage || 0).toFixed(1)}%
							</p>
						</div>
						<ProgressBar
							value={language.percentage || 0}
							max={100}
							color={language.color || '#58a6ff'}
						/>
					</div>
				))}
			</div>
		</Panel>
	);
}
