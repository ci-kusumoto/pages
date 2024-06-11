import { debug, offset } from "./utility.js";

export default class FollowArea {
  constructor(_selector = '.js-follow-area', _args = {}) {
    this.settings = {
      target: `.js-follow-area__target`,
      headerHeight: 0,
      ..._args
    };

    this.areaAll = document.querySelectorAll(_selector);

    this.init();
    ['load', 'scroll'].forEach((event) => {
      window.addEventListener(event, (e) => {
        if (event === 'load') {
          this.init();
        }

        this.toggleClass();
      });
    })
  }

  init() {
    if (typeof this.settings.headerHeight === 'string') {
      this.settings.headerHeight = parseInt(this.settings.headerHeight);
    }
    debug(this.settings);
  }

  toggleClass() {
    this.areaAll.forEach((area) => {
      const areaOffsetTop = offset(area).top;
      const target = area.querySelector(this.settings.target);
      if (!target) return;

      const isFixedStart = (window.scrollY + this.settings.headerHeight >= areaOffsetTop - 2);
      const isFixedEnd = ((window.scrollY + window.innerHeight) >= areaOffsetTop + area.clientHeight - 2);

      if (isFixedStart) {
        target.classList.add('is-fixed-start');
        if (isFixedEnd) {
          target.classList.add('is-fixed-end');
        } else {
          target.classList.remove('is-fixed-end');
        }
      } else {
        target.classList.remove('is-fixed-start');
      }
    });
  }
}