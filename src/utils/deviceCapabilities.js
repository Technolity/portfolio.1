/* ============================================================
   DEVICE CAPABILITIES — tiny shared probe
   Used by perf-sensitive components (HeroScene render budget,
   SnakeCursor / repelManager touch enablement) so the same
   decisions are made in one place. Cheap to call; matchMedia
   results are read live so rotation / resize stay correct.
   ============================================================ */

const mq = (q) =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia(q).matches;

/* Coarse pointer = touch-first device (phone / tablet) */
export const isTouch = () => mq('(pointer: coarse)');

/* Treat narrow viewports OR touch as "mobile" for render-budget
   purposes (a small laptop with a mouse stays full-fat). */
export const isMobile = () => isTouch() || mq('(max-width: 767px)');

export const prefersReducedMotion = () => mq('(prefers-reduced-motion: reduce)');

/* Best-effort low-power hint: few cores, little RAM, or the user
   asked the browser to save data. Defaults assume a capable device
   when the APIs are unavailable. */
export const isLowPower = () => {
  if (typeof navigator === 'undefined') return false;
  const cores = navigator.hardwareConcurrency || 8;
  const mem = navigator.deviceMemory || 8;
  const saveData = !!(navigator.connection && navigator.connection.saveData);
  return saveData || cores <= 4 || mem <= 4;
};
