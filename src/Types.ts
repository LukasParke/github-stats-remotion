export type Language = {
	languageName: string;
	color: string | null;
	value: number;
};

export type ContributionData = {
	contributionCount: number;
	date: string;
};

export type ContributionsCollection = {
	contributionCalendar: {
		totalContributions: number;
		weeks: {
			contributionDays: {
				contributionCount: number;
				date: string;
			}[];
		}[];
	};
	commitContributionsByRepository: Array<{
		contributions: {
			totalCount: number;
		};
		repository: {
			languages: {
				edges: Array<{
					size: number;
					node: {
						color: string | null;
						name: string;
						id: string;
					};
				}>;
			};
		};
	}>;
};

export interface GraphQLResponse {
	user: User;
	viewer: Viewer;
}

export interface User {
	name: string;
	login: string;
	repositories: Repositories;
	pullRequests: PullRequests;
}

export interface Repositories {
	totalCount: number;
	nodes: Node[];
}

export interface Node {
	stargazers: Stargazers;
	name: string;
	languages: Languages;
	forkCount: number;
}

export interface Stargazers {
	totalCount: number;
}

export interface Languages {
	edges: Edge[];
}

export interface Edge {
	size: number;
	node: Node2;
}

export interface Node2 {
	color: string;
	name: string;
}

export interface PullRequests {
	totalCount: number;
}

export interface Viewer {
	openIssues: OpenIssues;
	closedIssues: ClosedIssues;
}

export interface OpenIssues {
	totalCount: number;
}

export interface ClosedIssues {
	totalCount: number;
}
