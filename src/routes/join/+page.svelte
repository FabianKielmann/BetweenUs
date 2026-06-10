<script lang="ts">
	import { goto } from '$app/navigation';
	import { decodeShareCode } from '$lib/utils/encoding';
	import { createSession, savePartnerData, savePartnerCodeToSession } from '$lib/utils/session';

	let code = $state('');
	let error = $state('');

	function handleSubmit() {
		error = '';

		if (!code.trim()) {
			error = 'Bitte gib einen Code ein';
			return;
		}

		const decoded = decodeShareCode(code.trim());
		if (!decoded) {
			error = 'Ungültiger Code. Bitte überprüfe ihn und versuche es erneut.';
			return;
		}

		savePartnerData(decoded);
		createSession();
		savePartnerCodeToSession(code.trim());
		goto('/questionnaire');
	}
</script>

<div class="max-w-2xl mx-auto">
	<div class="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-pink-100 space-y-6">
		<div class="text-center space-y-2">
			<h1 class="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
				Partner beitreten
			</h1>
			<p class="text-gray-700">Gib den Code ein, den dein Partner mit dir geteilt hat</p>
		</div>

		<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-4">
			<div>
				<label for="code" class="block text-sm font-medium text-gray-700 mb-2">
					Code des Partners
				</label>
				<input
					id="code"
					type="text"
					bind:value={code}
					placeholder="Code hier eingeben..."
					class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono"
					autocomplete="off"
				/>
				{#if error}
					<p class="mt-2 text-sm text-red-600">{error}</p>
				{/if}
			</div>

			<button
				type="submit"
				class="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
			>
				Weiter zu den Fragen
			</button>
		</form>

		<div class="pt-4 border-t border-gray-200">
			<a href="/" class="text-sm text-purple-600 hover:text-purple-700 flex items-center justify-center gap-2">
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
				</svg>
				Zurück zur Startseite
			</a>
		</div>
	</div>

	<div class="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
		<div class="flex gap-3">
			<svg class="w-6 h-6 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
			</svg>
			<div class="text-sm text-blue-800">
				<p class="font-semibold mb-1">Was passiert als Nächstes?</p>
				<ul class="space-y-1 list-disc list-inside">
					<li>Du beantwortest dieselben Fragen</li>
					<li>Du erhältst DEINEN eigenen Code zum Zurückteilen</li>
					<li>Sobald ihr beide Codes getauscht habt, seht ihr eure Übereinstimmungen</li>
				</ul>
				<p class="mt-2 font-semibold">Dieser beidseitige Austausch gewährleistet vollständige Privatsphäre!</p>
			</div>
		</div>
	</div>
</div>
