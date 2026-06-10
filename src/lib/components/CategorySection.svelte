<script lang="ts">
	import type { MatchedQuestion } from '$lib/types';

	interface Props {
		category: string;
		matches: MatchedQuestion[];
	}

	const { category, matches }: Props = $props();
</script>

<div class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-pink-100">
	<h3 class="text-xl font-semibold mb-4 text-purple-600">{category}</h3>
	<ul class="space-y-3">
		{#each matches as match}
			<li class="flex items-start gap-3">
				<svg class="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
				</svg>
				<span class="text-gray-800">{match.text}</span>
			</li>
		{/each}
	</ul>
</div>
