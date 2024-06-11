import { debug, generateRandomNum, isDevice } from "./utility.js";

export default class FlashCard {
  /**
   *
   * @param {string} selector
   * @param {object} args
   */
  constructor(selector = '.js-flash-card', args = {}) {
    const _default = {
      wrapperEl: `.js-flash-card-wrapper`,
      itemEl: `.js-flash-card-item`,
      speed: 400,
      rotate: 0,
    };

    _default.gap = {
      x: (isDevice('PC')) ? 300 : 100,
      y: (isDevice('PC')) ? 150 : 50,
    };

    this.selector = selector;
    this.datas = [];
    this.settings = { ..._default, ...args };

    this.init();
    debug(this);

    [...document.querySelectorAll(selector)].map((el, i) => {
      el.addEventListener('mouseenter', (e) => {
        this.run(e, i);
      });
      el.addEventListener('mouseleave', (e) => {
        this.stop(e, i);
      });
    });
  }

  init() {
    [...document.querySelectorAll(this.selector)].map((el) => {
      let allItem = el.querySelectorAll(this.settings.itemEl);
      let itemLength = allItem.length;
      let data = {};
      [...allItem].map((el, i) => {
        debug(el.childNodes);
        let randomX = generateRandomNum(this.settings.gap.x);
        let randomY = generateRandomNum(this.settings.gap.y);
        let ramdomRotate = generateRandomNum(this.settings.rotate);
        if (i > 0) {
          el.style.top = `calc(50% + ${randomY}px)`;
          el.style.left = `calc(50% + ${randomX}px)`;
          if (this.settings.rotate > 0) el.children[0].style.transform = `rotate(${ramdomRotate}deg)`;
        }
        el.style.zIndex = itemLength - i;
      });
      data.counter = 0;
      data.itemLength = itemLength;
      data.id = false;
      this.datas.push(data);
    });
  }

  run(e, i) {
    let allItem = e.target.querySelectorAll(this.settings.itemEl);
    debug({ allItem });

    if (allItem.length < 2) return;
    if (!this.datas[i].id) {
      this.datas[i].id = setInterval(() => {
        this.datas[i].counter++;
        /**
         * 現在の画像の重なり方のパターン。
         * -([Item数]-1) ~ ([Item数]-1) の ([Item数]*2 - 1)パターンある
         * ３枚の時、-2〜2の5パターン
         */
        let type = this.datas[i].counter - allItem.length;

        /**
         * 現在、一番上に重ねられている画像のindex番号
         */
        let current = ((this.datas[i].counter - 1) % allItem.length);

        [...allItem].map((item, i) => {
          if (i === current) {
            // カレントの画像要素に対して[Item数]のz-indexを当てることで一番上に表示させる
            item.style.zIndex = allItem.length;
            debug(`${i}番目のz-indexを${allItem.length}に変更`);
          } else {
            if (type >= 0) {
              // 重なりのパターンが0より大きい場合のみ、現在のz-indexから1引いた値をz-indexにあてなおす
              let nowZIndex = item.style.zIndex;
              item.style.zIndex = nowZIndex - 1;
              // debug(`${i}番目の現在のz-indexは${nowZIndex}なので、${i}番目のz-indexを${nowZIndex - 1}に変更`);
            }
          }
        });

        debug(`${this.datas[i].counter}の時、type: ${type}、currentIndex: ${current}`);

        // (Item数*2 - 2)の時と(現在のカウント - Item数)は同じ形になるので
        // (Item数*2 - 2)になったら、(現在のカウント - Item数)にカウントをリセット
        let isLoop = this.datas[i].counter > (this.datas[i].itemLength * 2) - 2;
        if (isLoop) this.datas[i].counter = this.datas[i].counter - allItem.length;

      }, this.settings.speed);
    }
  }

  stop(e, i) {
    clearInterval(this.datas[i].id);
    this.datas[i].id = false;
  }

}

