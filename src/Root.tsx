import {CalculateMetadataFunction, Composition, getInputProps} from 'remotion';
import './style.css';

import {MainCard} from './MainCard';
import {LanguagesCard} from './LanguagesCard';

import {getUserStats} from './functions/setup';
import {Config, MainProps, mainSchema} from './config';
import {defaultStats} from './defaultStats';

const {FPS, DurationInFrames} = Config;

export const RemotionRoot = () => {
	const calculateMetadata: CalculateMetadataFunction<MainProps> = async (
		props
	) => {
		const {usernames} = getInputProps();

		console.log(usernames);

		const userStats = await getUserStats(usernames as string[]);

		return {
			props: {
				...props,
				userStats,
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
				calculateMetadata={calculateMetadata}
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
				calculateMetadata={calculateMetadata}
				defaultProps={{
					userStats: defaultStats,
				}}
			/>
		</>
	);
};
