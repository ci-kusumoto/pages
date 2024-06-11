import * as uty from "./utility.js";

export default class CutoffSwiper {
  constructor(selector = '.swiper', options = {}) {

    this.options = {
      ...{}, ...options
    };
    this.options.cutoff = {
      ...{
        wrapper: 375,
        wrapperMargin: 0,
        slide: 290,
        gap: 16,
        destroy: null
      }, ...options.cutoff
    }
    this.options.spaceBetween = this.options.cutoff.gap;
    this.options.slidesPerView = (this.options.cutoff.wrapper - (this.options.cutoff.wrapperMargin * 2) + this.options.cutoff.gap) / (this.options.cutoff.slide + this.options.cutoff.gap);


    this.selector = selector;
    this.swiper = null;
    this.isInitialized = false;

    this.swiper = new Swiper(this.selector, this.options);
    this.init();

    console.log(this);
  }

  init() {
    if (!this.isInitialized) {
      this.isInitialized = true;
    }
  }
}