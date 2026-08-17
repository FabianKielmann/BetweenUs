<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import QuestionCard from '$lib/components/QuestionCard.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import type { PageData } from './$types';
	import type { ResponseType } from '$lib/types';

	const { data }: { data: PageData } = $props();
	let submitting = $state(false);

	async function handleAnswer(response: ResponseType) {
		if (!data.question || submitting) return;
		submitting = true;
		await fetch('/api/answers', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ questionId: data.question.id, response })
		});
		submitting = false;
		await invalidateAll();
	}
</script>

<div class="max-w-2xl mx-auto space-y-6">
	<ProgressBar current={data.answered} total={data.total} />

	{#if data.question}
		<div class:opacity-50={submitting} class:pointer-events-none={submitting}>
			<QuestionCard question={data.question} onAnswer={handleAnswer} />
		</div>
	{:else}
		<div class="bg-white/90 backdrop-blur-sm rounded-2xl p-10 shadow-lg border border-pink-100 text-center space-y-6">
			<div class="text-6xl">🎉</div>
			<h2 class="text-2xl font-bold text-gray-800">
				Du hast alle {data.total} Fragen beantwortet!
			</h2>
			<p class="text-gray-600">
				Schau dir jetzt deine Matches mit deinem Partner an.
			</p>
			<a
				href="/matches"
				class="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
			>
				Matches ansehen
			</a>
		</div>
	{/if}
</div>
