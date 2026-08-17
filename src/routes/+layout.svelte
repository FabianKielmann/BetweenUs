<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import Onboarding from '$lib/components/Onboarding.svelte';

	const { data, children } = $props();

	onMount(() => {
		const stored = localStorage.getItem('bu_uid');
		if (!stored) {
			localStorage.setItem('bu_uid', data.userId);
		} else if (stored !== data.userId) {
			fetch('/api/identity/recover', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ storedId: stored })
			})
				.then((r) => r.json())
				.then((result) => {
					if (result.recovered) {
						localStorage.setItem('bu_uid', result.userId);
						window.location.reload();
					} else {
						localStorage.setItem('bu_uid', data.userId);
					}
				});
		}
	});

	const navItems = [
		{ href: '/fragen', label: 'Fragen', icon: 'question' },
		{ href: '/matches', label: 'Matches', icon: 'heart' },
		{ href: '/einstellungen', label: 'Einstellungen', icon: 'settings' }
	];
</script>

{#if data.showOnboarding}
	<Onboarding shareCode={data.shareCode} userId={data.userId} />
{/if}

<div class="min-h-screen flex flex-col bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 pb-16 sm:pb-0">
	<header class="bg-white/80 backdrop-blur-sm border-b border-pink-200 sticky top-0 z-10">
		<div class="container mx-auto px-4 py-4 flex items-center justify-between">
			<a href="/fragen" class="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
				BetweenUs
			</a>
			<nav class="hidden sm:flex gap-1">
				{#each navItems as item}
					<a
						href={item.href}
						class="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 {page.url.pathname.startsWith(item.href)
							? 'bg-pink-100 text-pink-700'
							: 'text-gray-600 hover:bg-gray-100'}"
					>
						{item.label}
					</a>
				{/each}
			</nav>
		</div>
	</header>

	<main class="flex-1 container mx-auto px-4 py-8">
		{@render children()}
	</main>

	<!-- Mobile bottom nav -->
	<nav class="sm:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-pink-200 z-10">
		<div class="flex">
			{#each navItems as item}
				<a
					href={item.href}
					class="flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors duration-150 {page.url.pathname.startsWith(item.href)
						? 'text-pink-600'
						: 'text-gray-500'}"
				>
					{#if item.icon === 'question'}
						<svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<circle cx="12" cy="12" r="10" />
							<path stroke-linecap="round" stroke-linejoin="round" d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
							<path stroke-linecap="round" stroke-linejoin="round" d="M12 17h.01" />
						</svg>
					{:else if item.icon === 'heart'}
						<svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
						</svg>
					{:else}
						<svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
							<circle cx="12" cy="12" r="3" />
						</svg>
					{/if}
					{item.label}
				</a>
			{/each}
		</div>
	</nav>

	<footer class="hidden sm:block bg-white/80 backdrop-blur-sm border-t border-pink-200 py-4">
		<div class="container mx-auto px-4 text-center text-sm text-gray-600">
			Mit Datenschutz im Sinn entwickelt. · v{__APP_VERSION__}
		</div>
	</footer>
</div>
