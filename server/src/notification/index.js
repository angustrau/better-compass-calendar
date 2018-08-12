"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const push = require("./../push");
const subscriptions = require("./../subscriptions");
const location = require("./../location");
const user = require("./../user");
const config = require("./../../config");
const url_1 = require("url");
/**
 * Send out notifications that an event has changed
 * @param event
 */
exports.notifyEventUpdate = async (event) => {
    // Format date and times as strings
    const date = event.startTime.toLocaleString('en-au', { day: '2-digit', month: 'long' });
    const startTime = event.startTime.toLocaleString('en-au', { hour: '2-digit', minute: '2-digit' });
    const endTime = event.endTime.toLocaleString('en-au', { hour: '2-digit', minute: '2-digit' });
    // Get location and manager
    const l = await location.getLocation(event.locationId || 0);
    const m = await user.getDetails(event.managerId);
    // Construct the push payload
    const pushMessage = {
        title: 'Event updated: ' + event.title,
        body: `${date} ${startTime} – ${endTime}\n${l.shortName} – ${m.fullName}`,
        url: new url_1.URL('/e/' + event.id, config.hostname).href
    };
    // Send a push notification to each subscribed user sequentially
    const promiseChain = Promise.resolve();
    const users = await subscriptions.getSubscribedUsers({ id: event.activityId });
    users.forEach((user) => {
        promiseChain.then(() => push.pushMessage(user, pushMessage));
    });
    await promiseChain;
};
//# sourceMappingURL=index.js.map