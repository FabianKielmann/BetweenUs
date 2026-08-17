import { json, error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	const userId = locals.userId;
	if (!userId) throw error(401);

	const body = await request.json();
	const { endpoint, p256dh, auth } = body as { endpoint: string; p256dh: string; auth: string };

	if (!endpoint || !p256dh || !auth) throw error(400, 'Invalid subscription');

	db.prepare(
		`INSERT INTO push_subscriptions (user_id, endpoint, p256dh, auth)
		VALUES (?, ?, ?, ?)
		ON CONFLICT(user_id) DO UPDATE SET endpoint = excluded.endpoint, p256dh = excluded.p256dh, auth = excluded.auth, updated_at = unixepoch()`
	).run(userId, endpoint, p256dh, auth);

	return json({ ok: true });
};

export const DELETE: RequestHandler = async ({ locals }) => {
	const userId = locals.userId;
	if (!userId) throw error(401);

	db.prepare('DELETE FROM push_subscriptions WHERE user_id = ?').run(userId);

	return json({ ok: true });
};
