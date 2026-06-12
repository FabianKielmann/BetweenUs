<script lang="ts">
	import '../app.css';
	const { children } = $props();
</script>

<div class="min-h-screen flex flex-col bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
	<header class="bg-white/80 backdrop-blur-sm border-b border-pink-200 sticky top-0 z-10">
		<div class="container mx-auto px-4 py-4">
			<a href="/" class="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
				BetweenUs
			</a>
		</div>
	</header>

	<main class="flex-1 container mx-auto px-4 py-8">
		{@render children()}
	</main>

	<footer class="bg-white/80 backdrop-blur-sm border-t border-pink-200 py-4">
		<div class="container mx-auto px-4 text-center text-sm text-gray-600">
			Mit Datenschutz im Sinn entwickelt. Deine Antworten werden nur lokal gespeichert. · v{__APP_VERSION__}
		</div>
	</footer>
</div>
