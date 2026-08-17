<script lang="ts">
	import CategorySection from '$lib/components/CategorySection.svelte';
	import type { PageData } from './$types';
	import type { MatchedQuestion } from '$lib/types';

	const { data }: { data: PageData } = $props();
</script>

<div class="max-w-2xl mx-auto space-y-6">
	<div class="text-center space-y-2">
		<h1 class="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
			Eure Matches
		</h1>
	</div>

	{#if !data.hasPartner || data.partnerNotConnected}
		{#if data.partnerNotConnected}
			<div class="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 text-center space-y-3">
				<p class="text-yellow-800 font-medium">Warte auf deinen Partner</p>
				<p class="text-yellow-700 text-sm">
					Du bist verbunden, aber dein Partner hat sich noch nicht mit dir verbunden. Sobald er deinen Code eingibt, werden eure Matches hier angezeigt.
				</p>
			</div>
		{:else}
		<div class="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center space-y-3">
			<p class="text-blue-800 font-medium">Noch kein Partner verbunden</p>
			<p class="text-blue-700 text-sm">
				Verbinde dich mit deinem Partner in den Einstellungen, um eure Matches zu sehen.
			</p>
			<a
				href="/einstellungen"
				class="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-2 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
			>
				Zu den Einstellungen
			</a>
		</div>
		{/if}
	{:else if data.matches.length === 0 && data.maybeMatches.length === 0}
		<div class="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-pink-100 text-center space-y-4">
			<div class="text-5xl">💬</div>
			<h2 class="text-xl font-semibold text-gray-800">Noch keine Matches</h2>
			<p class="text-gray-600 text-sm">
				Beantwortet mehr Fragen – eure gemeinsamen Antworten erscheinen hier.
			</p>
			<a href="/fragen" class="inline-block text-pink-600 font-medium hover:underline">
				Weiter zu den Fragen →
			</a>
		</div>
	{:else}
		{#if data.matches.length > 0}
			<div class="space-y-1">
				<h2 class="text-lg font-semibold text-gray-700 px-1">
					{data.matches.length} gemeinsame {data.matches.length === 1 ? 'Übereinstimmung' : 'Übereinstimmungen'}
				</h2>
				<div class="space-y-4">
					{#each data.groupedMatches as [category, matches] (category)}
						<CategorySection {category} matches={matches as MatchedQuestion[]} variant="yes" />
					{/each}
				</div>
			</div>
		{/if}

		{#if data.maybeMatches.length > 0}
			<div class="space-y-1">
				<h2 class="text-lg font-semibold text-gray-700 px-1">Gesprächsthemen</h2>
				<div class="space-y-4">
					{#each data.groupedMaybeMatches as [category, matches] (category)}
						<CategorySection {category} matches={matches as MatchedQuestion[]} variant="maybe" />
					{/each}
				</div>
			</div>
		{/if}

		<div class="text-center">
			<a href="/fragen" class="text-sm text-gray-500 hover:text-pink-600 transition-colors">
				Mehr Fragen beantworten →
			</a>
		</div>
	{/if}
</div>
