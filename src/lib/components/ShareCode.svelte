<script lang="ts">
	import { onMount } from 'svelte';
	import QRCode from 'qrcode';

	interface Props {
		code: string;
		standalone?: boolean;
	}

	const { code, standalone = true }: Props = $props();
	let copied = $state(false);
	let copiedLink = $state(false);
	let canvasEl = $state<HTMLCanvasElement | null>(null);
	let mounted = $state(false);

	onMount(() => {
		mounted = true;
	});

	$effect(() => {
		if (mounted && canvasEl) {
			const joinUrl = `${window.location.origin}/join?code=${encodeURIComponent(code)}`;
			QRCode.toCanvas(canvasEl, joinUrl, { width: 200, margin: 2 });
		}
	});

	async function copyToClipboard() {
		try {
			if (navigator.clipboard && navigator.clipboard.writeText) {
				await navigator.clipboard.writeText(code);
				copied = true;
				setTimeout(() => { copied = false; }, 2000);
			} else {
				const textArea = document.createElement('textarea');
				textArea.value = code;
				textArea.style.position = 'fixed';
				textArea.style.left = '-999999px';
				textArea.style.top = '-999999px';
				document.body.appendChild(textArea);
				textArea.focus();
				textArea.select();
				try {
					document.execCommand('copy');
					copied = true;
					setTimeout(() => { copied = false; }, 2000);
				} catch (err) {
					console.error('Fallback copy failed:', err);
					alert('Kopieren fehlgeschlagen. Bitte den Code manuell auswählen und kopieren.');
				} finally {
					textArea.remove();
				}
			}
		} catch (err) {
			console.error('Failed to copy:', err);
			const input = document.querySelector('input[readonly]') as HTMLInputElement;
			if (input) {
				input.select();
				alert('Bitte Strg+C (oder Cmd+C) drücken, um zu kopieren');
			}
		}
	}

	async function copyLink() {
		const link = `${window.location.origin}/join?code=${encodeURIComponent(code)}`;
		try {
			if (navigator.clipboard && navigator.clipboard.writeText) {
				await navigator.clipboard.writeText(link);
			} else {
				const textArea = document.createElement('textarea');
				textArea.value = link;
				textArea.style.position = 'fixed';
				textArea.style.left = '-999999px';
				textArea.style.top = '-999999px';
				document.body.appendChild(textArea);
				textArea.focus();
				textArea.select();
				document.execCommand('copy');
				textArea.remove();
			}
			copiedLink = true;
			setTimeout(() => { copiedLink = false; }, 2000);
		} catch (err) {
			console.error('Failed to copy link:', err);
		}
	}
</script>

<div class={standalone ? 'bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-pink-100' : ''}>
	{#if standalone}
		<h3 class="text-lg font-semibold mb-3 text-gray-800">Teile diesen Code mit deinem Partner</h3>
	{/if}
	<div class="flex flex-col sm:flex-row gap-2 min-w-0">
		<input
			type="text"
			readonly
			value={code}
			class="min-w-0 flex-1 px-3 py-3 bg-gray-50 border border-gray-300 rounded-lg font-mono text-sm truncate"
		/>
		<button
			onclick={copyToClipboard}
			class="w-full sm:w-auto px-4 py-3 {copied ? 'bg-green-500' : 'bg-purple-600'} text-white font-semibold rounded-lg hover:shadow-md transition-all duration-200"
		>
			{copied ? '✓ Kopiert!' : 'Kopieren'}
		</button>
	</div>
	<div class="mt-3">
		<button
			onclick={copyLink}
			class="w-full flex items-center justify-center gap-2 px-4 py-2 {copiedLink ? 'bg-green-50 border-green-300 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'} border rounded-lg text-sm font-medium transition-all duration-200"
		>
			{#if copiedLink}
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
				</svg>
				Link kopiert!
			{:else}
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
				</svg>
				Link kopieren
			{/if}
		</button>
	</div>

	{#if mounted}
		<div class="mt-4 flex flex-col items-center gap-2">
			<p class="text-xs text-gray-500">oder QR-Code scannen</p>
			<canvas bind:this={canvasEl} class="rounded-lg"></canvas>
		</div>
	{/if}

	{#if standalone}
		<p class="text-sm text-gray-600 mt-3">
			Dein Partner gibt diesen Code ein, um die Fragen zu beantworten – dann seht ihr beide eure Übereinstimmungen!
		</p>
	{/if}
</div>
