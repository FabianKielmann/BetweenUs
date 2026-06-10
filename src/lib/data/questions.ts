import type { Question } from '$lib/types';
import questionsData from './questions.json';

export const questions: Question[] = questionsData as Question[];
export const categories = Array.from(new Set(questions.map((q) => q.category)));
