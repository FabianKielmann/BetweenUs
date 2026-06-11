<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { createSession, loadSession } from '$lib/utils/session';
	import { questions } from '$lib/data/questions';

	let sessionProgress = $state(0);
	let sessionIsComplete = $state(false);
	let showConfirm = $state(false);

	onMount(() => {
		const session = loadSession();
		if (session) {
			sessionProgress = session.answers.length;
			sessionIsComplete = !!session.myCode;
		}
	});

	function startNew() {
		if (sessionProgress > 0 && !showConfirm) {
			showConfirm = true;
			return;
		}
		showConfirm = false;
		createSession();
		goto('/questionnaire');
	}

	function continueSession() {
		goto('/questionnaire');
	}

	function viewResults() {
		goto('/results');
	}

	function joinPartner() {
		goto('/join');
	}
</script>

<div class="max-w-2xl mx-auto text-center space-y-8">
	<div class="space-y-4">
		<h1 class="text-5xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent pb-2">
			Gemeinsam entdecken
		</h1>
		<p class="text-xl text-gray-700">
			Ein privater Weg für Paare, ihre Intimwünsche zu erkunden
		</p>
	</div>

	<div class="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-pink-100">
		<h2 class="text-2xl font-semibold mb-4 text-gray-800">So funktioniert es</h2>
		<div class="space-y-4 text-left">
			<div class="flex gap-4">
				<div class="flex-shrink-0 w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold">1</div>
				<div>
					<h3 class="font-semibold text-gray-800">Fragen beantworten</h3>
					<p class="text-gray-600">Beantworte Fragen zu deinen Vorlieben und Wünschen – ganz privat</p>
				</div>
			</div>
			<div class="flex gap-4">
				<div class="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold">2</div>
				<div>
					<h3 class="font-semibold text-gray-800">Code teilen</h3>
					<p class="text-gray-600">Erhalte einen einzigartigen Code, den du mit deinem Partner teilst</p>
				</div>
			</div>
			<div class="flex gap-4">
				<div class="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold">3</div>
				<div>
					<h3 class="font-semibold text-gray-800">Übereinstimmungen entdecken</h3>
					<p class="text-gray-600">Sieh nur, wozu ihr beide "Ja" gesagt habt – keine peinlichen Momente!</p>
				</div>
			</div>
		</div>
	</div>

	<div class="space-y-4">
		{#if sessionIsComplete}
			<button
				onclick={viewResults}
				class="w-full max-w-md mx-auto block bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
			>
				Ergebnisse anzeigen
			</button>
		{:else if sessionProgress > 0}
			<button
				onclick={continueSession}
				class="w-full max-w-md mx-auto block bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
			>
				Weiter machen ({sessionProgress} / {questions.length})
			</button>
		{/if}

		{#if sessionProgress > 0}
			{#if showConfirm}
				<div class="w-full max-w-md mx-auto bg-amber-50 border border-amber-300 rounded-xl p-4 text-sm text-amber-900 space-y-3">
					<p>Bist du sicher? Dein bisheriger Fortschritt ({sessionProgress} von {questions.length} Fragen) geht verloren.</p>
					<div class="flex gap-3">
						<button
							onclick={startNew}
							class="flex-1 bg-amber-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-amber-600 transition-colors"
						>
							Ja, neu starten
						</button>
						<button
							onclick={() => { showConfirm = false; }}
							class="flex-1 bg-white text-amber-800 font-semibold py-2 px-4 rounded-lg border border-amber-300 hover:bg-amber-100 transition-colors"
						>
							Abbrechen
						</button>
					</div>
				</div>
			{:else}
				<button
					onclick={startNew}
					class="w-full max-w-md mx-auto block bg-white text-gray-500 font-semibold py-3 px-8 rounded-xl border border-gray-200 hover:border-gray-400 hover:text-gray-700 transition-all duration-200 text-sm"
				>
					Neue Sitzung starten
				</button>
			{/if}
		{:else}
			<button
				onclick={startNew}
				class="w-full max-w-md mx-auto block bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
			>
				Neue Sitzung starten
			</button>
		{/if}

		<button
			onclick={joinPartner}
			class="w-full max-w-md mx-auto block bg-white text-purple-600 font-semibold py-4 px-8 rounded-xl shadow-md border-2 border-purple-300 hover:border-purple-500 hover:shadow-lg transition-all duration-200"
		>
			Partner beitreten
		</button>
	</div>

	<div class="text-sm text-gray-500 space-y-2">
		<p class="flex items-center justify-center gap-2">
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
			</svg>
			100% privat – Antworten nur auf deinem Gerät gespeichert
		</p>
		<p>Keine Konten. Keine Datenbank. Kein Tracking.</p>
	</div>
</div>
