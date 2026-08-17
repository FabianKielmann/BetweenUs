import { db } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Question } from '$lib/types';

export const load: PageServerLoad = async ({ locals }) => {
	const userId = locals.userId;
	if (!userId) throw redirect(302, '/');

	const question = db
		.prepare(
			`SELECT id, category, text FROM questions
			WHERE id NOT IN (SELECT question_id FROM answers WHERE user_id = ?)
			ORDER BY RANDOM()
			LIMIT 1`
		)
		.get(userId) as Question | undefined;

	const stats = db
		.prepare(
			`SELECT
				(SELECT COUNT(*) FROM answers WHERE user_id = ?) as answered,
				(SELECT COUNT(*) FROM questions) as total`
		)
		.get(userId) as { answered: number; total: number };

	return {
		question: question ?? null,
		answered: stats.answered,
		total: stats.total
	};
};
