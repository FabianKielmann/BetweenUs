<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import CategorySection from '$lib/components/CategorySection.svelte';
	import ShareCode from '$lib/components/ShareCode.svelte';
	import { loadSession, loadMyCode, loadPartnerCodeFromSession, savePartnerCodeToSession } from '$lib/utils/session';
	import { decodeShareCode } from '$lib/utils/encoding';
	import PartnerCodeInput from '$lib/components/PartnerCodeInput.svelte';
	import { findMatches, groupByCategory } from '$lib/utils/matching';
	import type { MatchedQuestion } from '$lib/types';

	let matches = $state<MatchedQuestion[]>([]);
	let groupedMatches = $state<Map<string, MatchedQuestion[]>>(new Map());
	let myCode = $state<string>('');
	let partnerCode = $state<string>('');
	let needsPartnerCode = $state(false);

	onMount(() => {
		const session = loadSession();
		if (!session) { goto('/'); return; }

		myCode = loadMyCode() || '';
		partnerCode = loadPartnerCodeFromSession() || '';

		if (!myCode) { goto('/questionnaire'); return; }
		if (!partnerCode) { needsPartnerCode = true; return; }

		calculateMatches();
	});

	function calculateMatches() {
		const myDecoded = decodeShareCode(myCode);
		const partnerDecoded = decodeShareCode(partnerCode);
		if (myDecoded && partnerDecoded) {
			matches = findMatches(myDecoded.a, partnerDecoded.a);
			groupedMatches = groupByCategory(matches);
		}
	}

	function handlePartnerCode(code: string) {
		partnerCode = code;
		savePartnerCodeToSession(code);
		needsPartnerCode = false;
		calculateMatches();
	}

	function updateAnswers() {
		goto('/questionnaire');
	}
</script>

<div class="max-w-4xl mx-auto space-y-6">
	{#if needsPartnerCode}
		<div class="text-center space-y-6">
			<div class="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-pink-100">
				<h1 class="text-3xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
					Almost There!
				</h1>
				<p class="text-gray-700 mb-4">Enter your partner's code to see your mutual matches.</p>
			</div>

			<PartnerCodeInput onSuccess={handlePartnerCode} />

			<div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
				<div class="flex gap-3">
					<svg class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
					</svg>
					<p class="text-sm text-blue-800">
						Both of you need to complete the questionnaire and exchange codes. This ensures mutual privacy - no one can see the other's answers until both have committed!
					</p>
				</div>
			</div>
		</div>

	{:else if matches.length === 0}
		<div class="text-center space-y-6">
			<div class="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-pink-100">
				<h1 class="text-3xl font-bold mb-4 text-gray-800">No Matches Found</h1>
				<p class="text-gray-700 mb-6">
					You and your partner didn't both say "yes" to any of the same things. That's okay! Everyone has different preferences.
				</p>
				<p class="text-gray-600">Consider reviewing your answers or having an open conversation about your desires.</p>
			</div>
			<button
				onclick={updateAnswers}
				class="w-full max-w-md mx-auto block bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
			>
				Update My Answers
			</button>
		</div>

	{:else}
		<div class="text-center space-y-4">
			<div class="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-pink-100">
				<h1 class="text-3xl font-bold mb-2 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
					Your Matches
				</h1>
				<p class="text-gray-700">
					You both said "yes" to {matches.length} thing{matches.length !== 1 ? 's' : ''}!
				</p>
			</div>
		</div>

		<div class="bg-orange-50 border border-orange-200 rounded-xl p-6">
			<div class="flex gap-3">
				<svg class="w-6 h-6 text-orange-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
				</svg>
				<div class="flex-1">
					<p class="text-sm text-orange-800 font-semibold mb-2">
						Share your code with your partner so they can see the results too!
					</p>
					<ShareCode code={myCode} />
				</div>
			</div>
		</div>

		<div class="space-y-4">
			{#each Array.from(groupedMatches.entries()) as [category, categoryMatches]}
				<CategorySection category={category} matches={categoryMatches} />
			{/each}
		</div>

		<div class="flex gap-4 justify-center pt-4">
			<button
				onclick={updateAnswers}
				class="px-8 py-3 bg-white text-purple-600 font-semibold rounded-xl shadow-md border-2 border-purple-300 hover:border-purple-500 hover:shadow-lg transition-all duration-200"
			>
				Update My Answers
			</button>
		</div>

		<div class="bg-green-50 border border-green-200 rounded-xl p-6">
			<div class="flex gap-3">
				<svg class="w-6 h-6 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
				</svg>
				<div class="text-sm text-green-800">
					<p class="font-semibold mb-1">What's next?</p>
					<p>These are things you both expressed interest in! Have an open conversation and decide together what you'd like to explore.</p>
				</div>
			</div>
		</div>
	{/if}
</div>
