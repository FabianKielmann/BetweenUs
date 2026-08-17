import { json, error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { sendMatchNotification } from '$lib/server/push';
import type { RequestHandler } from './$types';
import type { ResponseType } from '$lib/types';

export const POST: RequestHandler = async ({ request, locals }) => {
	const userId = locals.userId;
	if (!userId) throw error(401);

	const body = await request.json();
	const { questionId, response } = body as { questionId: string; response: ResponseType };

	if (!questionId || !['yes', 'maybe', 'no'].includes(response)) {
		throw error(400, 'Invalid payload');
	}

	db.prepare(
		`INSERT INTO answers (user_id, question_id, response)
		VALUES (?, ?, ?)
		ON CONFLICT(user_id, question_id) DO UPDATE SET response = excluded.response, answered_at = unixepoch()`
	).run(userId, questionId, response);

	const partner = db
		.prepare('SELECT partner_id FROM partner_connections WHERE user_id = ?')
		.get(userId) as { partner_id: string } | undefined;

	if (partner) {
		const partnerAns = db
			.prepare('SELECT response FROM answers WHERE user_id = ? AND question_id = ?')
			.get(partner.partner_id, questionId) as { response: ResponseType } | undefined;

		if (partnerAns) {
			const p = partnerAns.response;
			const isMatch = response === 'yes' && p === 'yes';
			const isMaybe =
				response !== 'no' && p !== 'no' && (response === 'maybe' || p === 'maybe');
			if (isMatch || isMaybe) {
				await sendMatchNotification(partner.partner_id);
			}
		}
	}

	return json({ ok: true });
};
