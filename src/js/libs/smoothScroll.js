'use strict';

import util from './util.js';

export default class SmoothScroll {
  constructor({easing, duration}) {
    this.easing = easing || 'easeInOutCubic';
    this.duration = duration || 1000;
  }

  setAnchorScroll(optionsArg = {}) {
    const anchor = [].slice.call(document.getElementsByTagName('a'));
    const options = {
      offset   : optionsArg.offset || 0,
      duration : optionsArg.duration|| 800,
    };
    anchor.forEach((el) => {
      const href = el.getAttribute('href');
      if (!href || href.charAt(0) !== '#') return;

      // offset値が設定されていたら優先
      const elOptions = Object.assign({}, options);
      const offset = el.getAttribute('data-smoothscroll-offset');
      if (offset) elOptions.offset = parseInt(offset, 10);

      el.addEventListener('click', (e) => {
        e.preventDefault();
        this._anchorScroll(href, elOptions);
      });
    });
  }

  _anchorScroll(href, optionsArg) {
    this.scroll(href, optionsArg);
  }

  scroll(target, options = {}) {
    this.start = util.getScrollTop();
    this.startX = util.getScrollLeft();
    this.options = {
      duration : options.duration || this.duration,
      offset   : options.offset || 0,
      callback : options.callback,
      easing   : this._easing(options.easing || this.easing),
      delay    : options.delay || 0,
    };

    this.distance = (() => {
      const t = (typeof target);
      if (t === 'string') {
        target = target.split('#')[1];
        if (!target) return 0;
        return this.options.offset + document.getElementById(target).getBoundingClientRect().top;
      }
      if (t === 'object') return this.options.offset + target.getBoundingClientRect().top;
      return this.options.offset + target;
    })();
    this.distanceX = 0 - this.startX;

    this.duration = typeof this.options.duration === 'function'
        ? this.options.duration(this.distance)
        : this.options.duration;
    setTimeout(() => {
      requestAnimationFrame(time => {
        this.timeStart = time;
        this._loop(time);
      });
    }, this.options.delay);
  }

  _end() {
    window.scrollTo(0, this.start + this.distance);

    typeof this.options.callback === 'function' && this.options.callback();
    this.timeStart = false;
    return true;
  }

  _loop(time) {
    this.timeElapsed = time - this.timeStart;
    this.next = this.options.easing(this.timeElapsed, this.start, this.distance, this.duration);
    this.nextX = this.options.easing(this.timeElapsed, this.startX, this.distanceX, this.duration);

    window.scrollTo(this.nextX, this.next);

    this.timeElapsed < this.duration ? requestAnimationFrame(time => this._loop(time)) : this._end();
  }

  _easing(func) {
    const easing = {
      easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
      },
      easeInCubic(t, b, c, d) {
        return c * (t /= d) * t * t + b;
      },
      easeOutCubic(t, b, c, d) {
        return c * ((t = t / d - 1) * t * t + 1) + b;
      },
      easeInOutCubic(t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t + 2) + b;
      },
    };
    if (easing[func]) return easing[func];
    return null;
  }
}
