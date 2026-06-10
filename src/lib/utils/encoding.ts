import type { ShareCode } from '$lib/types';

export function encodeShareCode(shareCode: ShareCode): string {
	const json = JSON.stringify(shareCode);
	const base64 = btoa(json);
	const urlSafe = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
	const checksum = generateChecksum(urlSafe);
	return `${urlSafe}${checksum}`;
}

export function decodeShareCode(code: string): ShareCode | null {
	try {
		const checksum = code.slice(-4);
		const data = code.slice(0, -4);

		if (generateChecksum(data) !== checksum) {
			return null;
		}

		const base64 = data.replace(/-/g, '+').replace(/_/g, '/');
		const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
		const json = atob(padded);
		const shareCode = JSON.parse(json);

		if (!isValidShareCode(shareCode)) {
			return null;
		}

		return shareCode;
	} catch {
		return null;
	}
}

function generateChecksum(data: string): string {
	let hash = 0;
	for (let i = 0; i < data.length; i++) {
		hash = (hash << 5) - hash + data.charCodeAt(i);
		hash = hash & hash;
	}
	return Math.abs(hash).toString(36).padStart(4, '0').slice(0, 4);
}

function isValidShareCode(obj: unknown): obj is ShareCode {
	if (typeof obj !== 'object' || obj === null) return false;
	const code = obj as Record<string, unknown>;
	return (
		code.v === 1 &&
		typeof code.s === 'string' &&
		Array.isArray(code.a) &&
		code.a.every(
			(a: unknown) =>
				typeof a === 'object' &&
				a !== null &&
				typeof (a as Record<string, unknown>).questionId === 'string' &&
				['yes', 'maybe', 'no'].includes((a as Record<string, unknown>).response as string)
		)
	);
}
