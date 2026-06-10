<script lang="ts">
	import '../app.css';
	import { t, locale, localeNames } from '$lib/i18n';
	import type { Locale } from '$lib/i18n';
	const { children } = $props();
</script>

<div class="min-h-screen flex flex-col bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
	<header class="bg-white/80 backdrop-blur-sm border-b border-pink-200 sticky top-0 z-10">
		<div class="container mx-auto px-4 py-4 flex items-center justify-between">
			<a href="/" class="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
				BetweenUs
			</a>
			<div class="flex gap-1">
				{#each Object.entries(localeNames) as [code, label]}
					<button
						onclick={() => locale.set(code as Locale)}
						class="px-3 py-1 text-sm font-semibold rounded-lg transition-all duration-200 {$locale === code
							? 'bg-purple-600 text-white'
							: 'text-gray-500 hover:text-purple-600 hover:bg-purple-50'}"
					>
						{label}
					</button>
				{/each}
			</div>
		</div>
	</header>

	<main class="flex-1 container mx-auto px-4 py-8">
		{@render children()}
	</main>

	<footer class="bg-white/80 backdrop-blur-sm border-t border-pink-200 py-4">
		<div class="container mx-auto px-4 text-center text-sm text-gray-600">
			{$t.layout.footer}
		</div>
	</footer>
</div>
