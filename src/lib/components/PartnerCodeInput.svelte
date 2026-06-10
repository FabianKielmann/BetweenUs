<script lang="ts">
	import { decodeShareCode } from '$lib/utils/encoding';
	import { loadMyCode } from '$lib/utils/session';
	import { t } from '$lib/i18n';

	interface Props {
		onSuccess: (code: string) => void;
	}

	const { onSuccess }: Props = $props();
	let code = $state('');
	let error = $state('');

	function handleSubmit() {
		error = '';

		if (!code.trim()) {
			error = $t.partnerCode.errorEmpty;
			return;
		}

		const myCode = loadMyCode();
		if (myCode && code.trim() === myCode) {
			error = $t.partnerCode.errorOwn;
			return;
		}

		const decoded = decodeShareCode(code.trim());
		if (!decoded) {
			error = $t.partnerCode.errorInvalid;
			return;
		}

		onSuccess(code.trim());
	}
</script>

<div class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-pink-100">
	<h3 class="text-lg font-semibold mb-3 text-gray-800">{$t.partnerCode.heading}</h3>
	<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-4">
		<div class="flex gap-3">
			<input
				type="text"
				bind:value={code}
				placeholder={$t.partnerCode.placeholder}
				class="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
				autocomplete="off"
			/>
			<button
				type="submit"
				class="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-md transition-all duration-200"
			>
				{$t.partnerCode.submit}
			</button>
		</div>
		{#if error}
			<p class="text-sm text-red-600">{error}</p>
		{/if}
	</form>
</div>
