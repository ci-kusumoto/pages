import { offset } from "./utility.js";

export default class SectionPagination {
  constructor(_selector = '.js-section-pagination', { reference = 0.5, influenced }) {
    this.reference = reference;
    this.selectorAll = document.querySelectorAll(_selector);

    if (influenced) this.influencedAll = document.querySelectorAll(influenced);

    ['load', 'scroll', 'resize'].forEach((event) => {
      window.addEventListener(event, (e) => {
        this.selectorAll.forEach((selector, i) => {
          const isCurrentStart = window.scrollY + (window.innerHeight * reference) > offset(selector).top;
          const isCurrentEnd = window.scrollY + (window.innerHeight * reference) > offset(selector).bottom;

          if (isCurrentStart && !isCurrentEnd) {
            selector.classList.add('is-current');
            if (influenced) this.influencedAll[i].classList.add('is-current');
          } else {
            selector.classList.remove('is-current');
            if (influenced) this.influencedAll[i].classList.remove('is-current');
          }
        });
      });
    });
  }
}