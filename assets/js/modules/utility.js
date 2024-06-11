import ease from "./easing.js";

export const $$ = {
  startTime: null,
  breakpoint1: 576,
  breakpoint2: 992,
};

Math.exRound = (num, decimalPoint = 1) => {
  const ratio = Math.pow(10, decimalPoint);
  num = num * ratio;
  num = Math.round(num);
  num = num / ratio;
  return num;
};


export function debug(values = {}, msg = null) {
  const isDebugMode = location.search.match(/(\?|\&)debug=1/) || false;
  if (!isDebugMode) return;
  if (values !== null) {
    if (typeof values !== "object") values = { values };
    const entries = Object.entries(values);
    [...entries].map((entry) => {
      const now = new Date();
      const hour = now.getHours();
      const min = now.getMinutes();
      const sec = now.getSeconds();
      const ms = now.getMilliseconds();

      msg = msg || `{${typeof entry[1]}} ${entry[0]}`;
      console.log(`::: ${msg} [${hour}:${min}:${sec}.${ms}]`);
      console.log(entry[1]);
      console.log('::::::::::::::::::::');
    });
  } else {
    console.log(`::: ${msg} [${hour}:${min}:${sec}.${ms}]`);
    console.log(values);
    console.log('::::::::::::::::::::');
  }
}

export function animate(doSomething, duration = 1000, easing = ease.out.cubic, callback = null) {
  const e = {};
  let startTime = Date.now();

  const run = () => {
    let nowTime = Date.now();
    let elapsed = (duration - (nowTime - startTime) > 0) ? (nowTime - startTime) : duration;
    e.progress = Math.exRound(easing(elapsed / duration), 4);
    // e.progress = easing(elapsed / duration);


    if (elapsed !== duration) {
      doSomething(e);
      requestAnimationFrame(run);
    } else {
      elapsed = 1;
      doSomething(e);
      startTime = null;
      if (callback) callback();
    }
  }
  requestAnimationFrame(run);
}

export function offset(elem) {
  if(!elem) return;
  const result = {};
  let rect = elem.getBoundingClientRect();

  result.top = rect.top + window.scrollY;
  result.left = rect.left + window.scrollX;
  result.right = rect.left + window.scrollX + elem.clientWidth;
  result.bottom = rect.top + window.scrollY + elem.clientHeight;

  return result;
}

export function scrollAddClass(selector = '.js-scroll-add-class', args = {}) {
  const _default = {
    startDelay: 0.25,
    mode: 'default'
  };

  let allElem = document.querySelectorAll(selector);
  const settings = { ..._default, ...args };

  [...allElem].map((elem, i) => {
    let offsetTop = elem.getBoundingClientRect().top + window.scrollY;
    const startDelay = elem.dataset.startDelay || settings.startDelay;
    if ((window.scrollY + window.innerHeight) - (window.innerHeight * startDelay) >= offsetTop) {
      if (!elem.classList.contains('is-animated')) {
        elem.classList.add('is-animated');
        elem.dispatchEvent(new Event('classAdded'));
      }
    } else {
      if (settings.mode === 'alternate') elem.classList.remove('is-animated');
    }
  });
}

export function generateRandomNum(max, min = -max, decimalPoint = 0) {
  return (Math.random() * (max - min) + min).toFixed(decimalPoint);
}

export function smoothScroll(target, duration = 1000, easing = ease.out.cubic, callback) {
  let startPos = document.documentElement.scrollTop || document.body.scrollTop;
  let distance = target - startPos;
  let position = 0;

  animate((e) => {
    position = startPos + (distance * easing(e.progress));
    window.scrollTo(0, position);
  }, duration, easing, callback);
}

export function getHeight(elem) {
  let clone = elem.cloneNode(true);
  elem.parentNode.appendChild(clone);
  const cssText = (clone.style.display === "none") ? "display: block; height:auto; visibility:hidden;" : "height:auto; visibility:hidden;";
  clone.style.cssText = "height:auto; visibility:hidden;";
  let cloneHeight = clone.offsetHeight;
  elem.parentNode.removeChild(clone);

  return cloneHeight;
}

export function zeroPadding(num, length) {
  return (Array(length).join('0') + num).slice(-length);
}

export function createElement(tagName = 'div', attributes = null) {
  let newEl = document.createElement(tagName);
  if (attributes) {
    for (const [key, val] of Object.entries(attributes)) {
      newEl.setAttribute(key, val);
    }
  }
  return newEl;
}

export function pushState(args = {}) {
  var title, path;
  if (!args) return;

  if (args.value) {
    title = `${args.value}`;
    path = location.pathname + `?pid=${args.value}`;
    history.pushState(title, null, path);
  } else {
    title = `index`;
    path = location.pathname;
    history.pushState(title, '', path);
  }

  if (args.id) {
    if (typeof gtag == "undefined") return;
    gtag('config', args.id, { 'page_path': location.pathname + location.search });
  }

  debug('PushStateを実行');
};

export function isDevice(type) {
  const isPC = window.matchMedia(`(min-width: ${$$.breakpoint2 + 1}px)`).matches;
  const isTB = window.matchMedia(`(min-width: ${$$.breakpoint1 + 1}px) and (max-width: ${$$.breakpoint2}px)`).matches;
  const isSP = window.matchMedia(`(max-width: ${$$.breakpoint1}px)`).matches;

  // console.log(isPC, isTB, isSP);
  // console.log(type);

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

export function getCustomProperty(_selector = document.documentElement, _property, removeExtension = false) {
  const element = (typeof _selector === 'object') ? _selector : document.querySelector(_selector);
  const style = getComputedStyle(element);
  let value = String(style.getPropertyValue(_property)).trim();
  if (removeExtension) value = parseInt(value);

  return value;
}

export function getCookie(keys = []) {
  if (!navigator.cookieEnabled) return;
  const result = {};

  if (document.cookie != '') {
    const tmp = document.cookie.split('; ');
    for (let i = 0; i < tmp.length; i++) {
      const data = tmp[i].split('=');
      result[data[0]] = decodeURIComponent(data[1]);
    }
  }
  return result;
}

export function arrayShuffle(array = []) {
  let obj = {};

  for (let i = 0; i < array.length; i++) {
    let rand = Math.floor(Math.random() * array.length + 1);
    if (!obj[rand]) {
      obj[rand] = array[i];
    } else {
      i--;
    }
  }
  return Object.values(obj);
}

export function clamp(num, min = 0, max = 1) {
  return Math.min(Math.max(num, min), max) || 0;
}