import {LanguagesContent} from './components/LanguagesContent';
import {MainProps} from './config';

export function LanguagesCard({userStats}: MainProps) {
	console.log(userStats);

	if (!userStats) {
		return null;
	}

	return <LanguagesContent userStats={userStats} />;
}
