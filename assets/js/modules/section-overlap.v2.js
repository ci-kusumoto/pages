import { clamp, isDevice, offset } from "./utility.js";

export default class SectionOverlap {
  #selectors;
  #classNames;

  /**
   *
   * @param {string} selector 処理させたい要素のセレクタを指定
   * @param {object} args オプションをオブジェクト形式で指定
   *                 - {number} keepRatio: ウインドウから隠さずに残しておきたい割合
   */
  constructor(selector = ".js-sol", args = {}) {
    /**
     * セレクタの初期設定
     */
    this.#selectors = {
      root: selector,
      wrapper: ".js-sol-wrapper",
      item: ".js-sol-item",
      escape: ".js-sol-escape",
      fadeout: ".js-sol-fadeout",
    };

    /**
     * this.#selectors内の値の先頭から.を除去したもの
     */
    this.#classNames = {};
    Object.entries(this.#selectors).forEach(([key, value]) => {
      this.#classNames[key] = value.replace(/^\./, "");
    });

    /**
     * 指定した割合分だけ、ウインドウから隠れずに残る
     * - 0: 完全に隠れる
     * - 1: すべて表示され続ける
     */
    this.keepRatio = args.keepRatio ?? 1;

    /**
     * thisとargsをマージ
     */
    Object.assign(this, args);
  }

  /**
   * 初期化メソッド
   * ルート要素、ラッパー要素、全てのアイテム要素、すべての画像要素を取得
   * それそれに必要なスタイルを付与
   */
  initialize() {
    this.root = document.querySelector(this.#selectors.root);
    this.wrapper = this.root.querySelector(this.#selectors.wrapper);
    this.itemAll = this.root.querySelectorAll(this.#selectors.item);
    this.itemImgAll = this.root.querySelectorAll(`${this.#selectors.item} img`);

    const rootStyles = window.getComputedStyle(this.root);
    const wrapperStyles = window.getComputedStyle(this.wrapper);

    if (!rootStyles.position) {
      this.root.style.position = "relative";
    }
    if (!wrapperStyles.width) {
      this.wrapper.style.width = "100%";
    }
    if (!wrapperStyles.top) {
      this.wrapper.style.top = 0;
    }

    this.itemAll.forEach((item, i) => {
      const itemStyles = window.getComputedStyle(item);
      if (!itemStyles.position) {
        item.style.position = "relative";
      }
    });
  }

  /**
   * wrapper要素の高さを固定
   */
  setWrapperHeight() {
    this.root.style.height = `${this.wrapper.clientHeight}px`;
  }

  /**
   * 各item要素がどれだけ移動するかを計算する
   */
  calcMoveLimits() {
    this.moveLimits = Array.from(this.itemAll).map((item, i) => {
      // アイテムの頭までの距離と
      // アイテムの頭までの距離 + アイテムの高さ - 表示しておきたい幅を比べて
      // 大きい方
      return Math.max(
        item.offsetTop +
          (item.clientHeight - window.innerHeight * this.keepRatio),
        item.offsetTop
      );
    });
  }

  /**
   * 入ってくる際の進捗率と、出ていく際の進捗率を出してカスタム変数に登録
   */
  setProgress() {
    if (!this.moveLimits) return;
    this.itemAll.forEach((item, i) => {
      // 進んだ距離は、吸着位置とウィンドウ上辺との差
      const hideDistance =
        window.scrollY - (this.moveLimits[i] + offset(this.root).top);
      const hideProgress = clamp(hideDistance / (window.innerHeight * this.keepRatio));

      // 進んだ距離はウインドウの底辺とitemの頭の位置
      const inDistance =
        window.scrollY +
        window.innerHeight -
        (item.offsetTop + offset(this.root).top);
      const inProgress = clamp(inDistance / window.innerHeight);

      item.style.setProperty("--hide-progress", hideProgress);
      item.style.setProperty("--in-progress", inProgress);
    });
  }

  /**
   * 各アイテムにtransformスタイルを当てて、動かす
   */
  setItemTransform() {
    if (!this.moveLimits) return;
    this.itemAll.forEach((item, i) => {
      // エスケープクラスが付与されている場合は処理を捺せすに
      // 通常のスクロール時と同様の動きをさせる
      const isEscape =
        item.classList.contains(this.#classNames.escape) ||
        (!isDevice("PC") &&
          item.classList.contains(`${this.#classNames.escape}-sp`)) ||
        (isDevice("PC") &&
          item.classList.contains(`${this.#classNames.escape}-pc`));

      const moveLimit = isEscape ? this.moveLimits[i + 1] : this.moveLimits[i];
      const moveValue = clamp(
        offset(this.root).top - window.scrollY,
        -moveLimit,
        0
      );

      item.style.transform = `translate3d(0, ${moveValue}px, 0)`;
    });
  }

  handleWindowReady(e) {
    this.initialize();
  }

  handleWindowLoad(e) {
    this.itemImgAll.forEach((img) => {
      img.style.setProperty("--w", img.clientWidth);
      img.style.setProperty("--h", img.clientHeight);
    });

    this.setWrapperHeight();
    this.calcMoveLimits();
    this.setProgress();
    this.setItemTransform();
  }

  handleWindowResize(e) {
    this.setWrapperHeight();
    this.calcMoveLimits();
    this.setProgress();
    this.setItemTransform();
  }

  handleWindowScroll(e) {
    // console.log(offset(this.root).top)
    let isFixed = window.scrollY > offset(this.root).top;
    if (isFixed) {
      this.wrapper.classList.add("is-fixed-start");
    } else {
      this.wrapper.classList.remove("is-fixed-start");
    }

    this.setProgress();
    this.setItemTransform();
  }
}
