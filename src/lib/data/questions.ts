import type { Question } from '$lib/types';
import { derived } from 'svelte/store';
import { locale } from '$lib/i18n';
import enData from './questions.json';
import deData from './questions.de.json';

const questionsByLocale: Record<string, Question[]> = {
	en: enData as Question[],
	de: deData as Question[]
};

export const questions = derived(locale, ($locale) => questionsByLocale[$locale] ?? enData as Question[]);
