import type { Answer, MatchedQuestion } from '$lib/types';
import { questions } from '$lib/data/questions';

export function findMatches(userAnswers: Answer[], partnerAnswers: Answer[]): MatchedQuestion[] {
	const matches: MatchedQuestion[] = [];

	for (const userAnswer of userAnswers) {
		const partnerAnswer = partnerAnswers.find((a) => a.questionId === userAnswer.questionId);
		if (!partnerAnswer) continue;

		if (userAnswer.response === 'yes' && partnerAnswer.response === 'yes') {
			const question = questions.find((q) => q.id === userAnswer.questionId);
			if (question) {
				matches.push({
					...question,
					userAnswer: userAnswer.response,
					partnerAnswer: partnerAnswer.response
				});
			}
		}
	}

	return matches;
}

export function findMaybeMatches(userAnswers: Answer[], partnerAnswers: Answer[]): MatchedQuestion[] {
	const matches: MatchedQuestion[] = [];

	for (const userAnswer of userAnswers) {
		const partnerAnswer = partnerAnswers.find((a) => a.questionId === userAnswer.questionId);
		if (!partnerAnswer) continue;

		const bothNotNo =
			userAnswer.response !== 'no' && partnerAnswer.response !== 'no';
		const atLeastOneMaybe =
			userAnswer.response === 'maybe' || partnerAnswer.response === 'maybe';

		if (bothNotNo && atLeastOneMaybe) {
			const question = questions.find((q) => q.id === userAnswer.questionId);
			if (question) {
				matches.push({
					...question,
					userAnswer: userAnswer.response,
					partnerAnswer: partnerAnswer.response
				});
			}
		}
	}

	return matches;
}

export function groupByCategory(matches: MatchedQuestion[]): Map<string, MatchedQuestion[]> {
	const grouped = new Map<string, MatchedQuestion[]>();

	for (const match of matches) {
		const category = match.category;
		if (!grouped.has(category)) {
			grouped.set(category, []);
		}
		grouped.get(category)!.push(match);
	}

	return grouped;
}
