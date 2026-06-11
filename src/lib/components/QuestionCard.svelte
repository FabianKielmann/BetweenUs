<script lang="ts">
	import type { Question, ResponseType } from '$lib/types';
	import { PUBLIC_PRIVACY_MODE } from '$env/static/public';

	const privacyMode = PUBLIC_PRIVACY_MODE === 'true';

	interface Props {
		question: Question;
		currentAnswer?: ResponseType;
		onAnswer: (response: ResponseType) => void;
	}

	const { question, currentAnswer, onAnswer }: Props = $props();

	let revealed = $state(false);

	$effect(() => {
		// Reset reveal when question changes
		question;
		revealed = false;
	});
</script>

<div class="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-pink-100">
	<div class="mb-6">
		<span class="text-sm font-medium text-purple-600 uppercase tracking-wide">
			{question.category}
		</span>
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<h2
			class="text-2xl font-semibold mt-2 text-gray-800 transition-[filter] duration-200 {privacyMode && !revealed ? 'blur-sm select-none cursor-pointer' : ''}"
			ondblclick={() => { if (privacyMode) revealed = true; }}
		>
			{question.text}
		</h2>
	</div>

	<div class="grid grid-cols-3 gap-4">
		<button
			onclick={() => onAnswer('yes')}
			class="flex flex-col items-center gap-1 py-4 px-2 sm:px-6 rounded-xl font-semibold transition-all duration-200 {currentAnswer === 'yes'
				? 'bg-green-500 text-white shadow-lg scale-105'
				: 'bg-green-100 text-green-700 hover:bg-green-200 hover:shadow-md'}"
		>
			<svg xmlns="http://www.w3.org/2000/svg" class="size-5 sm:size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
				<polyline points="20 6 9 17 4 12" />
			</svg>
			<span class="text-xs sm:text-base">Ja</span>
		</button>
		<button
			onclick={() => onAnswer('maybe')}
			class="flex flex-col items-center gap-1 py-4 px-2 sm:px-6 rounded-xl font-semibold transition-all duration-200 {currentAnswer === 'maybe'
				? 'bg-yellow-500 text-white shadow-lg scale-105'
				: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 hover:shadow-md'}"
		>
			<svg xmlns="http://www.w3.org/2000/svg" class="size-5 sm:size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
				<path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01" />
				<circle cx="12" cy="12" r="10" />
			</svg>
			<span class="text-xs sm:text-base">Vielleicht</span>
		</button>
		<button
			onclick={() => onAnswer('no')}
			class="flex flex-col items-center gap-1 py-4 px-2 sm:px-6 rounded-xl font-semibold transition-all duration-200 {currentAnswer === 'no'
				? 'bg-red-500 text-white shadow-lg scale-105'
				: 'bg-red-100 text-red-700 hover:bg-red-200 hover:shadow-md'}"
		>
			<svg xmlns="http://www.w3.org/2000/svg" class="size-5 sm:size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
				<line x1="18" y1="6" x2="6" y2="18" />
				<line x1="6" y1="6" x2="18" y2="18" />
			</svg>
			<span class="text-xs sm:text-base">Nein</span>
		</button>
	</div>
</div>
