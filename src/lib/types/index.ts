export type ResponseType = 'yes' | 'maybe' | 'no';

export interface Answer {
	questionId: string;
	response: ResponseType;
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
