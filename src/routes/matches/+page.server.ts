import { db } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';
import { groupByCategory } from '$lib/utils/matching';
import type { PageServerLoad } from './$types';
import type { MatchedQuestion } from '$lib/types';

export const load: PageServerLoad = async ({ locals }) => {
	const userId = locals.userId;
	if (!userId) throw redirect(302, '/');

	const partner = db
		.prepare('SELECT partner_id FROM partner_connections WHERE user_id = ?')
		.get(userId) as { partner_id: string } | undefined;

	if (!partner) {
		return { hasPartner: false, matches: [], maybeMatches: [], groupedMatches: [], groupedMaybeMatches: [] };
	}

	const matches = db
		.prepare(
			`SELECT q.id, q.category, q.text, ua.response AS userAnswer, pa.response AS partnerAnswer
			FROM answers ua
			JOIN answers pa ON ua.question_id = pa.question_id AND pa.user_id = ?
			JOIN questions q ON q.id = ua.question_id
			WHERE ua.user_id = ?
			  AND ua.response = 'yes'
			  AND pa.response = 'yes'`
		)
		.all(partner.partner_id, userId) as MatchedQuestion[];

	const maybeMatches = db
		.prepare(
			`SELECT q.id, q.category, q.text, ua.response AS userAnswer, pa.response AS partnerAnswer
			FROM answers ua
			JOIN answers pa ON ua.question_id = pa.question_id AND pa.user_id = ?
			JOIN questions q ON q.id = ua.question_id
			WHERE ua.user_id = ?
			  AND ua.response != 'no'
			  AND pa.response != 'no'
			  AND (ua.response = 'maybe' OR pa.response = 'maybe')`
		)
		.all(partner.partner_id, userId) as MatchedQuestion[];

	const groupedMatches = Array.from(groupByCategory(matches).entries());
	const groupedMaybeMatches = Array.from(groupByCategory(maybeMatches).entries());

	return {
		hasPartner: true,
		matches,
		maybeMatches,
		groupedMatches,
		groupedMaybeMatches
	};
};
