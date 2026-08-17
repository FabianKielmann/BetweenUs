import { db } from '$lib/server/db';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
	let userId = cookies.get('bu_uid');

	const userExists = userId
		? !!(db.prepare('SELECT 1 FROM users WHERE id = ?').get(userId))
		: false;

	if (!userId || !userExists) {
		userId = crypto.randomUUID();
		db.prepare('INSERT INTO users (id) VALUES (?)').run(userId);
		cookies.set('bu_uid', userId, {
			httpOnly: true,
			path: '/',
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 * 365 * 2
		});
	} else {
		db.prepare('UPDATE users SET last_seen_at = unixepoch() WHERE id = ?').run(userId);
	}

	return { userId };
};
