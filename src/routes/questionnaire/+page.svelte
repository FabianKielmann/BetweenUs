<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import QuestionCard from '$lib/components/QuestionCard.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import ShareCode from '$lib/components/ShareCode.svelte';
	import PartnerCodeInput from '$lib/components/PartnerCodeInput.svelte';
	import { questions } from '$lib/data/questions';
	import type { Answer, ResponseType } from '$lib/types';
	import { loadSession, updateAnswers, generateShareCode, saveMyCode, savePartnerCodeToSession, loadPartnerCodeFromSession } from '$lib/utils/session';

	let currentIndex = $state(0);
	let answers = $state<Answer[]>([]);
	let shareCode = $state<string>('');
	let isComplete = $state(false);
	let alreadyHasPartnerCode = $state(false);

	onMount(() => {
		const session = loadSession();
		if (!session) {
			goto('/');
			return;
		}
		answers = session.answers.length > 0 ? session.answers : [];
		alreadyHasPartnerCode = !!loadPartnerCodeFromSession();
	});

	function handleAnswer(response: ResponseType) {
		const existingIndex = answers.findIndex((a) => a.questionId === questions[currentIndex].id);

		if (existingIndex >= 0) {
			answers[existingIndex].response = response;
			answers = [...answers];
		} else {
			answers = [...answers, { questionId: questions[currentIndex].id, response }];
		}

		updateAnswers(answers);

		if (currentIndex < questions.length - 1) {
			currentIndex++;
		} else {
			completeQuestionnaire();
		}
	}

	function completeQuestionnaire() {
		const session = loadSession();
		if (session) {
			shareCode = generateShareCode(session);
			saveMyCode(shareCode);
			if (alreadyHasPartnerCode) {
				goto('/results');
			} else {
				isComplete = true;
			}
		}
	}

	function handlePartnerCode(code: string) {
		savePartnerCodeToSession(code);
		goto('/results');
	}

	function goBack() {
		if (currentIndex > 0) currentIndex--;
	}

	function goToResults() {
		goto('/results');
	}

	const currentAnswer = $derived(
		answers.find((a) => a.questionId === questions[currentIndex]?.id)?.response
	);
</script>

<div class="max-w-3xl mx-auto space-y-6">
	{#if !isComplete}
		<ProgressBar current={answers.length} total={questions.length} questionNumber={currentIndex + 1} />

		<QuestionCard
			question={questions[currentIndex]}
			currentAnswer={currentAnswer}
			onAnswer={handleAnswer}
		/>

		<div class="flex justify-between">
			<button
				onclick={goBack}
				disabled={currentIndex === 0}
				class="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
			>
				← Back
			</button>
			<span class="text-sm text-gray-600 self-center">
				{answers.length} of {questions.length} answered
			</span>
		</div>
	{:else}
		<div class="space-y-6">
			<div class="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-pink-100 text-center">
				<h1 class="text-3xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
					All Done!
				</h1>
				<p class="text-gray-700">
					{#if alreadyHasPartnerCode}
						You've completed all questions! Ready to see your matches?
					{:else}
						Now exchange codes with your partner to see your matches.
					{/if}
				</p>
			</div>

			<div class="bg-blue-50 border border-blue-200 rounded-xl p-6">
				<div class="flex gap-3 mb-4">
					<div class="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
						{#if alreadyHasPartnerCode}✓{:else}1{/if}
					</div>
					<div class="flex-1">
						<h3 class="font-semibold text-blue-900 mb-2">Share YOUR code with your partner</h3>
						<ShareCode code={shareCode} />
					</div>
				</div>
			</div>

			{#if !alreadyHasPartnerCode}
				<div class="bg-purple-50 border border-purple-200 rounded-xl p-6">
					<div class="flex gap-3">
						<div class="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold">2</div>
						<div class="flex-1">
							<h3 class="font-semibold text-purple-900 mb-3">Get your partner's code and enter it below</h3>
							<PartnerCodeInput onSuccess={handlePartnerCode} />
						</div>
					</div>
				</div>

				<div class="text-center">
					<button onclick={goToResults} class="text-sm text-gray-600 hover:text-gray-800 underline">
						Skip for now, I'll enter it later
					</button>
				</div>
			{:else}
				<button
					onclick={goToResults}
					class="w-full max-w-md mx-auto block bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
				>
					View Results
				</button>
			{/if}
		</div>
	{/if}
</div>
