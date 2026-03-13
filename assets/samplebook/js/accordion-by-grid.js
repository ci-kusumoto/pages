/**
 *
 * @param {string} triggerSelector
 * @param {string} targetSelector
 * @param {{event:string; mode: "key" | "index"; onSync: ()=>{};}} options
 * @returns
 */
function bindSync(triggerSelector, targetSelector, options = {}) {
  const { event = "click", mode = "key", onSync = () => {} } = options;

  const triggers = Array.from(document.querySelectorAll(triggerSelector));
  const targets = Array.from(document.querySelectorAll(targetSelector));

  if (!triggers.length || !targets.length) return;

  triggers.forEach((trigger, index) => {
    trigger.addEventListener(event, (e) => {
      let matchedTarget = null;
      let key = null;

      if (mode === "key") {
        key = trigger.dataset.key ?? null;
        matchedTarget =
          targets.find((target) => target.dataset.key === key) ?? null;
      }

      if (mode === "index") {
        matchedTarget = targets[index] ?? null;
      }

      onSync({
        trigger,
        target: matchedTarget,
        triggers,
        targets,
        index,
        key,
        event: e,
      });
    });
  });
}

const handleWindowReady = () => {
  bindSync(".js-accordion-trigger", ".js-accordion-item", {
    mode: "index",
    event: "click",
    onSync: ({ target }) => {
      target.classList.toggle("is-open");
    },
  });
};
const handleWindowLoad = () => {};
const handleWindowScroll = () => {};
const handleWindowResize = () => {};

window.addEventListener("DOMContentLoaded", handleWindowReady);
window.addEventListener("load", handleWindowLoad);
window.addEventListener("scroll", handleWindowScroll);
window.addEventListener("resize", handleWindowResize);
