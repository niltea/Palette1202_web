"use strict";

import util from './libs/util.js';
// import EventObserver from './libs/EventObserver.js';
import loader from './libs/class_loader.js';
// import swiper from './libs/swiper.js';

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

/* Handle Scroll Event */
// const scrollObserver = new EventObserver('scroll', document, () => util.getScrollTop());
// scrollObserve
// r.addHandler((e) => { log(e); }, 'debug');
/* Handle Resize Event */
// const resizeObserver = new EventObserver('resize', window, () => {
//   return {
//     width : window.innerWidth,
//     height: window.innerHeight,
//   }
// });

// let isTop = false;
// let pageClass = '';

// after image loaded callback

// after image loaded callback
const contentLoadCallback = () => {
  document.body.classList.remove('not--loaded');
  document.body.classList.add('is--loaded');

  setTimeout(() => {
    onLoadEffect();
  }, 1000);
};

// let scrollTimer = null;
// const addBodyScrollClass = () => {
//   const scrollingClass = 'is--scrolling';
//   const addClassElement = document.body;
//
//   addClassElement.classList.add(scrollingClass);
//   scrollTimer = setTimeout(() => {
//     addClassElement.classList.remove(scrollingClass);
//   }, 1500);　
// };

document.addEventListener('DOMContentLoaded', () => {
  loader.activateLoader(contentLoadCallback);
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
  window.addEventListener('resize', () => {
    vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  });
  setTimeout(() => {
    util.setScrollTop(0);
    // loader
    scrollEffect.init();
  }, 500);
});

const onLoadEffect = () => {
  const loadScreen = document.getElementById('loader');
  if (loadScreen) hideLoader(loadScreen);

  const loadContainers = [].slice.call(document.querySelectorAll('.load-container'));
  setTimeout(() => {
    loadContainers.forEach((loadItem, i) => {
      setTimeout(() => {
        loadItem.classList.add('triggered');
      }, i);
    });
  }, 750);

  setTimeout(() => {
    document.body.classList.add('is--animeEnd');
  }, loadContainers.length * 50 + 200);

};

const hideLoader = (loadScreen) => {
  loadScreen.classList.add('loaded');
};
