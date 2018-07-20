// Based on example code from https://developer.mozilla.org/en-US/docs/Web/API/EventTarget
export default class CustomEventTarget {
	private listeners: {[type: string]: any[]}

	constructor() {
		this.listeners = {};
	}

	public addEventListener(type: string, callback: () => void) {
		if (!(type in this.listeners)) {
			this.listeners[type] = [];
		}
		this.listeners[type].push(callback);
	}

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

	public dispatchEvent(event: Event) {
		if (!(event.type in this.listeners)) {
			return true;
		}
		const stack = this.listeners[event.type].slice();
	
		for (let i = 0, l = stack.length; i < l; i++) {
			stack[i].call(this, event);
		}
		return !event.defaultPrevented;
	};
	
}