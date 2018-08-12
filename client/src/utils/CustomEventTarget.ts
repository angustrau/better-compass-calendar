/**
 * CustomEventTarget
 * Allows the creation of a custom event emitter
 * 
 * Based on example code from https://developer.mozilla.org/en-US/docs/Web/API/EventTarget 
 * Changes
 * - Ported to typescript
 * - Updated to latest javascript standards
 * - Modified functionality to allow "waiting" on all listeners to finsih
 */
export default class CustomEventTarget {
	private listeners: {[type: string]: any[]}

	constructor() {
		this.listeners = {};
	}

	/**
	 * Adds a new listener
	 * @param {string} type The type of event to listen to
	 * @param {() => void} callback The function called when the event is triggered 
	 */
	public addEventListener(type: string, callback: () => void) {
		if (!(type in this.listeners)) {
			this.listeners[type] = [];
		}
		this.listeners[type].push(callback);
	}

	/**
	 * Removes an event listener
	 * @param {string} type The type of event to listen to
	 * @param {() => void} callback The function called when the event is triggered 
	 */
	public removeEventListener(type: any, callback: () => void) {
		if (!(type in this.listeners)) {
			return;
		}
		const stack = this.listeners[type];
		for (let i = 0, l = stack.length; i < l; i++) {
			if (stack[i] === callback){
				stack.splice(i, 1);
				return;
			}
		}
	}

	/**
	 * Sends an event to all event listeners
	 * @param {Event} event The event to dispatch
	 */
	public async dispatchEvent(event: Event) {
		if (!(event.type in this.listeners)) {
			return true;
		}
		const stack = this.listeners[event.type].slice();
	
		await Promise.all(stack.map(handler => handler.call(this, event)));

		return !event.defaultPrevented;
	};
	
}