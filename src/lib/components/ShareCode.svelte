<script lang="ts">
	import { t } from '$lib/i18n';

	interface Props {
		code: string;
	}

	const { code }: Props = $props();
	let copied = $state(false);

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
					alert('Copy failed. Please manually select and copy the code.');
				} finally {
					textArea.remove();
				}
			}
		} catch (err) {
			console.error('Failed to copy:', err);
			const input = document.querySelector('input[readonly]') as HTMLInputElement;
			if (input) {
				input.select();
				alert('Please press Ctrl+C (or Cmd+C) to copy');
			}
		}
	}
</script>

<div class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-pink-100">
	<h3 class="text-lg font-semibold mb-3 text-gray-800">{$t.shareCode.heading}</h3>
	<div class="flex gap-3">
		<input
			type="text"
			readonly
			value={code}
			class="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg font-mono text-sm"
		/>
		<button
			onclick={copyToClipboard}
			class="px-6 py-3 {copied ? 'bg-green-500' : 'bg-purple-600'} text-white font-semibold rounded-lg hover:shadow-md transition-all duration-200"
		>
			{copied ? $t.shareCode.copied : $t.shareCode.copy}
		</button>
	</div>
	<p class="text-sm text-gray-600 mt-3">
		{$t.shareCode.helpText}
	</p>
</div>
