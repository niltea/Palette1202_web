const debug = true;
/* eslint-disable-next-line no-unused-vars */
const log = (() => {
  if (!debug) return () => {
    return null;
  };
  return (...arg) => {
    /* eslint-disable-next-line no-console */
    console.log(...arg);
  };
})();

if (!Array.prototype.forEach) {
  Array.prototype.forEach = function (callback, thisArg) {

    var T, k;

    if (this === null) {
      throw new TypeError(' this is null or not defined');
    }

    // 1. Let O be the result of calling toObject() passing the
    // |this| value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get() internal
    // method of O with the argument "length".
    // 3. Let len be toUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If isCallable(callback) is false, throw a TypeError exception.
    // See: http://es5.github.com/#x9.11
    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
    }

    // 5. If thisArg was supplied, let T be thisArg; else let
    // T be undefined.
    if (arguments.length > 1) {
      T = thisArg;
    }

    // 6. Let k be 0
    k = 0;

    // 7. Repeat, while k < len
    while (k < len) {

      var kValue;

      // a. Let Pk be ToString(k).
      //    This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty
      //    internal method of O with argument Pk.
      //    This step can be combined with c
      // c. If kPresent is true, then
      if (k in O) {

        // i. Let kValue be the result of calling the Get internal
        // method of O with argument Pk.
        kValue = O[k];

        // ii. Call the Call internal method of callback with T as
        // the this value and argument list containing kValue, k, and O.
        callback.call(T, kValue, k, O);
      }
      // d. Increase k by 1.
      k++;
    }
    // 8. return undefined
  };
}
// Production steps of ECMA-262, Edition 6, 22.1.2.1
// Reference: https://people.mozilla.org/~jorendorff/es6-draft.html#sec-array.from
if (!Array.from) {
  Array.from = (function () {
    var toStr = Object.prototype.toString;
    var isCallable = function (fn) {
      return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
    };
    var toInteger = function (value) {
      var number = Number(value);
      if (isNaN(number)) {
        return 0;
      }
      if (number === 0 || !isFinite(number)) {
        return number;
      }
      return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
    };
    var maxSafeInteger = Math.pow(2, 53) - 1;
    var toLength = function (value) {
      var len = toInteger(value);
      return Math.min(Math.max(len, 0), maxSafeInteger);
    };

    // The length property of the from method is 1.
    return function from(arrayLike/*, mapFn, thisArg */) {
      // 1. Let C be the this value.
      var C = this;

      // 2. Let items be ToObject(arrayLike).
      var items = Object(arrayLike);

      // 3. ReturnIfAbrupt(items).
      if (arrayLike == null) {
        throw new TypeError('Array.from requires an array-like object - not null or undefined');
      }

      // 4. If mapfn is undefined, then let mapping be false.
      var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
      var T;
      if (typeof mapFn !== 'undefined') {
        // 5. else
        // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
        if (!isCallable(mapFn)) {
          throw new TypeError('Array.from: when provided, the second argument must be a function');
        }

        // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (arguments.length > 2) {
          T = arguments[2];
        }
      }

      // 10. Let lenValue be Get(items, "length").
      // 11. Let len be ToLength(lenValue).
      var len = toLength(items.length);

      // 13. If IsConstructor(C) is true, then
      // 13. a. Let A be the result of calling the [[Construct]] internal method of C with an argument list containing the single item len.
      // 14. a. Else, Let A be ArrayCreate(len).
      var A = isCallable(C) ? Object(new C(len)) : new Array(len);

      // 16. Let k be 0.
      var k = 0;
      // 17. Repeat, while k < len… (also steps a - h)
      var kValue;
      while (k < len) {
        kValue = items[k];
        if (mapFn) {
          A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
        } else {
          A[k] = kValue;
        }
        k += 1;
      }
      // 18. Let putStatus be Put(A, "length", len, true).
      A.length = len;
      // 20. Return A.
      return A;
    };
  }());
}
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
// MIT license
(function () {
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
        || window[vendors[x] + 'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame) window.requestAnimationFrame = function (callback) {
    var currTime = new Date().getTime();
    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
    var id = window.setTimeout(function () {
      callback(currTime + timeToCall);
    }, timeToCall);
    lastTime = currTime + timeToCall;
    return id;
  };
  if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function (id) {
    clearTimeout(id);
  };
}());
let isStopScroll = false;
let touchPos = 0;
let prevTouchPos = 0;
let leaveflg = false;

const gnav = document.getElementById('gnav');
const preventScroll = (e) => {
  if (1) return;
  e.preventDefault();

  if (!e.changedTouches || !gnav) return;
  //SP用動作
  touchPos = parseInt(e.changedTouches[0].pageY, 10);
  const touchDiff = prevTouchPos - touchPos;
  prevTouchPos = touchPos;
  if (leaveflg) {
    leaveflg = false;
    return;
  }

  const scrollPos = gnav.scrollTop;
  gnav.scrollTop = scrollPos + touchDiff;
};
document.addEventListener('touchend', () => {
  leaveflg = true;
});

const scrollEvent = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
// document.addEventListener(scrollEvent, preventScroll, false);
// document.addEventListener('touchmove', preventScroll, {passive : false});


// options {
// 	target       : target DOM to handle
// 	button       : target DOM to trigger
// 	closeButton  : target DOM to close trigger
// 	visibleClass : (string) class name when target is visible
// 	hiddenClass    : (string) class name when target is hidden
// }
class OpenClose {
  constructor(options) {
    const self = this;
    this.button = options.button;
    this.target = options.target;
    const closeButton = options.closeButton;
    this.visibleClass = options.visibleClass || 'is-visible';
    this.hiddenClass = options.hiddenClass || 'is-hidden';
    this.transitionClass = options.transitionClass || 'is-transition';
    this.transitionEndClass = options.transitionEndClass || 'is-transitionEnd';
    this.showTransitionTimeMS = options.showTransitionTimeMS || 500;
    this.hideTransitionTimeMS = options.hideTransitionTimeMS || 500;

    this.showCallback = options.showCallback;
    this.hideCallback = options.hideCallback;
    this.isStopScroll = options.isStopScroll;

    const initialShown = options.initialShown || false;

    if (!this.button || !this.target) return;
    // this.wrapper = document.getElementById('wrapper');
    this.isShown = false;
    this.scrollY = 0;
    this.button.addEventListener('click', this.tgtDisp.bind(this));
    if (closeButton) {
      if (closeButton.constructor === Array) {
        closeButton.forEach((button) => {
          button.addEventListener('click', self.toClose.bind(self));
        });
      } else {
        closeButton.addEventListener('click', self.toClose.bind(self));
      }
    }
    if (options.isCloseByTarget) {
      self.gnav.addEventListener('click', self.toClose.bind(self));
    }

    // 初期状態をセット
    this.tgtDisp(initialShown);
    if (options.initCallback) options.initCallback();
  }

  // 表示・非表示を切り替える関数
  //	opt		:	Boolean [true | false]
  // 	true	:	強制的に表示する
  // 	false	:	強制的に隠す
  // 	null	:	(default) 表示のトグル
  tgtDisp(opt) {
    if (opt.constructor !== Boolean) {
      // true/false以外が渡されたときは現在の表示状況に応じてオプションを設定
      opt = (this.isShown === true) ? false : true;
    }
    if (opt === true) {
      // to Show
      if (this.visibleClass) {
        this.target.classList.add(this.visibleClass);
        this.button.classList.add(this.visibleClass);
      }
      if (this.hiddenClass) {
        this.target.classList.remove(this.hiddenClass);
        this.button.classList.remove(this.hiddenClass);
      }
      this.target.classList.add(this.transitionClass);
      this.button.classList.add(this.transitionClass);
      this.target.classList.remove(this.transitionEndClass);
      setTimeout(() => {
        this.target.classList.add(this.transitionClass);
        this.button.classList.add(this.transitionClass);
        this.target.classList.add(this.transitionEndClass);
      }, this.showTransitionTimeMS);
      this.isShown = true;
      if (this.isStopScroll !== false) isStopScroll = true;
      // this.scrollY = util.getScrollTop();
      // this.wrapper.style.position = 'fixed';
      // this.wrapper.style.top = self.scrollY * -1 + 'px';
      if (this.showCallback) this.showCallback();
    } else {
      // to Hide
      if (this.visibleClass) {
        this.target.classList.remove(this.visibleClass);
        this.button.classList.remove(this.visibleClass);
      }
      if (this.hiddenClass) {
        this.target.classList.add(this.hiddenClass);
        this.button.classList.add(this.hiddenClass);
      }
      this.target.classList.add(this.transitionClass);
      this.button.classList.add(this.transitionClass);
      this.target.classList.remove(this.transitionEndClass);
      setTimeout(() => {
        this.target.classList.remove(this.transitionClass);
        this.button.classList.remove(this.transitionClass);
        this.target.classList.add(this.transitionEndClass);
      }, this.hideTransitionTimeMS);
      this.isShown = false;
      if (this.isStopScroll !== false) isStopScroll = false;
      // this.wrapper.style.position = '';
      // this.wrapper.style.top = '';
      // util.setScrollTop(this.scrollY);
      if (this.hideCallback) this.hideCallback();
    }
  }

  toClose() {
    this.tgtDisp(false);
  }
}


const getBrowserInfo = () => {
  const ua = navigator.userAgent.toLowerCase();
  const getVer = (ua, searchStr, endStr) => {
    // 開始位置を検出
    let start = ua.indexOf(searchStr);
    if (start < 0) return undefined;

    // 開始位置を検索文字数ぶんシフト
    // バージョン文字数区切りのスペースの位置を探る（開始文字分減じて文字数とする）
    start += searchStr.length;
    let end = ua.indexOf(endStr, start);
    end -= start;

    // バージョン文字を取り出しreturn
    return ua.substr(start, end).replace('_', '.');
  };

  // 返すオブジェクトを仮生成
  let browser = {
    isPC       : true,
    isSP       : false,
    isIE       : false,
    isWebKit   : false,
    isiOS      : false,
    isAndroid  : false,
    browserVer : null,
    OSVer      : null
  };
  // IE
  if (ua.match(/msie|trident/)) {
    browser.isIE = true;
    browser.OSVer = 'windows ' + getVer(ua, 'windows ', ';');
    browser.browserVer = getVer(ua, 'msie ', ';');
    if (browser.browserVer === undefined) {
      browser.browserVer = parseFloat(getVer(ua, 'trident/', ';'), 10) + 4;
    }
  }
  //WebKit
  if (ua.match(/webkit/)) {
    browser.isWebKit = true;
  }
  // iOS系
  if (ua.match(/iphone|ipad/)) {
    browser.isPC = false;
    browser.isSP = true;
    browser.isiOS = true;
    browser.OSVer = getVer(ua, 'iphone os ', ' ');
  }
  // Android
  if (ua.match(/android/)) {
    browser.isPC = false;
    browser.isSP = true;
    browser.isAndroid = true;

    browser.OSVer = getVer(ua, 'android ', ';');
  }
  window.clickEv = (browser.isPC) ? 'click' : 'touchend';
  window.scrollEv = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
  // 仮オブジェクト返す
  return browser;
};

export default new class Util {
  constructor() {
    this.browser = getBrowserInfo();
    // document.body.classList.add((this.browser.isPC) ? 'pc' : 'sp');
  }

  /**
   * function addChild
   * @param {Object} param 生成する子要素の設定
   * param.parent {string} 生成した要素を挿入する親要素
   * param.after {boolean} 親要素の最後に追加するか
   * param.element {string ? div} 生成する要素のタグ名
   * param.id {string} 生成する要素に付けるID
   * param.class {string} 生成する要素に付けるclass
   */
  addChild(param) {
    var el = (param.element) ? param.element : 'div';
    var newEl = param.HTMLelement || document.createElement(el);
    var where;
    if (param.id) newEl.setAttribute('id', param.id);
    if (param.class) newEl.setAttribute('class', param.class);
    if (param.attr) {
      for (var key in param.attr) {
        newEl.setAttribute(key, param.attr[key]);
      }
    }
    // parentの指定が無いときは要素を返す
    if (!param.parent) {
      return newEl;
    }
    if (param.parent.firstChild) {
      where = (param.after) ? null : param.parent.firstChild;
    } else {
      where = null;
    }
    return param.parent.insertBefore(newEl, where);
  }


  findParent(child, parentClassName) {
    if (!child) return;
    const parent = child.parentNode;
    if (parent.classList.contains(parentClassName)) return parent;
    return this.findParent(parent, parentClassName);
  }

  // ブラウザ間の差異を吸収しつつscroll位置をセットする
  setScrollTop(top) {
    let tgt;
    if ('scrollingElement' in document) {
      tgt = document.scrollingElement;
    } else if (this.browser && this.browser.isWebKit) {
      tgt = document.body;
    } else {
      tgt = document.documentElement;
    }
    tgt.scrollTop = top;
  }

  getScrollTop() {
    const d = window.document;
    const b = d.body;
    return (window.pageYOffset) ?
        window.pageYOffset : (d.documentElement || b.parentNode || b).scrollTop;
  }

  getScrollLeft() {
    const d = window.document;
    const b = d.body;
    return (window.pageXOffset) ?
        window.pageXOffset : (d.documentElement || b.parentNode || b).scrollLeft;
  }

  // XSS対策：textをサニタイズする関数
  sanitizer(string) {
    if (typeof string !== 'string') {
      return string;
    }
    string = string.replace(/<img ([a-z=\-0-9 "]+)src="([a-z0-9:/.\-_]+).*/g, '{!img:$2:!img}');
    string = string.replace(/[&'`"<>/]/g, (match) => {
      return {
        '&'  : '&amp;',
        '\'' : '&#x27;',
        '`'  : '&#x60;',
        '<'  : '&lt;',
        '"'  : '&quot;',
        '>'  : '&gt;',
        '/'  : '&#x2F;',
      }[match];
    });
    string = string.replace(/&lt;strong&gt;/g, '<strong>');
    string = string.replace(/&lt;&#x2F;strong&gt;/g, '</strong>');
    string = string.replace(/&lt;p&gt;/g, '<p>');
    string = string.replace(/&lt;&#x2F;p&gt;/g, '</p>');
    string = string.replace(/&lt;br &#x2F;&gt;/g, '<br />');
    string = string.replace(/{!img:(([a-z0-9:/.\-_]|&#x2F;)+):!img}/g, '<img src="$1">');
    return string;
  }

  OpenClose(opts) {
    return new OpenClose(opts);
  }

  // cookieのread/write
  getCookie() {
    const cookie = document.cookie.split(';');
    let cookieObj = {};
    cookie.forEach(elm => {
      const ca = elm.indexOf('=');
      const key = elm.slice(0, ca).replace(/^\s/, '');
      const val = elm.slice(ca + 1);
      cookieObj[key] = val;
    });
    return cookieObj;
  }

  setCookie(key, value, expireHour) {
    const now = new Date().getTime();
    const extime = new Date(now + (60 * 60 * 1000 * expireHour)).toGMTString();
    document.cookie = key + '=' + value + ';' + 'expires=' + extime;
  }
};
