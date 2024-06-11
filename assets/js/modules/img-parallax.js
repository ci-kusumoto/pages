import { debug, offset } from "./utility.js";

export default class ImgParallax {
  constructor(_selector = '.js-img-parallax', _args = {}) {

    this.settings = {
      ...{
      },
      ..._args
    }

    this.selectorAll = document.querySelectorAll(_selector);

    ['DOMContentLoaded', 'resize', 'scroll'].forEach((event) => {
      window.addEventListener(event, () => {
        this.run();
      })
    })
  }

  run() {
    this.selectorAll.forEach((selector) => {
      const selectorOffsetTop = offset(selector).top;
      const img = selector.querySelector('img');
      img.vh = img.naturalHeight * img.clientWidth / img.naturalWidth;

      const diff = selector.clientHeight - img.vh;
      const move = Math.abs(diff);
      let progress = ((window.scrollY + window.innerHeight) - selectorOffsetTop) / (selector.clientHeight + window.innerHeight)

      debug(selector.clientHeight)
      debug(img.clientHeight)
      debug(img.vh)

      if (progress < 0) {
        progress = 0;
      } else if (progress > 1) {
        progress = 1;
      }

      if (progress < 1 && progress > 0) {
        if (diff > 0) {
          img.style.height = `${selector.clientHeight}px`;
          img.style.transform = ``
        } else {
          img.style.height = ``;
          img.style.transform = `translateY(-${move - (move * progress)}px)`
        }
      }

    });
  }
}