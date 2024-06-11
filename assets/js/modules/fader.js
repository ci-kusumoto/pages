import { animate } from "./utility.js";

export default class Fader {
  constructor(_selector = '.js-fader', _args = {}) {

    this.settings = {
      ...{
        wrapperEl: '.js-fader-wrapper',
        itemEl: '.js-fader-item',
        duration: 3000,
        speed: 400,
        device: {
          pc: true,
          tb: true,
          sp: true
        },
      }, ..._args
    };

    this.timer = [];
    this.counter = [];

    const selectorAll = document.querySelectorAll(_selector);
    this.selectorAll = selectorAll;

    this.init();
  }

  init() {
    this.selectorAll.forEach((selector, i) => {
      this.counter[i] = 0;
    });
    this.run();
  }

  run() {
    this.selectorAll.forEach((selector, i) => {
      if (this.timer[i]) return;
      const wrapper = selector.querySelector(this.settings.wrapperEl);
      const itemAll = selector.querySelectorAll(this.settings.itemEl);

      wrapper.style.display = 'grid';

      itemAll.forEach((item, j) => {
        item.style.gridArea = '1 / -1';
        item.style.zIndex = itemAll.length - j;
      });

      this.timer[i] = setInterval(() => {
        selector.dispatchEvent(new Event('ItemChangeStart'));
        animate((e) => {
          this.currentItem = itemAll[this.counter[i]];
          itemAll[this.counter[i]].style.opacity = 1 - e.progress;
        }, this.settings.speed, undefined, () => {
          selector.dispatchEvent(new Event('ItemChangeEnd'));
          itemAll[this.counter[i]].style.opacity = 1;
          itemAll.forEach((item) => {
            if (parseInt(item.style.zIndex) === itemAll.length) {
              item.style.zIndex = '1';
            } else {
              item.style.zIndex = parseInt(item.style.zIndex) + 1;
            }
          });
          this.counter[i]++;
          if (this.counter[i] === itemAll.length) {
            this.counter[i] = 0;
          }
        });
      }, this.settings.duration);
    });
  }

  stop() {
    this.selectorAll.forEach((selector, i) => {
      const itemAll = selector.querySelectorAll(this.settings.itemEl);

      itemAll.forEach((item) => {
        item.style.opacity = '';
      });
      clearInterval(this.timer[i]);
      this.timer[i] = null;
    });
  }

  destroy() {
    this.selectorAll.forEach((selector, i) => {
      const wrapper = selector.querySelector(this.settings.wrapperEl);
      const itemAll = selector.querySelectorAll(this.settings.itemEl);
      wrapper.style.display = '';
      itemAll.forEach((item) => {
        item.style.zIndex = '';
        item.style.gridArea = '';
      });
    });
    this.stop();
  }
}