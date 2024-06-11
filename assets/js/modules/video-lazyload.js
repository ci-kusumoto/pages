import { isDevice, offset } from "./utility.js";

export default class VideoLazyload {

  constructor(_args = {}) {
    this.settings = {
      ...{
        video: 'video',
        audioBtn: '.c-audio-btn'
      }
    }
    this.videoAll = document.querySelectorAll(this.settings.video);
    this.audioBtnAll = document.querySelectorAll(this.settings.audioBtn);
    this.datas = [];

    this.init();
  }

  init() {
    this.videoAll.forEach((video, i) => {
      const data = {};
      data.src = (!isDevice('PC')) ? video.dataset.src : video.dataset.src.replace('@sp', '@pc');
      data = {
        top: offset(video).top,
        left: offset(video).left,
        right: offset(video).right,
        bottom: offset(video).bottom,
      }
      this.datas.push(data);

    });

    this.audioToggle();
  }

  playVideo(video, i) {
    if (!video.getAttribute('src')) video.src = datas[i].src;
    if (video.played > 0 && !video.paused) video.play();
  }

  audioToggle() {
    this.audioBtnAll.forEach((btn, i) => {
      btn.addEventListener('click', (e) => {
        let parent = e.target.closest('.pg-product__mv');
        let video = parent.getElementsByTagName('video')[0];
        if (!btn.classList.contains('is-active')) {
          btn.classList.add('is-active');
          video.muted = false;
        } else {
          btn.classList.remove('is-active');
          video.muted = true;
        }
      });
    });
  }
}