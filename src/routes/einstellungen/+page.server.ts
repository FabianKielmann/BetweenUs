import { db } from '$lib/server/db';
import { redirect, fail, error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const userId = locals.userId;
	if (!userId) throw redirect(302, '/');

	const user = db
		.prepare('SELECT share_code FROM users WHERE id = ?')
		.get(userId) as { share_code: string } | undefined;

	const partner = db
		.prepare('SELECT partner_id FROM partner_connections WHERE user_id = ?')
		.get(userId) as { partner_id: string } | undefined;

	let partnerShareCode: string | null = null;
	if (partner) {
		const partnerUser = db
			.prepare('SELECT share_code FROM users WHERE id = ?')
			.get(partner.partner_id) as { share_code: string } | undefined;
		partnerShareCode = partnerUser?.share_code ?? null;
	}

	const hasPushSubscription = !!(db
		.prepare('SELECT 1 FROM push_subscriptions WHERE user_id = ?')
		.get(userId));

	return {
		shareCode: user?.share_code ?? '',
		hasPartner: !!partner,
		partnerShareCode,
		hasPushSubscription
	};
};

export const actions: Actions = {
	connectPartner: async ({ request, locals }) => {
		const userId = locals.userId;
		if (!userId) throw error(401);

		const formData = await request.formData();
		const partnerCode = (formData.get('partnerCode') as string)?.trim().toLowerCase();

		if (!partnerCode) return fail(400, { error: 'Bitte gib einen Partner-Code ein.' });

		const partnerUser = db
			.prepare('SELECT id FROM users WHERE share_code = ?')
			.get(partnerCode) as { id: string } | undefined;

		if (!partnerUser) return fail(404, { error: 'Partner nicht gefunden. Prüfe den Code.' });
		if (partnerUser.id === userId) return fail(400, { error: 'Das ist dein eigener Code.' });

		db.prepare(
			`INSERT INTO partner_connections (user_id, partner_id)
			VALUES (?, ?)
			ON CONFLICT(user_id) DO UPDATE SET partner_id = excluded.partner_id, connected_at = unixepoch()`
		).run(userId, partnerUser.id);

		return { connected: true };
	},

	disconnectPartner: async ({ locals }) => {
		const userId = locals.userId;
		if (!userId) throw error(401);

		db.prepare('DELETE FROM partner_connections WHERE user_id = ?').run(userId);

		return { disconnected: true };
	}
};
