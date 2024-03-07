import {ReadmeContent} from './components/ReadmeContent';
import {MainProps} from './config';

export function ReadmeCard({userStats}: MainProps) {
	console.log(userStats);

	if (!userStats) {
		return null;
	}

	return <ReadmeContent userStats={userStats} />;
}
