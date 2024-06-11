import { isDevice } from "./utility.js";

export function gapCalcuration(args) {
  const settings = {
    ...{
      wrapper: 375,
      wrapperMargin: 0,
      slide: 290,
      gap: 16,
      destroy: null
    },
    ...args
  }
  const result = (settings.wrapper - (settings.wrapperMargin * 2) + settings.gap) / (settings.slide + settings.gap);

  return result;
}

export default class MySwiper {
  constructor(selector = '.my-swiper .swiper', settings = {}, options = {}) {
    const $root = (typeof selector === 'object') ? selector : document.querySelector(selector);

    this.settings = {
      ...{
        destroy: null,
      },
      ...settings
    };

    this.options = {
      ...{
        loop: true,
        slidesPerView: gapCalcuration(this.settings),
        spaceBetween: settings.gap,
        centeredSlides: false,
        navigation: {
          nextEl: $root.querySelector('.swiper-button-next'),
          prevEl: $root.querySelector('.swiper-button-prev'),
        },
        pagination: {
          el: $root.querySelector('.swiper-pagination'),
          type: 'bullets',
        },
      },
      ...options
    };

    this.selector = $root;
    this.swiper = null;
    this.isInitialized = false;

    this.init();
  }

  init() {
    if (this.settings.destroy === 'pc') {
      if (!isDevice('PC')) {
        this.create();
      }
    } else if (this.settings.destroy === 'sp') {
      if (isDevice('PC')) {
        this.create();
      }
    } else {
      this.create();
    }
  }

  resize() {
    if (this.settings.destroy === 'pc') {
      if (!isDevice('PC')) {
        this.create();
      } else {
        this.destroy();
      }
    } else if (this.settings.destroy === 'sp') {
      if (isDevice('PC')) {
        this.create();
      } else {
        this.destroy();
      }
    }
  }

  create() {
    if (!this.isInitialized) {
      this.swiper = new Swiper(this.selector, this.options);
      this.isInitialized = true;
    }
  }

  destroy() {
    if (this.isInitialized) {
      this.swiper.destroy();
      this.isInitialized = false;
    }
  }
}