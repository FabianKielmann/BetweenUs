import '$lib/server/db';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.userId = event.cookies.get('bu_uid');
	return resolve(event);
};
