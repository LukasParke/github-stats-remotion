import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Config, UserStats} from '../config';
import {Languages} from '../Languages';
import {percentage} from '../functions/utils';

const {FPS} = Config;

function interpolateFactory(
	frame: number,
	delayInSeconds: number,
	durationInSeconds: number,
	finalOpacity: number = 1
) {
	const delay = delayInSeconds * FPS;
	const duration = durationInSeconds * FPS + delay;
	return interpolate(frame, [delay, duration], [0, finalOpacity], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
}

export function LanguagesContent({userStats}: {userStats: UserStats}) {
	const frame = useCurrentFrame();

	return (
		<AbsoluteFill className="bg-[#151a24] p-2 text-gray-300 font-mono">
			<div
				style={{opacity: interpolateFactory(frame, 1 / 5, 1)}}
				className="bg-white rounded-lg p-2"
			>
				<div className="grid grid-rows-3 grid-cols-3 gap-2">
					{userStats.topLanguages.slice(0, 9).map((lang, i) => (
						<div
							key={`${lang.languageName}`}
							style={{
								opacity: interpolateFactory(frame, (i + 1) / 5, 1),
							}}
						>
							<p
								className={`text-md ${
									// @ts-expect-error Ain't nobody got time to list all those types
									Languages[lang.languageName].color
								} font-bold text-center`}
							>
								{lang.languageName}
							</p>
							<p className="text-black text-sm font-bold text-center my-0">
								{percentage(lang.value, userStats.codeByteTotal).toFixed(1)}%
							</p>
						</div>
					))}
				</div>
			</div>
		</AbsoluteFill>
	);
}
