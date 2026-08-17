import { db } from '$lib/server/db';
import { redirect, fail, error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const userId = locals.userId;
	if (!userId) throw redirect(302, '/');

	const partner = db
		.prepare('SELECT partner_id FROM partner_connections WHERE user_id = ?')
		.get(userId) as { partner_id: string } | undefined;

	const hasPushSubscription = !!(db
		.prepare('SELECT 1 FROM push_subscriptions WHERE user_id = ?')
		.get(userId));

	return {
		userId,
		partnerId: partner?.partner_id ?? null,
		hasPushSubscription
	};
};

export const actions: Actions = {
	connectPartner: async ({ request, locals }) => {
		const userId = locals.userId;
		if (!userId) throw error(401);

		const formData = await request.formData();
		const partnerId = (formData.get('partnerId') as string)?.trim();

		if (!partnerId) return fail(400, { error: 'Bitte gib eine Partner-ID ein.' });
		if (partnerId === userId) return fail(400, { error: 'Das ist deine eigene ID.' });

		const exists = db.prepare('SELECT 1 FROM users WHERE id = ?').get(partnerId);
		if (!exists) return fail(404, { error: 'Partner nicht gefunden. Prüfe die ID.' });

		db.prepare(
			`INSERT INTO partner_connections (user_id, partner_id)
			VALUES (?, ?)
			ON CONFLICT(user_id) DO UPDATE SET partner_id = excluded.partner_id, connected_at = unixepoch()`
		).run(userId, partnerId);

		return { connected: true };
	},

	disconnectPartner: async ({ locals }) => {
		const userId = locals.userId;
		if (!userId) throw error(401);

		db.prepare('DELETE FROM partner_connections WHERE user_id = ?').run(userId);

		return { disconnected: true };
	}
};
