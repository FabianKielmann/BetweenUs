<script lang="ts">
	import type { MatchedQuestion } from '$lib/types';

	interface Props {
		category: string;
		matches: MatchedQuestion[];
		variant?: 'yes' | 'maybe';
	}

	const { category, matches, variant = 'yes' }: Props = $props();
</script>

<div class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-pink-100">
	<h3 class="text-xl font-semibold mb-4 text-purple-600">{category}</h3>
	<ul class="space-y-3">
		{#each matches as match}
			<li class="flex items-start gap-3">
				{#if variant === 'maybe'}
					<svg class="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01"></path>
						<circle cx="12" cy="12" r="10" stroke-width="2"></circle>
					</svg>
				{:else}
					<svg class="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
					</svg>
				{/if}
				<span class="text-gray-800">{match.text}</span>
			</li>
		{/each}
	</ul>
</div>
