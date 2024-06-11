import SectionOverlap from "../../js/modules/section-overlap.v2.js";

const SOL_01 = new SectionOverlap("#SOL_01", {
  keepRatio: 0.8
});


window.addEventListener('DOMContentLoaded', (e)=>{
  SOL_01.handleWindowReady(e);
})

window.addEventListener('load', (e)=>{
  SOL_01.handleWindowLoad(e);
})

window.addEventListener('resize', (e)=>{
  SOL_01.handleWindowResize(e);
})

window.addEventListener('scroll', (e)=>{
  SOL_01.handleWindowScroll(e);
})