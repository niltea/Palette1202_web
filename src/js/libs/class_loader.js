const debug = false;
const backgroundImageClassname = 'loaderTarget';

const log = (() => {
	/* eslint-disable no-console */
	if (!debug) return () => { return null; };
	return (...arg) => { console.log(...arg); };
})();
export default new class Loader {
	constructor () {
		document.addEventListener('DOMContentLoaded', () => {
			log('Loader constructor called');
		});
	}
	activateLoader (onComplete, onEach, progressContainer) {
		log('Loader activateLoader called');
		// ロード済みの画像数
		this.receivedCount = 0;
		// 画像を探してくる
		this.images = this.findImages();
		this.expectedCount = this.images.length;
		// 完了時の動作が定義されていればそれを使う
		this.onComplete = (typeof onComplete === 'function') ? onComplete : this.contentLoaded;
		// 画像読み込みごとの動作が定義されていればそれを使う。
		// なければ定義する
		if (typeof onEach !== 'function') {
			this.progressContainer = (progressContainer) ? progressContainer : document.getElementById('progressContainer');
			onEach = (!this.progressContainer) ? null : (receivedCount) => {
				const progress = Math.round(receivedCount / this.expectedCount * 100);
				this.progressContainer.textContent = progress;
			};
		}
		this.onEach = onEach;

		log('images', this.images);
		log('onComplete', this.onComplete);
		log('onEach', this.onEach);
		this.setWatcher();
	}
	findImages () {
		log('Loader findImages called');
		const images = [];
		// img要素を探してくる
		const targets_img = [].slice.call(document.getElementsByTagName('img'));
		targets_img.forEach((el) => {
			let _src = el.getAttribute('src');
			// srcが空なら中断
			if (!_src) return;
			images.push(_src);
		});


		const targets_bgi = [].slice.call(document.getElementsByClassName(backgroundImageClassname));
		const bgi = 'background-image';
		targets_bgi.forEach((el) => {
			// elementが空なら中断
			if (!el) return;
			// 背景画像を取得し、取得できなければ中断
			let _src = el.style[bgi] || getComputedStyle(el, '')[bgi];
			if (!_src || _src == 'none') return;

			// 画像をpush
			images.push(_src.replace(/^url\(|"|\)$/g, ''));
		});
		return images;
	}
	setWatcher () {
		log('Loader setWatcher called');
		// if images is empty, go to loaded Function
		if(!this.images || this.images.length <= 0) {
			this.onComplete();
			return;
		}

		//画像の数だけ_loadListenerが呼ばれたらcallbackが呼ばれる
		// const _loadListener(expectedCount = , setting.onEach, setting.onComplete);
		this.images.forEach(url => {
			const img = new Image;
			document.body.appendChild(img);
			img.width = img.height = 1;
			img.onload = this._loadListener.bind(this);
			img.src = url;
		});
	}
	_loadListener (e) {
		// remove temporary image
		const tgt = e.target;
		if (tgt) tgt.parentNode.removeChild(tgt);
		this.receivedCount += 1;
		if (this.onEach) this.onEach(this.receivedCount);
		if(this.receivedCount >= this.expectedCount) {
			this.onComplete();
		}
	}
	contentLoaded () {
		log('Loader contentLoaded called');
	}
};
