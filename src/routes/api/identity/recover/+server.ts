import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const body = await request.json();
	const storedId = (body as { storedId?: string }).storedId?.trim();

	if (!storedId) return json({ recovered: false });

	const exists = db.prepare('SELECT 1 FROM users WHERE id = ?').get(storedId);
	if (!exists) return json({ recovered: false });

	cookies.set('bu_uid', storedId, {
		httpOnly: true,
		path: '/',
		sameSite: 'strict',
		maxAge: 60 * 60 * 24 * 365 * 2
	});

	return json({ recovered: true, userId: storedId });
};
