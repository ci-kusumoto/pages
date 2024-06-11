import { debug, getCustomProperty, isDevice, offset, smoothScroll } from "./utility.js";

export default class Page {
  constructor(args = {}) {
    const _default = {
      tmpScrollTop: null,
      breakpoint1: 480,
      breakpoint2: 768,
      elem: {
        html: document.querySelector('html'),
        head: document.querySelector('head'),
        body: document.querySelector('body'),
        modalParent: document.querySelector('body'),
      },
    };
    this.$elms = {
      html: document.querySelector('html'),
      head: document.querySelector('head'),
      body: document.querySelector('body'),
    }
    this.settings = {
      tmpScrollTop: null,
      breakpoint1: 480,
      breakpoint2: 768,
    };

    Object.keys(args).forEach((key) => {
      if (!key) return;
      this[key] = { ...this[key], ...args[key] };
    });

    const self = this;
    debug({ self });

    window.addEventListener('DOMContentLoaded', () => {
      this.onReady();
    });
    ['load', 'resize', 'scroll'].forEach((event) => {
      window.addEventListener(event, () => {
        this.setValues();
      });
    });

    window.addEventListener('bodyFixedOn', () => {
      this.settings.modalScrollTop = window.scrollY;
      this.$elms.body.style.position = 'fixed';
      this.$elms.body.style.overflowY = 'scroll';
      this.$elms.body.style.top = `-${this.settings.modalScrollTop}px`;
    });
    window.addEventListener('bodyFixedOff', (e) => {
      this.$elms.body.style.position = '';
      this.$elms.body.style.overflowY = '';
      this.$elms.body.style.top = ``;
      window.scrollTo(0, this.settings.modalScrollTop);
      e.stopPropagation();
    });
  }

  onReady() {
    this.settings.mql = window.matchMedia(`(min-width: ${this.settings.breakpoint1 + 1}px) and (max-width: ${this.settings.breakpoint2}px)`);
    this.settings.device = this.settings.tmpdevice = isDevice();

    this.settings.mql.addEventListener('change', (e) => {
      window.dispatchEvent(new Event('breakpointSwitched'))
      if (this.settings.device !== this.settings.tmpdevice) {
        window.dispatchEvent(new Event(`device${this.settings.tmpdevice}to${this.settings.device}`));
        this.settings.device = this.settings.tmpdevice = isDevice();
      }
    });

    this.resized();
    this.anchorLink();
  }

  setValues() {
    this.settings.scrollTop = window.scrollY;
    this.settings.scrollBottom = window.scrollY + window.innerHeight;
  }

  anchorLink() {
    document.addEventListener('click', (e) => {
      const anchor = e.target.closest('a');
      const anchorOffset = getCustomProperty(undefined, '--general--anchor-offset', true) || 0;

      if (anchor && anchor.hash) {
        const anchorHref = anchor.attributes.href.value;
        if (!anchorHref.match(/^#/)) return;

        const hash = anchor.hash;
        const target = document.querySelector(hash);
        if (!target) return;
        const targetTop = offset(target).top - anchorOffset + 2;
        if (target) {
          e.preventDefault();
          smoothScroll(targetTop, 1600);
        }
      }
    });
  }

  isDevice(type) {
    const isPC = window.matchMedia(`(min-width: ${this.settings.breakpoint2 + 1}px)`).matches;
    const isTB = window.matchMedia(`(min-width: ${this.settings.breakpoint1 + 1}px) and (max-width: ${this.settings.breakpoint2}px)`).matches;
    const isSP = window.matchMedia(`(max-width: ${this.settings.breakpoint1}px)`).matches;

    if (!type) {
      if (isPC) return 'PC';
      if (isTB) return 'TB';
      if (isSP) return 'SP';
    } else {
      if (type === 'PC') {
        return isPC;
      } else if (type === 'TB') {
        return isTB;
      } else if (type === 'SP') {
        return isSP;
      }
    }
  }

  resized() {
    let timeoutID = 0;
    let delay = 500;

    window.addEventListener("resize", () => {
      clearTimeout(timeoutID);
      timeoutID = setTimeout(() => {
        window.dispatchEvent(new Event('resized'))
      }, delay);
    }, false);
  }
}