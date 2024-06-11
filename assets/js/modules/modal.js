import { animate, createElement } from "./utility.js";

export default class Modal {

  constructor(args = {}) {
    this.$parent = args.$parent || document.querySelector('body');
    this.$modal = {};
    this.$modal = { ...this.$modal, ...args.$modal };
    this.settings = {
      duration: 400,
    };
    this.flag = {
      isOpen: false,
      isBodyFixed: (args.flag) ? args.flag.isBodyFixed : true,
    };
    this.closedHandler = () => { };

    if (!document.getElementById('LayoutModal')) {
      const modalbase = createElement('div', {
        class: 'l-modal',
        id: 'LayoutModal'
      });
      this.$parent.append(modalbase);
      this.$modal.template = this.$modal.template || '<div class="l-modal__container"><div class="l-modal__close" id="LayoutModalClose"></div><div class="l-modal__content"></div></div>';
    } else {
      this.$modal.template = document.getElementById('LayoutModal').innerHTML;
    }
    this.init(args);

    this.$modal.root.addEventListener('click', (e) => {
      this.$modal.close.dispatchEvent(new Event('click'));
    });
  }

  /**
   * モーダル用のHTMLElementがなければ挿入する
   * @param {object} args
   */
  init(args = {}) {

    this.$modal.root = document.getElementById('LayoutModal');
    this.$modal.root.innerHTML = this.$modal.template;

    this.$modal.container = this.$modal.root.querySelector('.l-modal__container');
    this.$modal.close = this.$modal.root.querySelector('.l-modal__close');
    this.$modal.content = this.$modal.root.querySelector('.l-modal__content');
    this.$modal.slider = this.$modal.root.querySelector('.l-modal__slider');

    this.$modal.root.style.display = '';
    this.$modal.root.style.opacity = '';

    this.$modal.content.querySelectorAll('*').forEach((node) => {
      node.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    })
    this.$modal.close.addEventListener('click', () => {
      this.close(this.closedHandler);
    })
  }

  open(cb) {
    if (this.flag.isOpen) {
      this.$modal.close.dispatchEvent(new Event('click'));
    } else {
      this.flag.isOpen = true;
      this.$modal.root.style.display = 'block';
      animate((e) => {
        this.$modal.root.style.opacity = e.progress;
      }, this.settings.duration, undefined, () => {
        if (cb) cb();
        if (this.flag.isBodyFixed) window.dispatchEvent(new Event('bodyFixedOn'));
        [...this.$modal.content.children].map((child) => {
          child.addEventListener('click', (e) => {
            e.stopPropagation();
          });
        });
      });
    }
  }
  close(cb) {
    animate((e) => {
      this.$modal.root.style.opacity = 1 - e.progress;
    }, this.settings.duration, undefined, () => {
      this.$modal.root.innerHTML = this.$modal.template;
      this.init();
      if (cb) cb();
      this.flag.isOpen = false;
      if (this.flag.isBodyFixed) window.dispatchEvent(new Event('bodyFixedOff'));
      this.$modal.root.dispatchEvent(new Event('modalClose'));
    });
  }
}
