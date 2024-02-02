import {MainContent} from './components/MainContent';
import {MainProps} from './config';

export function MainCard({userStats}: MainProps) {
	console.log(userStats);

	if (!userStats) {
		return null;
	}

	return <MainContent userStats={userStats} />;
}
