import { db } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, cookies }) => {
	const { uuid } = params;

	const exists = db.prepare('SELECT 1 FROM users WHERE id = ?').get(uuid);
	if (!exists) throw redirect(302, '/');

	cookies.set('bu_uid', uuid, {
		httpOnly: true,
		path: '/',
		sameSite: 'strict',
		maxAge: 60 * 60 * 24 * 365 * 2
	});

	throw redirect(302, '/');
};
