import {CalculateMetadataFunction, Composition} from 'remotion';
import './style.css';

import {MainCard} from './MainCard';
import {LanguagesCard} from './LanguagesCard';

import {getUserStats} from './functions/setup';
import {Config, MainProps, mainSchema} from './config';
import {defaultStats} from './defaultStats';

const {FPS, DurationInFrames} = Config;

let stats: any = null;

export const RemotionRoot = () => {
	const calculateMetadata: CalculateMetadataFunction<MainProps> = async (
		props
	) => {
		if (!stats) {
			const userStats = await getUserStats();
			stats = userStats;
		}

		return {
			props: {
				...props,
				userStats: stats,
			},
		};
	};

	return (
		<>
			<Composition
				id="main"
				component={MainCard}
				durationInFrames={DurationInFrames}
				fps={FPS}
				width={500}
				height={230}
				schema={mainSchema}
				// calculateMetadata={calculateMetadata}
				defaultProps={{
					userStats: defaultStats,
				}}
			/>
			<Composition
				id="languages"
				component={LanguagesCard}
				durationInFrames={DurationInFrames}
				fps={FPS}
				width={500}
				height={180}
				schema={mainSchema}
				// calculateMetadata={calculateMetadata}
				defaultProps={{
					userStats: defaultStats,
				}}
			/>
		</>
	);
};
