import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals }) => {
	const userId = locals.userId;
	if (!userId) return json({ ok: false }, { status: 401 });

	db.prepare('UPDATE users SET onboarding_done = 1 WHERE id = ?').run(userId);

	return json({ ok: true });
};
