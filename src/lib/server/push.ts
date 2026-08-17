import webpush from 'web-push';
import { VAPID_PRIVATE_KEY, VAPID_SUBJECT } from '$env/static/private';
import { PUBLIC_VAPID_PUBLIC_KEY } from '$env/static/public';
import { db } from './db';

let vapidConfigured = false;

function ensureVapid() {
	if (vapidConfigured) return;
	if (!VAPID_PRIVATE_KEY || !PUBLIC_VAPID_PUBLIC_KEY || !VAPID_SUBJECT) return;
	webpush.setVapidDetails(VAPID_SUBJECT, PUBLIC_VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
	vapidConfigured = true;
}

export async function sendMatchNotification(recipientUserId: string): Promise<void> {
	ensureVapid();
	if (!vapidConfigured) return;

	const sub = db
		.prepare('SELECT endpoint, p256dh, auth FROM push_subscriptions WHERE user_id = ?')
		.get(recipientUserId) as { endpoint: string; p256dh: string; auth: string } | undefined;
	if (!sub) return;

	const now = Math.floor(Date.now() / 1000);
	const log = db
		.prepare('SELECT last_sent_at FROM push_notification_log WHERE user_id = ?')
		.get(recipientUserId) as { last_sent_at: number } | undefined;

	if (log && now - log.last_sent_at < 600) return;

	try {
		await webpush.sendNotification(
			{ endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
			JSON.stringify({
				title: 'BetweenUs',
				body: 'Dein Partner hat neue Fragen beantwortet',
				url: '/matches'
			})
		);
		db.prepare(
			`INSERT INTO push_notification_log (user_id, last_sent_at) VALUES (?, ?)
			ON CONFLICT(user_id) DO UPDATE SET last_sent_at = excluded.last_sent_at`
		).run(recipientUserId, now);
	} catch (err: unknown) {
		if ((err as { statusCode?: number }).statusCode === 410) {
			db.prepare('DELETE FROM push_subscriptions WHERE user_id = ?').run(recipientUserId);
		}
	}
}
