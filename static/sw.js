self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(clients.claim()));

self.addEventListener('push', (event) => {
	if (!event.data) return;
	const data = event.data.json();
	event.waitUntil(
		self.registration.showNotification(data.title, {
			body: data.body,
			icon: '/icon-192.png',
			badge: '/icon-192.png',
			data: { url: data.url ?? '/matches' }
		})
	);
});

self.addEventListener('notificationclick', (event) => {
	event.notification.close();
	event.waitUntil(
		clients.matchAll({ type: 'window' }).then((windowClients) => {
			for (const client of windowClients) {
				if ('focus' in client) return client.focus();
			}
			return clients.openWindow(event.notification.data.url);
		})
	);
});
