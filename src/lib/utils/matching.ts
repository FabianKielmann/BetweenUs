import type { MatchedQuestion } from '$lib/types';

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
