export type ResponseType = 'yes' | 'maybe' | 'no';

export interface Answer {
	questionId: string;
	response: ResponseType;
}

export interface Session {
	sessionId: string;
	timestamp: number;
	answers: Answer[];
	myCode?: string;
	partnerCode?: string;
}

export interface ShareCode {
	v: 1;
	s: string;
	a: Answer[];
}

export interface Question {
	id: string;
	category: string;
	text: string;
}

export interface MatchedQuestion extends Question {
	userAnswer: ResponseType;
	partnerAnswer: ResponseType;
}
