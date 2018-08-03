/* tslint:disable */

self.addEventListener('push', (e) => {
    if (!e.data) {
        return;
    }
    const data = e.data.json();

    const options = {
        icon: '/logo-blue.png',
        body: data.body,
        data: {
            url: data.url
        }
    }

    const promiseChain = self.registration.showNotification(data.title, options);

    e.waitUntil(promiseChain);
});

self.addEventListener('notificationclick', (e) => {
    const notification = e.notification;
    const data = notification.data || {};
    notification.close();
    
    if (data.url) {
        e.waitUntil(clients.openWindow(data.url));
    }
});