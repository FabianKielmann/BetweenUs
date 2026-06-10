import { writable } from 'svelte/store';
import type { Answer } from '$lib/types';

export const userAnswers = writable<Answer[]>([]);
export const currentQuestionIndex = writable<number>(0);
