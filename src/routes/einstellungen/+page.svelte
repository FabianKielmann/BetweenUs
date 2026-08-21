<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { PUBLIC_VAPID_PUBLIC_KEY } from '$env/static/public';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();

	let copied = $state(false);
	let copiedRecovery = $state(false);
	let connectError = $state('');
	let pushLoading = $state(false);
	let showRecovery = $state(false);

	function copyShareCode() {
		navigator.clipboard.writeText(data.shareCode);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}

	async function copyRecoveryLink() {
		try {
			await navigator.clipboard.writeText(`${window.location.origin}/recover/${data.userId}`);
			copiedRecovery = true;
			setTimeout(() => (copiedRecovery = false), 2000);
		} catch {
			// Clipboard API not available on HTTP (non-localhost)
		}
	}

	function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
		const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
		const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
		const rawData = atob(base64);
		return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0))) as Uint8Array<ArrayBuffer>;
	}

	async function enablePushNotifications() {
		if (!('Notification' in window) || !('serviceWorker' in navigator)) return;
		pushLoading = true;
		try {
			const permission = await Notification.requestPermission();
			if (permission !== 'granted') return;
			const reg = await navigator.serviceWorker.ready;
			const sub = await reg.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_PUBLIC_KEY)
			});
			const json = sub.toJSON();
			await fetch('/api/push/subscribe', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					endpoint: json.endpoint,
					p256dh: json.keys!.p256dh,
					auth: json.keys!.auth
				})
			});
			await invalidateAll();
		} finally {
			pushLoading = false;
		}
	}

	async function disablePushNotifications() {
		pushLoading = true;
		try {
			const reg = await navigator.serviceWorker.ready;
			const sub = await reg.pushManager.getSubscription();
			if (sub) await sub.unsubscribe();
			await fetch('/api/push/subscribe', { method: 'DELETE' });
			await invalidateAll();
		} finally {
			pushLoading = false;
		}
	}
</script>

<div class="max-w-xl mx-auto space-y-6">
	<h1 class="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent text-center">
		Einstellungen
	</h1>

	<!-- Your code -->
	<div class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-pink-100 space-y-4">
		<h2 class="text-lg font-semibold text-gray-800">Dein Code</h2>
		<p class="text-sm text-gray-600">
			Teile diesen Code mit deinem Partner, damit er sich mit dir verbinden kann.
		</p>
		<div class="flex flex-col sm:flex-row gap-2">
			<input
				type="text"
				readonly
				value={data.shareCode}
				class="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-700 select-all text-base"
			/>
			<button
				onclick={copyShareCode}
				class="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 {copied
					? 'bg-green-500 text-white'
					: 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-md'}"
			>
				{copied ? 'Kopiert!' : 'Kopieren'}
			</button>
		</div>
	</div>

	<!-- Partner connection -->
	<div class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-pink-100 space-y-4">
		<h2 class="text-lg font-semibold text-gray-800">Partner</h2>

		{#if data.hasPartner}
			<div class="space-y-3">
				<div class="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
					<svg class="size-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
					</svg>
					Verbunden
				</div>
				{#if data.partnerShareCode}
					<p class="text-sm text-gray-500">Code deines Partners: <span class="font-medium text-gray-700">{data.partnerShareCode}</span></p>
				{/if}
				<form method="POST" action="?/disconnectPartner" use:enhance>
					<button
						type="submit"
						class="text-sm text-red-600 hover:text-red-700 font-medium"
					>
						Verbindung trennen
					</button>
				</form>
			</div>
		{:else}
			<p class="text-sm text-gray-600">
				Gib den Code deines Partners ein, um eure Antworten zu vergleichen.
			</p>
			<form
				method="POST"
				action="?/connectPartner"
				use:enhance={({ formData }) => {
					connectError = '';
					return async ({ result, update }) => {
						if (result.type === 'failure') {
							connectError = (result.data as { error: string }).error;
						} else {
							await update();
						}
					};
				}}
				class="space-y-3"
			>
				<div class="flex flex-col sm:flex-row gap-2">
					<input
						type="text"
						name="partnerCode"
						placeholder="z.B. bright-ocean"
						class="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-300 text-base"
					/>
					<button
						type="submit"
						class="px-5 py-2 rounded-lg font-semibold text-sm bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-md transition-all duration-200"
					>
						Verbinden
					</button>
				</div>
				{#if connectError}
					<p class="text-sm text-red-600">{connectError}</p>
				{/if}
			</form>
		{/if}
	</div>

	<!-- Recovery link -->
	<div class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-pink-100 space-y-4">
		<button
			onclick={() => (showRecovery = !showRecovery)}
			class="flex items-center justify-between w-full text-left"
		>
			<h2 class="text-lg font-semibold text-gray-800">Konto sichern</h2>
			<svg
				class="size-5 text-gray-400 transition-transform duration-200 {showRecovery ? 'rotate-180' : ''}"
				fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
			</svg>
		</button>

		{#if showRecovery}
			<p class="text-sm text-gray-600">
				Speichere diesen Link als Lesezeichen oder Screenshot. Falls du ein neues Gerät benutzt und dein Konto verlierst, kannst du diesen Link öffnen, um deine Daten wiederherzustellen.
			</p>
			<p class="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
				Teile diesen Link nicht mit anderen — er gibt Zugriff auf dein Konto.
			</p>
			<div class="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 break-all text-xs text-gray-600 select-all">
				{window.location.origin}/recover/{data.userId}
			</div>
			<button
				onclick={copyRecoveryLink}
				class="w-full py-2.5 rounded-lg font-medium text-sm transition-all duration-200 {copiedRecovery
					? 'bg-green-500 text-white'
					: 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-md'}"
			>
				{copiedRecovery ? 'Link kopiert!' : 'Link kopieren'}
			</button>
		{/if}
	</div>

	<!-- Push notifications -->
	<div class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-pink-100 space-y-4">
		<h2 class="text-lg font-semibold text-gray-800">Benachrichtigungen</h2>
		<p class="text-sm text-gray-600">
			Werde benachrichtigt, wenn dein Partner neue Fragen beantwortet hat, die zu euren Matches beitragen.
		</p>

		{#if data.hasPushSubscription}
			<div class="flex items-center justify-between">
				<span class="text-sm text-green-700 font-medium flex items-center gap-2">
					<svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
					</svg>
					Benachrichtigungen aktiv
				</span>
				<button
					onclick={disablePushNotifications}
					disabled={pushLoading}
					class="text-sm text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
				>
					Deaktivieren
				</button>
			</div>
		{:else}
			<button
				onclick={enablePushNotifications}
				disabled={pushLoading}
				class="w-full py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-md transition-all duration-200 disabled:opacity-50"
			>
				{pushLoading ? 'Wird aktiviert…' : 'Benachrichtigungen aktivieren'}
			</button>
		{/if}
	</div>
</div>
