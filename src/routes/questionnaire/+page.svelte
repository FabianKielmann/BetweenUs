<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import QuestionCard from '$lib/components/QuestionCard.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import ShareCode from '$lib/components/ShareCode.svelte';
	import PartnerCodeInput from '$lib/components/PartnerCodeInput.svelte';
	import { questions } from '$lib/data/questions';
	import type { Answer, ResponseType } from '$lib/types';
	import { loadSession, updateAnswers, generateShareCode, saveMyCode, savePartnerCodeToSession, loadPartnerCodeFromSession, loadMyCode } from '$lib/utils/session';
	import { categories } from '$lib/data/questions';

	let currentIndex = $state(0);
	let answers = $state<Answer[]>([]);
	let shareCode = $state<string>('');
	let isComplete = $state(false);
	let alreadyHasPartnerCode = $state(false);
	let showOverview = $state(false);
	let updatingExistingCode = $state(false);

	onMount(() => {
		const session = loadSession();
		if (!session) {
			goto('/');
			return;
		}
		answers = session.answers.length > 0 ? session.answers : [];
		if (session.answers.length > 0) {
			const answeredIds = new Set(session.answers.map((a) => a.questionId));
			const firstUnanswered = questions.findIndex((q) => !answeredIds.has(q.id));
			currentIndex = firstUnanswered === -1 ? questions.length - 1 : firstUnanswered;
		}
		alreadyHasPartnerCode = !!loadPartnerCodeFromSession();
		updatingExistingCode = !!loadMyCode();
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

	function jumpToQuestion(index: number) {
		if (isComplete) isComplete = false;
		currentIndex = index;
		showOverview = false;
	}

	function goToResults() {
		goto('/results');
	}

	const currentAnswer = $derived(
		answers.find((a) => a.questionId === questions[currentIndex]?.id)?.response
	);

	const answerMap = $derived(new Map(answers.map((a) => [a.questionId, a.response])));

	const yesCount = $derived(answers.filter((a) => a.response === 'yes').length);
	const maybeCount = $derived(answers.filter((a) => a.response === 'maybe').length);
	const noCount = $derived(answers.filter((a) => a.response === 'no').length);

	function badgeClasses(questionId: string): string {
		const r = answerMap.get(questionId);
		if (r === 'yes') return 'bg-green-100 text-green-700';
		if (r === 'maybe') return 'bg-yellow-100 text-yellow-700';
		if (r === 'no') return 'bg-red-100 text-red-700';
		return 'bg-gray-100 text-gray-400';
	}

	function badgeLabel(questionId: string): string {
		const r = answerMap.get(questionId);
		if (r === 'yes') return 'Ja';
		if (r === 'maybe') return 'Vielleicht';
		if (r === 'no') return 'Nein';
		return '–';
	}
</script>

<div class="max-w-3xl mx-auto space-y-6">
	{#if showOverview}
		<div class="flex items-center justify-between">
			<h2 class="font-semibold text-gray-800">Alle Fragen</h2>
			<button
				onclick={() => showOverview = false}
				class="px-3 py-1.5 text-sm bg-white/80 border border-gray-200 rounded-lg text-gray-600 hover:bg-white hover:shadow-sm transition-all"
			>
				← Zurück zur Frage
			</button>
		</div>

		<div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-pink-100 overflow-hidden">
			{#each categories as category}
				{@const catQuestions = questions.map((q, i) => ({ q, i })).filter(({ q }) => q.category === category)}
				<div>
					<p class="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50 border-b border-gray-100">
						{category}
					</p>
					{#each catQuestions as { q, i }}
						<button
							onclick={() => jumpToQuestion(i)}
							class="w-full flex items-center justify-between gap-3 px-4 py-3 text-left border-b border-gray-100 transition-colors {i === currentIndex ? 'bg-purple-50' : 'hover:bg-gray-50'}"
						>
							<span class="text-sm text-gray-800 flex-1">{q.text}</span>
							<span class="text-xs font-medium px-2 py-0.5 rounded-full shrink-0 {badgeClasses(q.id)}">
								{badgeLabel(q.id)}
							</span>
						</button>
					{/each}
				</div>
			{/each}
		</div>
	{:else if !isComplete}
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
				← Zurück
			</button>
			<button
				onclick={() => showOverview = true}
				class="px-4 py-2 text-sm bg-white/80 border border-gray-200 rounded-lg text-gray-600 hover:bg-white hover:shadow-sm transition-all"
			>
				Übersicht
			</button>
		</div>
	{:else}
		<div class="space-y-6">
			<div class="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-pink-100 text-center">
				<h1 class="text-3xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
					Alles erledigt!
				</h1>
				<p class="text-gray-700">
					{#if alreadyHasPartnerCode}
						Du hast alle Fragen beantwortet! Bereit, deine Übereinstimmungen zu sehen?
					{:else}
						Tauscht jetzt Codes mit deinem Partner aus, um eure Übereinstimmungen zu sehen.
					{/if}
				</p>
				<div class="flex justify-center gap-4 mt-4 text-sm">
					<span class="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">{yesCount}× Ja</span>
					<span class="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full font-medium">{maybeCount}× Vielleicht</span>
					<span class="px-3 py-1 bg-red-100 text-red-700 rounded-full font-medium">{noCount}× Nein</span>
				</div>
				<button
					onclick={() => showOverview = true}
					class="mt-4 px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-all"
				>
					Antworten überprüfen
				</button>
			</div>

			{#if updatingExistingCode}
				<div class="bg-amber-50 border border-amber-300 rounded-xl p-4 flex gap-3">
					<svg class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"></path>
					</svg>
					<p class="text-sm text-amber-800">
						<span class="font-semibold">Neuer Code erzeugt.</span> Dein Partner muss diesen neuen Code eingeben – der alte ist nicht mehr gültig.
					</p>
				</div>
			{/if}

			<div class="bg-blue-50 border border-blue-200 rounded-xl p-6">
				<div class="flex items-center gap-3 mb-3">
					<div class="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
						{#if alreadyHasPartnerCode}✓{:else}1{/if}
					</div>
					<h3 class="font-semibold text-blue-900">Teile DEINEN Code mit deinem Partner</h3>
				</div>
				<ShareCode code={shareCode} standalone={false} />
			</div>

			{#if !alreadyHasPartnerCode}
				<div class="bg-purple-50 border border-purple-200 rounded-xl p-6">
					<div class="flex items-center gap-3 mb-3">
						<div class="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold">2</div>
						<h3 class="font-semibold text-purple-900">Hol dir den Code deines Partners und gib ihn unten ein</h3>
					</div>
					<PartnerCodeInput onSuccess={handlePartnerCode} standalone={false} />
				</div>

				<div class="text-center">
					<button onclick={goToResults} class="text-sm text-gray-600 hover:text-gray-800 underline">
						Jetzt überspringen, ich gebe ihn später ein
					</button>
				</div>
			{:else}
				<button
					onclick={goToResults}
					class="w-full max-w-md mx-auto block bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
				>
					Ergebnisse anzeigen
				</button>
			{/if}
		</div>
	{/if}
</div>
