import { db } from '$lib/server/db';
import { adjectives, nouns } from '$lib/data/wordlist';
import type { LayoutServerLoad } from './$types';

function generateShareCode(): string {
	const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
	const noun = nouns[Math.floor(Math.random() * nouns.length)];
	return `${adj}-${noun}`;
}

export const load: LayoutServerLoad = async ({ cookies, locals }) => {
	let userId = cookies.get('bu_uid');

	const user = userId
		? (db.prepare('SELECT id, share_code, onboarding_done FROM users WHERE id = ?').get(userId) as
				| { id: string; share_code: string | null; onboarding_done: number }
				| undefined)
		: undefined;

	if (!userId || !user) {
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

	let shareCode = user?.share_code ?? null;
	if (!shareCode) {
		while (!shareCode) {
			const candidate = generateShareCode();
			const result = db
				.prepare('UPDATE users SET share_code = ? WHERE id = ? AND share_code IS NULL')
				.run(candidate, userId);
			if (result.changes) shareCode = candidate;
		}
	}

	locals.userId = userId;

	const onboardingDone = user?.onboarding_done ?? 0;

	return { userId, shareCode, showOnboarding: onboardingDone === 0 };
};
