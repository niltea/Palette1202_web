const debug = true;
const log = (() => {
	/* eslint-disable-next-line no-console */
	if (!debug) return () => { return null; };
	return (...arg) => { console.log(...arg); };
})();

import util from './util.js';

export default class Slide {
	constructor (wrapper, options = {}) {
		if (!wrapper) return;
		this.wrapper = wrapper;
		if (wrapper.classList.contains('slide-captured')) return;
		wrapper.classList.add('slide-captured');

		const defaults = {};

		this.isBulletActive = false;

		this.slideTimer = null;
		this.transitionClass = 'is--transition';
		defaults.slideContainerSelector = 'swiper-container';
		this.slideContainerSelector = options.slideContainerSelector || '.' + defaults.slideContainerSelector;
		defaults.slideWrapperSelector = 'swiper-wrapper';
		this.slideWrapperSelector = options.slideWrapperSelector || '.' + defaults.slideWrapperSelector;
		defaults.slidesSelector = 'swiper-slide';
		this.slidesSelector = options.slidesSelector || '.' + defaults.slidesSelector;

		this.slidePrevClassName = 'swiper-slide-prev';
		this.slideCurrentClassName = 'swiper-slide-current';
		this.slideNextClassName = 'swiper-slide-next';
		// bullets
		this.bulletsWrapperSelector = '.pagination-bullets';
		this.bulletsClassName = 'swiper-pagination-bullet';

		const isAutoStart = false;
		this.isAutoPlay = false;

		this.slideDuration = 850;
		this.slideInterval = 3500;

		// 変数初期化
		this.currentIndex = 0;
		this.prevIndex = 0;
		this.slideTimer = null;
		this.notChangeOrder = false;

		// 要素取得
		this.wrapper.classList.add('swiper');
		this.slideWrapper = this.wrapper.querySelector(this.slideWrapperSelector);
		this.slideWrapper.classList.add(defaults.slideWrapperSelector);
		this.slideContainer = this.wrapper.querySelector(this.slideContainerSelector);
		this.slideContainer.classList.add(defaults.slideContainerSelector);
		if (!this.slideWrapper) return;
		this.slides = Array.from(this.slideWrapper.querySelectorAll(this.slidesSelector));
		this.slides.forEach((item) => {
			item.classList.add(defaults.slidesSelector);
		});

		this.bulletsWrapper = this.wrapper.querySelector(this.bulletsWrapperSelector);
		if (this.bulletsWrapper) this.isBulletActive = true;

		// コンテンツのセット
		this.setCarousel();

		// arrow
		const switch_prev = wrapper.querySelector('.arrow-left');
		if (switch_prev) switch_prev.addEventListener('click', this.slidePrev.bind(this));
		const switch_next = wrapper.querySelector('.arrow-right');
		if (switch_next) switch_next.addEventListener('click', this.slideNext.bind(this));
		// 自動スタート
		if (isAutoStart) this.timerStart();
	}
	setCarousel () {
		this.slidesCountInitial = this.slides.length;

		// リスト要素を全コピーして追加
		this.slides.forEach((item, index) => {
			const newChild = item.cloneNode(true);
			newChild.classList.add('slide-cloned');
			this.slideContainer.insertBefore(newChild, null);

			// bullets追加
			if (this.isBulletActive) {
				const bullet = util.addChild({
					parent: this.bulletsWrapper,
					class: `${this.bulletsClassName} swiper-pagination-bullet-${index}`,
					after: true,
				});
				bullet.setAttribute('data-bulletKey', index);
				if (index === 0) {
					bullet.classList.add('swiper-pagination-bullet-active');
				}
			}
		});
		if (this.isBulletActive) {
			this.bulletsWrapper.addEventListener('click', this.onBulletClick.bind(this));
		this.bullets = Array.from(this.bulletsWrapper.querySelectorAll(`.${this.bulletsClassName}`));
		}

		// 追加したので改めてslideを取得し直す
		this.slides = Array.from(this.slideContainer.querySelectorAll(this.slidesSelector));
		this.slidesCount = this.slides.length;

		// currentのクラス名付与
		this.slides[this.slidesCount - 1].classList.add(this.slidePrevClassName);
		this.slides[0].classList.add(this.slideCurrentClassName);
		this.slides[1].classList.add(this.slideNextClassName);
		if (!this.notChangeOrder) this.slideContainer.insertBefore(this.slides[this.slidesCount - 1], this.slides[0]);

		// 現在のslideをセットし直す
		this.setCurrentSlide();
	}
	setCurrentSlide () {
		// 改めてslideを取得し直す
		this.slides = Array.from(this.slideContainer.querySelectorAll(this.slidesSelector));
		this.prevSlide = this.slides[0];
		this.currentSlide = this.slides[1];
		this.nextSlide = this.slides[2];
	}
	setCurrentIndex () {
		if (this.currentIndex < 0) {
			this.currentIndex = this.slidesCountInitial - 1;
		} else if (this.currentIndex >= this.slidesCountInitial) {
			this.currentIndex = 0;
		}


		if (this.isBulletActive) {
			this.bullets[this.prevIndex].classList.remove('swiper-pagination-bullet-active');
			this.bullets[this.currentIndex].classList.add('swiper-pagination-bullet-active');
		}
	}
	slideNext (callbackCount) {
		if (this.isActive) return;
		this.isActive = true;
		this.timerStop();
		log('slideNext');
		// currentの変更
		// prev -> move to last
		const newLast = this.prevSlide;
		newLast.classList.remove(this.slidePrevClassName);
		// current -> to prev
		const newPrev = this.currentSlide;
		newPrev.classList.remove(this.slideCurrentClassName);
		newPrev.classList.add(this.slidePrevClassName);
		// next -> to current
		const newCurrent = this.nextSlide;
		newCurrent.classList.remove(this.slideNextClassName);
		newCurrent.classList.add(this.slideCurrentClassName);
		// next to Next -> to next
		const newNext = this.slides[3];
		newNext.classList.add(this.slideNextClassName);

		// 現在のslideをセットし直す
		this.prevIndex = this.currentIndex;
		this.currentIndex += 1;
		this.setCurrentIndex();
		setTimeout(() => {
			this.wrapper.classList.add(this.transitionClass);
			this.wrapper.classList.add('is--transitionNext');
		}, 0);
		setTimeout(() => {
			this.wrapper.classList.remove('is--transitionNext');
			this.wrapper.classList.remove(this.transitionClass);
			this.slideContainer.insertBefore(newLast, null);
			this.setCurrentSlide();
			this.isActive = false;
		}, this.slideDuration);
	}
	slidePrev (callbackCount) {
		if(this.isActive) return;
		this.isActive = true;
		this.timerStop();
		log('slidePrev');
		// currentの変更
		// prev -> to current
		const newCurrent = this.prevSlide;
		newCurrent.classList.remove(this.slidePrevClassName);
		newCurrent.classList.add(this.slideCurrentClassName);
		// current -> to next
		const newNext = this.currentSlide;
		newNext.classList.remove(this.slideCurrentClassName);
		newNext.classList.add(this.slideNextClassName);
		// next -> remove class
		const oldNext = this.nextSlide;
		oldNext.classList.remove(this.slideNextClassName);
		// last -> to prev
		const newPrev = this.slides[this.slidesCount - 1];
		newPrev.classList.add(this.slidePrevClassName);

		// 現在のslideをセットし直す
		this.prevIndex = this.currentIndex;
		this.currentIndex -= 1;
		this.setCurrentIndex();

		setTimeout(() => {
			this.wrapper.classList.add(this.transitionClass);
			this.wrapper.classList.add('is--transitionPrev');
		}, 0);
		setTimeout(() => {
			this.wrapper.classList.remove('is--transitionPrev');
			this.wrapper.classList.remove(this.transitionClass);
			this.slideContainer.insertBefore(newPrev, this.slides[0]);
			this.setCurrentSlide();
			this.isActive = false;
		}, this.slideDuration);
	}
	onBulletClick (event) {
		if (!this.isBulletActive) return;
		log(`this.isActive: ${this.isActive}`);
		if(this.isActive) return;
		this.isActive = true;
		this.wrapper.classList.add(this.transitionClass);
		const target = event.target;
		// 画像クリックでなければreturn
		if (!target.classList.contains(this.bulletsClassName)) return;
		const bulletKey = parseInt(target.getAttribute('data-bulletKey'), 10);
		// currentと同じならreturn
		if (target.classList.contains('swiper-pagination-bullet-active')) return;

		this.timerStop();

		// slideNext/slidePrevが呼べるか調べる
		// nextが呼べる条件:currentの次が押された
		let isNext = false;
		let isPrev = false;
		if (bulletKey === 0) {
			if (this.currentIndex === 1) isPrev = true;
			if (this.currentIndex === this.slidesCountInitial - 1) isNext = true;
		} else if (bulletKey === this.slidesCountInitial - 1) {
			if (this.currentIndex === 0) isPrev = true;
			if (this.currentIndex === this.slidesCountInitial - 2) isNext = true;
		} else {
			if (bulletKey === this.currentIndex - 1) isPrev = true;
			if (bulletKey === this.currentIndex + 1) isNext = true;
		}
		if (isPrev) {
			this.isActive = false;
			this.slidePrev();
		} else if (isNext) {
			this.isActive = false;
			this.slideNext();
		} else {
			// 距離計算
			let distance = 0;
			let distanceRev = 0;
			const currentID = this.currentIndex + 1;
			const bulletID = bulletKey + 1;
			if (bulletID > currentID) {
				// currentより後ろのbulletが押されたとき
				distance = bulletID - currentID;
				distanceRev = (this.slidesCountInitial + currentID) - bulletID;
			} else {
				// currentより前のbulletが押されたとき
				distance = (this.slidesCountInitial + bulletID) - currentID;
				distanceRev = currentID - bulletID;
			}
			if (distance < distanceRev) {
				// 正順で回転させる
				this.slideNext(distance - 1);
			} else {
				this.slidePrev(distanceRev - 1);
			}
		}
	}
	timerStart () {
		if (!this.isAutoPlay) return;
		this.slideTimer = setInterval(this.slideNext.bind(this), this.slideInterval);
	}
	timerStop () {
		if (!this.isAutoPlay) return;
		clearInterval(this.slideTimer);
	}
}
