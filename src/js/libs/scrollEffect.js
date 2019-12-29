import util from './util.js';

const targets = [
	{
		init () {
			const scrTop = util.getScrollTop();
			const targetList = [];

			this.target = [].slice.call(document.getElementsByClassName('scroll_effect_el'));
			this.target.forEach(target => {
				const pos = target.getBoundingClientRect().top + scrTop;
				targetList.push({pos, target, onTrigger : this.onTrigger.bind(target), onTrigger_up: this.onTrigger_up.bind(target) });
			});
			return targetList;
		},
		onTrigger () {
			const target = this;
			target.classList.add('trigger');
		},
		onTrigger_up () {
			const target = this;
			target.classList.remove('trigger');
		}
	},
	{
		init () {
			const scrTop = util.getScrollTop();
			const targetList = [];

			this.target = [].slice.call(document.getElementsByClassName('scroll_effect_back'));
			this.target.forEach(target => {
				const pos = target.getBoundingClientRect().top + scrTop;
				targetList.push({pos, target, onTrigger : this.onTrigger.bind(target), onTrigger_up: this.onTrigger_up.bind(target) });
			});
			return targetList;
		},
		onTrigger () {
			const target = this;
			target.classList.add('trigger');
		// setTimeout(() => {
		// 	tgt.classList.remove('trigger')
		// }, 1000);
		},
		onTrigger_up () {
		// this.onTrigger();
		}
	},

];

export default new class ScrollEffect{
	constructor() {
		this.targets = targets;
		this.targetList = [];
		this.prevScrTop = 0;
		this._getWinHeight();
		window.addEventListener('resize', this._getWinHeight);
	}
	init () {
		this.targets.forEach(target => {
			const list = target.init();
			if (list) this.targetList = this.targetList.concat(list);
		});
	}
	_getWinHeight () {
		this.winH = window.innerHeight;
		return this.winH;
	}
	onScroll (scrTop) {
		const triggerPoint_dn = scrTop + ~~(this.winH * 0.8);
		const triggerPoint_up = scrTop + this.winH;

		const isScrDown = (scrTop >= this.prevScrTop);

		this.targetList.forEach(target => {
			if (isScrDown && triggerPoint_dn >= target.pos) {
				if(target.over || !target.onTrigger) return;
				target.over = true;
				target.onTrigger();
			} else if (!isScrDown && triggerPoint_up <= target.pos) {
				target.over = false;
				if(!target.onTrigger_up) return;
				target.onTrigger_up();
			}
		});
		// console.log(triggerPoint);

		this.prevScrTop = scrTop;
	}
};