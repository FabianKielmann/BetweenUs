import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import Database from 'better-sqlite3';
import { questions } from '$lib/data/questions';

const DB_PATH = process.env.DB_PATH ?? './data/betweenus.db';
mkdirSync(dirname(DB_PATH), { recursive: true });

export const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
	CREATE TABLE IF NOT EXISTS users (
		id TEXT PRIMARY KEY,
		created_at INTEGER NOT NULL DEFAULT (unixepoch()),
		last_seen_at INTEGER NOT NULL DEFAULT (unixepoch())
	);

	CREATE TABLE IF NOT EXISTS questions (
		id TEXT PRIMARY KEY,
		category TEXT NOT NULL,
		text TEXT NOT NULL
	);

	CREATE TABLE IF NOT EXISTS answers (
		user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
		question_id TEXT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
		response TEXT NOT NULL CHECK(response IN ('yes','maybe','no')),
		answered_at INTEGER NOT NULL DEFAULT (unixepoch()),
		PRIMARY KEY (user_id, question_id)
	);

	CREATE TABLE IF NOT EXISTS partner_connections (
		user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
		partner_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
		connected_at INTEGER NOT NULL DEFAULT (unixepoch())
	);

	CREATE TABLE IF NOT EXISTS push_subscriptions (
		user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
		endpoint TEXT NOT NULL,
		p256dh TEXT NOT NULL,
		auth TEXT NOT NULL,
		updated_at INTEGER NOT NULL DEFAULT (unixepoch())
	);

	CREATE TABLE IF NOT EXISTS push_notification_log (
		user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
		last_sent_at INTEGER NOT NULL
	);
`);

try { db.exec('ALTER TABLE users ADD COLUMN share_code TEXT'); } catch { /* already exists */ }
db.exec('CREATE UNIQUE INDEX IF NOT EXISTS idx_users_share_code ON users(share_code)');
try { db.exec('ALTER TABLE users ADD COLUMN onboarding_done INTEGER NOT NULL DEFAULT 0'); } catch { /* already exists */ }

const upsertQuestion = db.prepare(
	'INSERT OR IGNORE INTO questions (id, category, text) VALUES (?, ?, ?)'
);
const seedQuestions = db.transaction(() => {
	for (const q of questions) {
		upsertQuestion.run(q.id, q.category, q.text);
	}
});
seedQuestions();
