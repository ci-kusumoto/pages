import { animate, getHeight, isDevice } from "./utility.js";

export default class Accordion {
  constructor(root = '.js-accordion', args = {}) {
    const _default = {
      wrapperEl: '.js-accordion-wrapper',
      itemEl: '.js-accordion-item',
      triggerEl: '.js-accordion-trigger',
      targetEl: '.js-accordion-target',
      closeEl: '.js-accordion-close',
      showOnlyOne: false,
      slideToggle: true,
      duration: 400,
      activate: {
        pc: true,
        tb: true,
        sp: true,
      }
    };

    this.settings = { ..._default, ...args }
    this.settings.activate = { ..._default.activate, ...args.activate };

    this.rootAll = document.querySelectorAll(root);

    this.selector = root;

    this.init();

    window.addEventListener('resized', (e) => {
      this.setHeight();
    });
  }

  init() {
    if (!this.rootAll) return;

    this.setHeight();
    this.rootAll.forEach(($root, i) => {
      this.run($root);
    });
  }

  setHeight() {
    this.rootAll.forEach((root, i) => {
      const targetAll = root.querySelectorAll(this.settings.targetEl);
      if (!targetAll) return;

      targetAll.forEach((target) => {
        const height = getHeight(target) + 1;
        target.dataset.height = height;
        target.setAttribute('style', `--accordion-h: ${height}px`)
      });
    });
  }

  open(target) {
    const style = window.getComputedStyle(target);
    if (style.transitionProperty === 'height') return;
    animate((e) => {
      target.style.height = `${target.dataset.height * e.progress}px`;
    }, this.settings.duration, undefined, () => {
      target.style.height = 'auto';
    });
  }

  close(target) {
    const style = window.getComputedStyle(target);
    if (style.transitionProperty === 'height') return;
    animate((e) => {
      target.style.height = `${target.dataset.height - target.dataset.height * e.progress}px`;
    }, this.settings.duration, undefined, () => {
      target.style.height = '';
    });
  }

  run($_root) {
    const triggerAll = $_root.querySelectorAll(this.settings.triggerEl);

    triggerAll.forEach((trigger) => {
      const wrapper = trigger.closest(this.settings.wrapperEl);
      const item = trigger.closest(this.settings.itemEl);
      const target = (wrapper) ? wrapper.querySelector(this.settings.targetEl) : trigger.nextElementSibling;
      const close = (wrapper) ? wrapper.querySelector(this.settings.closeEl) : undefined;

      trigger.addEventListener('click', (e) => {
        if (!this.settings.activate.pc && isDevice('PC')) return;
        if (!this.settings.activate.tb && isDevice('TB')) return;
        if (!this.settings.activate.sp && isDevice('SP')) return;

        if (!wrapper || !item) {
          if (!trigger.classList.contains('is-active')) {
            e.currentTarget.classList.add('is-active');
            this.open(target);
          } else {
            e.currentTarget.classList.remove('is-active');
            this.close(target);
          }
        } else {
          const activeItem = wrapper.querySelector('.is-active');
          if (!item.classList.contains('is-active')) {
            if (this.settings.showOnlyOne && activeItem) activeItem.classList.remove('is-active');
            item.classList.add('is-active');
          } else {
            if(!this.settings.slideToggle) return;
            if (this.settings.showOnlyOne) {
              if (activeItem) activeItem.classList.remove('is-active');
            } else {
              item.classList.remove('is-active');
            }
          }
        }
      });

      if (close) {
        close.addEventListener('click', (e) => {
          item.classList.remove('is-active');
        });
      }

    });

  }
}