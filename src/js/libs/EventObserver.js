
/* eslint-disable no-console */

// throttle event
const throttle = (interval = 256) => {
	let lastCalled = Date.now();
	let debounceTimer = null;
	const debounceDelay = 16;

	return (callback) => {
		const lag = lastCalled + interval - Date.now();
		if (lag < 0) {
			//console.log( lastCalled + "：throttle：" + lag);
			callback();
			lastCalled = Date.now();
		} else {
			clearTimeout(debounceTimer);
			debounceTimer = setTimeout(function() {
				callback();
			}, (interval - lag + debounceDelay));
		}
	}
};


class EventObserver {
	constructor (evName, evTarget = document, argHandler) {
		this.handlers = {};
		this.evName = evName;
		argHandler = argHandler || null;
		this.argHandler = argHandler;

		this.throttle = throttle();

		evTarget.addEventListener(evName, this.onTick.bind(this, argHandler));
	}
	fire () {
    this.throttle(() => {
      this.onTick.bind(this, this.argHandler);
    });
	}
	onTick (arg1, arg2) {
		const {event, eventHandler} = (() => {
			if (arg2) {
        return {
          event        : arg2,
          eventHandler : arg1,
				};
			} else {
				return {
          event : arg1,
				};
			}
		})();
    requestAnimationFrame(() => {
			if (eventHandler) {
				Object.keys(this.handlers).forEach((ID) => {
					this.handlers[ID](eventHandler(), event);
				});
			} else {
				Object.keys(this.handlers).forEach((ID) => {
					this.handlers[ID](event);
				});
			}
		});
	}
	addHandler (func, ID) {
		this.handlers[ID] = func;
	}
	removeHandler (ID) {
		delete this.handlers[ID];
	}
}

export default EventObserver;
