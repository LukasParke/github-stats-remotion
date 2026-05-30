import {UserStats} from '../../config';
import {formatBytes} from '../../functions/utils';
import {Panel, ProgressBar} from './CardPrimitives';

export function TopLanguagesCard({userStats}: {userStats: UserStats}) {
	const languages = userStats.topLanguages.slice(0, 8);
	const maxBytes = Math.max(1, ...languages.map((language) => language.value));

	return (
		<Panel
			title="Top Languages"
			subtitle={formatBytes(userStats.code.codeByteTotal)}
		>
			<div className="space-y-1.5">
				{languages.map((language) => (
					<div
						key={language.languageName}
						className="grid grid-cols-[95px_1fr_82px] items-center gap-2"
					>
						<p className="truncate text-xs font-semibold">
							{language.languageName}
						</p>
						<ProgressBar
							value={language.value}
							max={maxBytes}
							color={language.color || '#58a6ff'}
						/>
						<p className="text-right text-[11px] text-[#8b949e]">
							{formatBytes(language.value)}
						</p>
					</div>
				))}
			</div>
		</Panel>
	);
}
