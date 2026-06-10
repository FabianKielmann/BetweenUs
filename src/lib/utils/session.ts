import { v4 as uuidv4 } from 'uuid';
import type { Session, Answer, ShareCode } from '$lib/types';
import { encodeShareCode } from './encoding';

const SESSION_KEY = 'betweenus_session';
const PARTNER_KEY = 'betweenus_partner';

export function createSession(): Session {
	const session: Session = {
		sessionId: uuidv4(),
		timestamp: Date.now(),
		answers: []
	};
	saveSession(session);
	return session;
}

export function saveSession(session: Session): void {
	if (typeof window !== 'undefined') {
		localStorage.setItem(SESSION_KEY, JSON.stringify(session));
	}
}

export function loadSession(): Session | null {
	if (typeof window === 'undefined') return null;
	const data = localStorage.getItem(SESSION_KEY);
	if (!data) return null;
	try {
		return JSON.parse(data);
	} catch {
		return null;
	}
}

export function updateAnswers(answers: Answer[]): void {
	const session = loadSession();
	if (session) {
		session.answers = answers;
		session.timestamp = Date.now();
		saveSession(session);
	}
}

export function generateShareCode(session: Session): string {
	const shareCode: ShareCode = {
		v: 1,
		s: session.sessionId,
		a: session.answers
	};
	return encodeShareCode(shareCode);
}

export function savePartnerData(shareCode: ShareCode): void {
	if (typeof window !== 'undefined') {
		localStorage.setItem(PARTNER_KEY, JSON.stringify(shareCode));
	}
}

export function loadPartnerData(): ShareCode | null {
	if (typeof window === 'undefined') return null;
	const data = localStorage.getItem(PARTNER_KEY);
	if (!data) return null;
	try {
		return JSON.parse(data);
	} catch {
		return null;
	}
}

export function clearSession(): void {
	if (typeof window !== 'undefined') {
		localStorage.removeItem(SESSION_KEY);
		localStorage.removeItem(PARTNER_KEY);
	}
}

export function saveMyCode(code: string): void {
	const session = loadSession();
	if (session) {
		session.myCode = code;
		saveSession(session);
	}
}

export function loadMyCode(): string | null {
	const session = loadSession();
	return session?.myCode || null;
}

export function savePartnerCodeToSession(code: string): void {
	const session = loadSession();
	if (session) {
		session.partnerCode = code;
		saveSession(session);
	}
}

export function loadPartnerCodeFromSession(): string | null {
	const session = loadSession();
	return session?.partnerCode || null;
}

export function hasBothCodes(): boolean {
	const session = loadSession();
	return !!(session?.myCode && session?.partnerCode);
}
