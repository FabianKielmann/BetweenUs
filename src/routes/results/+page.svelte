<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import CategorySection from '$lib/components/CategorySection.svelte';
	import ShareCode from '$lib/components/ShareCode.svelte';
	import { loadSession, loadMyCode, loadPartnerCodeFromSession, savePartnerCodeToSession } from '$lib/utils/session';
	import { decodeShareCode } from '$lib/utils/encoding';
	import PartnerCodeInput from '$lib/components/PartnerCodeInput.svelte';
	import { findMatches, findMaybeMatches, groupByCategory } from '$lib/utils/matching';
	import type { MatchedQuestion } from '$lib/types';

	let matches = $state<MatchedQuestion[]>([]);
	let groupedMatches = $state<Map<string, MatchedQuestion[]>>(new Map());
	let maybeMatches = $state<MatchedQuestion[]>([]);
	let groupedMaybeMatches = $state<Map<string, MatchedQuestion[]>>(new Map());
	let myCode = $state<string>('');
	let partnerCode = $state<string>('');
	let needsPartnerCode = $state(false);
	let changingPartnerCode = $state(false);

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
			maybeMatches = findMaybeMatches(myDecoded.a, partnerDecoded.a);
			groupedMaybeMatches = groupByCategory(maybeMatches);
		}
	}

	function handlePartnerCode(code: string) {
		partnerCode = code;
		savePartnerCodeToSession(code);
		needsPartnerCode = false;
		changingPartnerCode = false;
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
					Fast geschafft!
				</h1>
				<p class="text-gray-700 mb-4">Gib den Code deines Partners ein, um eure gemeinsamen Übereinstimmungen zu sehen.</p>
			</div>

			<div class="bg-blue-50 border border-blue-200 rounded-xl p-6 text-left">
				<div class="flex gap-3">
					<div class="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">1</div>
					<div class="flex-1">
						<h3 class="font-semibold text-blue-900 mb-2">Teile DEINEN Code mit deinem Partner</h3>
						<ShareCode code={myCode} />
					</div>
				</div>
			</div>

			<div class="bg-purple-50 border border-purple-200 rounded-xl p-6 text-left">
				<div class="flex gap-3">
					<div class="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold">2</div>
					<div class="flex-1">
						<h3 class="font-semibold text-purple-900 mb-3">Gib den Code deines Partners ein</h3>
						<PartnerCodeInput onSuccess={handlePartnerCode} />
					</div>
				</div>
			</div>

			<div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
				<div class="flex gap-3">
					<svg class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
					</svg>
					<p class="text-sm text-blue-800">
						Ihr beide müsst den Fragebogen ausfüllen und Codes tauschen. Das gewährleistet gegenseitige Privatsphäre – niemand kann die Antworten des anderen sehen, bis beide zugestimmt haben!
					</p>
				</div>
			</div>
		</div>

	{:else if matches.length === 0}
		<div class="text-center space-y-6">
			<div class="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-pink-100">
				<h1 class="text-3xl font-bold mb-4 text-gray-800">Keine Übereinstimmungen gefunden</h1>
				<p class="text-gray-700 mb-6">
					Ihr habt bei keiner Frage beide "Ja" gesagt. Das ist okay! Jeder hat andere Vorlieben.
				</p>
				<p class="text-gray-600">Überleg dir, deine Antworten zu überprüfen oder ein offenes Gespräch über eure Wünsche zu führen.</p>
			</div>

			{#if maybeMatches.length > 0}
				<div class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-amber-200 text-left">
					<h2 class="text-xl font-bold mb-1 text-amber-600">Vielleicht besprechen</h2>
					<p class="text-sm text-gray-600 mb-4">
						Bei {maybeMatches.length} {maybeMatches.length === 1 ? 'Frage' : 'Fragen'} hat mindestens einer von euch "Vielleicht" gesagt – eine gute Basis für ein offenes Gespräch.
					</p>
					<div class="space-y-4">
						{#each Array.from(groupedMaybeMatches.entries()) as [category, categoryMatches]}
							<CategorySection category={category} matches={categoryMatches} variant="maybe" />
						{/each}
					</div>
				</div>
			{/if}

			<button
				onclick={updateAnswers}
				class="w-full max-w-md mx-auto block bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
			>
				Meine Antworten aktualisieren
			</button>
			<button
				onclick={() => { changingPartnerCode = !changingPartnerCode; }}
				class="w-full max-w-md mx-auto block bg-white text-gray-500 font-semibold py-3 px-8 rounded-xl border border-gray-200 hover:border-gray-400 hover:text-gray-700 transition-all duration-200 text-sm"
			>
				Partner-Code ändern
			</button>
			{#if changingPartnerCode}
				<div class="w-full max-w-md mx-auto">
					<PartnerCodeInput onSuccess={handlePartnerCode} />
				</div>
			{/if}
		</div>

	{:else}
		<div class="text-center space-y-4">
			<div class="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-pink-100">
				<h1 class="text-3xl font-bold mb-2 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
					Eure Übereinstimmungen
				</h1>
				<p class="text-gray-700">
					Ihr habt bei {matches.length} {matches.length === 1 ? 'Frage' : 'Fragen'} beide "Ja" gesagt!
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
						Teile deinen Code mit deinem Partner, damit er die Ergebnisse auch sehen kann!
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

		{#if maybeMatches.length > 0}
			<div class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-amber-200">
				<h2 class="text-xl font-bold mb-1 text-amber-600">Vielleicht besprechen</h2>
				<p class="text-sm text-gray-600 mb-4">
					Bei {maybeMatches.length} {maybeMatches.length === 1 ? 'Frage' : 'Fragen'} hat mindestens einer von euch "Vielleicht" gesagt – eine gute Basis für ein offenes Gespräch.
				</p>
				<div class="space-y-4">
					{#each Array.from(groupedMaybeMatches.entries()) as [category, categoryMatches]}
						<CategorySection category={category} matches={categoryMatches} variant="maybe" />
					{/each}
				</div>
			</div>
		{/if}

		<div class="flex gap-4 justify-center pt-4 flex-wrap">
			<button
				onclick={updateAnswers}
				class="px-8 py-3 bg-white text-purple-600 font-semibold rounded-xl shadow-md border-2 border-purple-300 hover:border-purple-500 hover:shadow-lg transition-all duration-200"
			>
				Meine Antworten aktualisieren
			</button>
			<button
				onclick={() => { changingPartnerCode = !changingPartnerCode; }}
				class="px-8 py-3 bg-white text-gray-500 font-semibold rounded-xl shadow-md border-2 border-gray-200 hover:border-gray-400 hover:text-gray-700 transition-all duration-200"
			>
				Partner-Code ändern
			</button>
		</div>
		{#if changingPartnerCode}
			<div class="max-w-md mx-auto">
				<PartnerCodeInput onSuccess={handlePartnerCode} />
			</div>
		{/if}

		<div class="bg-green-50 border border-green-200 rounded-xl p-6">
			<div class="flex gap-3">
				<svg class="w-6 h-6 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
				</svg>
				<div class="text-sm text-green-800">
					<p class="font-semibold mb-1">Was nun?</p>
					<p>Das sind Dinge, für die ihr beide Interesse gezeigt habt! Führt ein offenes Gespräch und entscheidet gemeinsam, was ihr erkunden möchtet.</p>
				</div>
			</div>
		</div>
	{/if}
</div>
