import { createElement } from "./utility.js";

export default class YTPlayer {
  constructor(selector = "#YTPlayer", ytOption = {}, settings = {}) {
    this.player = null;
    this.selector = selector;
    this.$elms = {};

    this.ytOption = {
      ...{
        videoId: document.querySelector(selector).dataset.ytid || null,
        width: 'auto',
        height: 'auto',
        playerVars: {
          autoplay: 1,
          controls: 0,
          playsinline: 1,
          showControls: false,
          showYTLogo: false,
        },
      },
      ...ytOption
    };
    this.settings = {
      ...{
        objectFit: false,
        aspectRatio: 16 / 9,
        loop: 1,
      },
      ...settings
    };

    this.initialize();
  }

  initialize() {
    if (!document.querySelector('script[data-type="yt-player"]')) {
      const tag = createElement('script', {
        'data-type': 'yt-player'
      });
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    if (this.ytOption.playerVars.autoplay > 0) this.ytOption.playerVars.mute = 1;
    if (this.settings.loop > 0) this.ytOption.playerVars.playlist = this.ytOption.videoId;

    this.ytOption.events = {
      'onReady': (e) => {
        this.onReadyHandler(e);
      },
      'onStateChange': (e) => {
        this.onStateChangeHandler(e);
      }
      // 'onStateChange': this.onStateChangeHandler(),
    };

    this.id = this.selector.replace('#', '')

    window.addEventListener('load', (e) => {
      this.objectFit(e);
    });
    window.addEventListener('resize', (e) => {
      this.objectFit(e);
    });
    window.addEventListener('scroll', (e) => {
      this.objectFit(e);
    });
  }

  run() {
    this.player = new YT.Player(this.id, this.ytOption);
  }

  onReadyHandler(e) {
    this.$elms.iframe = e.target.getIframe();
    this.$elms.parent = this.$elms.iframe.parentNode;
    // const $poster = $parent.querySelector('img');
    // const $palyBtn = $parent.nextElementSibling;
    if (this.ytOption.playerVars.autoplay) {
      new Promise((resolve, reject) => {
        this.objectFit();
        e.target.mute().playVideo();
        resolve();
      });
    }
  }

  onStateChangeHandler(e) {
    switch (e.data) {
      case YT.PlayerState.PLAYING:
        this.$elms.parent.classList.add('is-playing');
        break;
      case YT.PlayerState.PAUSED:
        this.$elms.parent.classList.add('is-paused');
        break;
      case YT.PlayerState.ENDED:
        if(this.settings.loop) e.target.playVideo();
        break;
      default:
        break;
    }
  }

  objectFit(e) {
    if (!this.settings.objectFit || !this.$elms.iframe) return;
    const $parent = this.$elms.iframe.parentNode;
    const parentAspectRatio = $parent.clientWidth / $parent.clientHeight;

    let width, height, transform;

    if (this.settings.objectFit === 'cover') {
      if (parentAspectRatio >= this.settings.aspectRatio) {
        width = $parent.clientWidth;
        height = $parent.clientWidth / this.settings.aspectRatio;
        transform = `translateY(${($parent.clientHeight - height) / 2}px)`;
      } else {
        width = $parent.clientHeight * this.settings.aspectRatio;
        height = $parent.clientHeight;
        transform = `translateX(-${(width - $parent.clientWidth) / 2 / width * 100}%)`;
      }
    } else if (this.settings.objectFit === 'contain') {
      if (parentAspectRatio > this.settings.aspectRatio) {
        width = $parent.clientHeight * this.settings.aspectRatio;
        height = $parent.clientHeight;
        transform = `translateX(${($parent.clientWidth - width) / 2}px)`;
      } else {
        width = $parent.clientWidth;
        height = $parent.clientHeight / this.settings.aspectRatio;
        transform = `translateY(${($parent.clientHeight - height) / 2}px)`;
      }
    }

    this.$elms.iframe.style.position = 'absolute';
    this.$elms.iframe.style.top = 0;
    this.$elms.iframe.style.left = 0;
    this.$elms.iframe.style.width = `${width}px`;
    this.$elms.iframe.style.height = `${height}px`;
    this.$elms.iframe.style.transform = transform;
  }

}
