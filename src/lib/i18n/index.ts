import { writable, derived } from 'svelte/store';
import en from './en';
import de from './de';
import type { Translations } from './en';

export type Locale = 'en' | 'de';

const translations: Record<Locale, Translations> = { en, de };

function createLocaleStore() {
	const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('locale') : null;
	const initial: Locale = (stored === 'de' ? 'de' : 'en');
	const { subscribe, set } = writable<Locale>(initial);

	return {
		subscribe,
		set(locale: Locale) {
			if (typeof localStorage !== 'undefined') localStorage.setItem('locale', locale);
			set(locale);
		}
	};
}

export const locale = createLocaleStore();
export const t = derived(locale, ($locale) => translations[$locale]);

/** Interpolate {key} placeholders: fmt(str, { n: 3, total: 6 }) */
export function fmt(str: string, vars: Record<string, string | number>): string {
	return str.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? `{${key}}`));
}

export const localeNames: Record<Locale, string> = {
	en: 'EN',
	de: 'DE'
};
