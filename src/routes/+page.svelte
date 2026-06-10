<script lang="ts">
	import { goto } from '$app/navigation';
	import { createSession } from '$lib/utils/session';

	function startNew() {
		createSession();
		goto('/questionnaire');
	}

	function joinPartner() {
		goto('/join');
	}
</script>

<div class="max-w-2xl mx-auto text-center space-y-8">
	<div class="space-y-4">
		<h1 class="text-5xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent pb-2">
			Discover Together
		</h1>
		<p class="text-xl text-gray-700">
			A private way for couples to explore their intimacy preferences
		</p>
	</div>

	<div class="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-pink-100">
		<h2 class="text-2xl font-semibold mb-4 text-gray-800">How it works</h2>
		<div class="space-y-4 text-left">
			<div class="flex gap-4">
				<div class="flex-shrink-0 w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold">1</div>
				<div>
					<h3 class="font-semibold text-gray-800">Answer Questions</h3>
					<p class="text-gray-600">Privately answer questions about your preferences and desires</p>
				</div>
			</div>
			<div class="flex gap-4">
				<div class="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold">2</div>
				<div>
					<h3 class="font-semibold text-gray-800">Share Your Code</h3>
					<p class="text-gray-600">Get a unique code to share with your partner</p>
				</div>
			</div>
			<div class="flex gap-4">
				<div class="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold">3</div>
				<div>
					<h3 class="font-semibold text-gray-800">Discover Matches</h3>
					<p class="text-gray-600">See only what you both said "yes" to - no awkward moments!</p>
				</div>
			</div>
		</div>
	</div>

	<div class="space-y-4">
		<button
			onclick={startNew}
			class="w-full max-w-md mx-auto block bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
		>
			Start New Session
		</button>
		<button
			onclick={joinPartner}
			class="w-full max-w-md mx-auto block bg-white text-purple-600 font-semibold py-4 px-8 rounded-xl shadow-md border-2 border-purple-300 hover:border-purple-500 hover:shadow-lg transition-all duration-200"
		>
			Join Partner
		</button>
	</div>

	<div class="text-sm text-gray-500 space-y-2">
		<p class="flex items-center justify-center gap-2">
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
			</svg>
			100% private - answers stored only on your device
		</p>
		<p>No accounts. No database. No tracking.</p>
	</div>
</div>
