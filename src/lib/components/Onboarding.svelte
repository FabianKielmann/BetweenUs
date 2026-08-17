<script lang="ts">
	import { invalidateAll } from '$app/navigation';

	const { shareCode, userId }: { shareCode: string; userId: string } = $props();

	let step = $state(0);
	let copiedRecovery = $state(false);

	const steps = [
		{ title: 'Willkommen bei BetweenUs' },
		{ title: 'Dein Code' },
		{ title: 'Konto sichern' }
	];

	const recoveryUrl = $derived(`${typeof window !== 'undefined' ? window.location.origin : ''}/recover/${userId}`);

	async function finish() {
		await fetch('/api/onboarding/done', { method: 'POST' });
		await invalidateAll();
	}

	async function copyRecoveryLink() {
		try {
			await navigator.clipboard.writeText(recoveryUrl);
			copiedRecovery = true;
			setTimeout(() => (copiedRecovery = false), 2000);
		} catch {
			// Clipboard API not available (HTTP non-localhost) — user can copy the displayed URL manually
		}
	}
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
	<div class="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
		<!-- Step indicator -->
		<div class="flex gap-1.5 px-6 pt-6">
			{#each steps as _, i}
				<div class="h-1 flex-1 rounded-full transition-colors duration-300 {i <= step ? 'bg-gradient-to-r from-pink-500 to-purple-600' : 'bg-gray-200'}"></div>
			{/each}
		</div>

		<div class="p-6 space-y-4">
			{#if step === 0}
				<div class="text-center space-y-3">
					<div class="text-5xl">💑</div>
					<h2 class="text-2xl font-bold text-gray-900">Willkommen bei BetweenUs</h2>
					<p class="text-gray-600">
						BetweenUs ist eine App für Paare. Ihr beantwortet intime Fragen unabhängig voneinander — nur Antworten, bei denen ihr beide zustimmt, werden euch als Match angezeigt.
					</p>
					<p class="text-gray-600">
						Niemand sieht, was der andere geantwortet hat — außer bei einem gegenseitigen Match.
					</p>
				</div>

			{:else if step === 1}
				<div class="space-y-4">
					<h2 class="text-2xl font-bold text-gray-900">Dein Code</h2>
					<p class="text-gray-600">
						Jeder Nutzer hat einen einzigartigen Code. Teile deinen Code mit deinem Partner — so kann er sich mit dir verbinden.
					</p>
					<div class="bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-200 rounded-2xl p-4 text-center space-y-2">
						<p class="text-xs text-gray-500 uppercase tracking-wide font-medium">Dein Code</p>
						<p class="text-2xl font-bold text-gray-900">{shareCode}</p>
					</div>
					<p class="text-sm text-gray-500">
						Du findest deinen Code jederzeit unter <strong>Einstellungen</strong>.
					</p>
				</div>

			{:else if step === 2}
				<div class="space-y-4">
					<h2 class="text-2xl font-bold text-gray-900">Konto sichern</h2>
					<p class="text-gray-600">
						Dein Konto ist anonym und an dieses Gerät gebunden. Wenn du ein neues Gerät benutzt, brauchst du diesen Backup-Link, um deine Daten wiederherzustellen.
					</p>
					<p class="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
						Speichere den Link als Lesezeichen oder Screenshot. Teile ihn nicht mit anderen.
					</p>
					<div class="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 break-all text-xs text-gray-600 select-all">
						{recoveryUrl}
					</div>
					<button
						onclick={copyRecoveryLink}
						class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 {copiedRecovery
							? 'bg-green-500 text-white'
							: 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-md'}"
					>
						{copiedRecovery ? 'Link kopiert!' : 'Link kopieren'}
					</button>
				</div>
			{/if}
		</div>

		<!-- Navigation -->
		<div class="px-6 pb-6 flex gap-3">
			{#if step > 0}
				<button
					onclick={() => step--}
					class="flex-1 py-3 rounded-xl font-semibold text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
				>
					Zurück
				</button>
			{/if}
			{#if step < steps.length - 1}
				<button
					onclick={() => step++}
					class="flex-1 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-md transition-all duration-200"
				>
					Weiter
				</button>
			{:else}
				<button
					onclick={finish}
					class="flex-1 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-md transition-all duration-200"
				>
					Los geht's
				</button>
			{/if}
		</div>
	</div>
</div>
