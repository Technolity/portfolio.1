/* ============================================================
   REPEL MANAGER — singleton
   One snakemove listener + one RAF loop for the whole page.

   Coordinates are VIEWPORT-relative (same space as the snake
   head). Each frame we read ONE getBoundingClientRect per
   *visible* instance (its container) for culling; per-char
   positions are cached as container-RELATIVE offsets, so they
   stay correct inside transformed / pinned / scrubbed ancestors
   (e.g. the horizontally scrubbed Featured Projects track) and
   inside position:fixed elements (Navbar) without per-char
   re-measuring every frame.

   Performance gates (cheapest first):
     1. Disabled entirely on prefers-reduced-motion / coarse
        pointers (no listeners, instances are inert).
     2. IntersectionObserver — off-screen instances are a single
        boolean check per frame, zero DOM reads.
     3. Container bbox cull — snake outside the padded rect means
        no per-char work.
   ============================================================ */

const REPEL_RADIUS = 90;  // px
const REPEL_FORCE  = 28;  // px — max push at distance 0

const RELEASE_TRANSITION = 'transform 0.45s cubic-bezier(0.16,1,0.3,1)';

/* Same gating idea used elsewhere in the site (TechStack magnetic
   hover): no effect for reduced motion or touch-first devices. */
const isEnabled = () => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return (
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
    !window.matchMedia('(pointer: coarse)').matches
  );
};

class RepelInstance {
  constructor(manager) {
    this._manager      = manager;
    this._containerEl  = null;
    this._chars        = [];    // { el, rx, ry, ox, oy } — rx/ry container-relative centre
    this._cacheValid   = false;
    this._visible      = true;  // updated by the manager's IntersectionObserver
    this._displaced    = false;
  }

  setContainer(el) {
    if (el === this._containerEl) return;
    if (this._containerEl) this._manager._unobserve(this._containerEl);
    this._containerEl = el;
    this._cacheValid  = false;
    if (el) this._manager._observe(el, this);
  }

  setChars(els) {
    /* Only rebuild when the element list actually changed — this is
       called after every React commit (e.g. Navbar re-renders each
       second for its clock). */
    if (
      els.length === this._chars.length &&
      els.every((el, i) => el === this._chars[i].el)
    ) {
      return;
    }
    this._chars      = els.map((el) => ({ el, rx: 0, ry: 0, ox: 0, oy: 0 }));
    this._cacheValid = false;
  }

  invalidate() {
    this._cacheValid = false;
  }

  destroy() {
    if (this._containerEl) this._manager._unobserve(this._containerEl);
    this._containerEl = null;
    this._chars = [];
  }

  /* ---- rare: only on mount / resize / font load ---- */
  _buildCache(containerRect) {
    this._chars.forEach((c) => {
      if (!c.el) return;
      const r = c.el.getBoundingClientRect();
      /* Subtract any currently applied displacement so we cache the
         char's resting position, relative to the container. */
      c.rx = r.left + r.width  * 0.5 - c.ox - containerRect.left;
      c.ry = r.top  + r.height * 0.5 - c.oy - containerRect.top;
    });
    this._cacheValid = true;
  }

  _release() {
    if (!this._displaced) return;
    this._displaced = false;
    this._chars.forEach((c) => {
      if (c.el && (c.ox || c.oy)) {
        c.ox = 0;
        c.oy = 0;
        c.el.style.transform  = '';
        c.el.style.transition = RELEASE_TRANSITION;
      }
    });
  }

  /* ---- called every RAF frame by the manager (viewport coords) ---- */
  update(svx, svy) {
    if (!this._containerEl || this._chars.length === 0) return;

    /* Gate 2 — IntersectionObserver flag: off-screen costs one boolean */
    if (!this._visible) {
      this._release();
      return;
    }

    /* Gate 3 — single fresh container rect per frame. Fresh reads keep
       this correct inside transformed/pinned ancestors (horizontal
       scrub) and fixed elements. */
    const cr = this._containerEl.getBoundingClientRect();
    if (
      svx < cr.left  - REPEL_RADIUS || svx > cr.right  + REPEL_RADIUS ||
      svy < cr.top   - REPEL_RADIUS || svy > cr.bottom + REPEL_RADIUS
    ) {
      this._release();
      return;
    }

    if (!this._cacheValid) this._buildCache(cr);

    /* Fine-grained per-char repulsion — no DOM reads in this loop */
    let anyDisplaced = false;
    this._chars.forEach((c) => {
      if (!c.el) return;
      const dx   = cr.left + c.rx - svx;
      const dy   = cr.top  + c.ry - svy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < REPEL_RADIUS && dist > 0) {
        anyDisplaced = true;
        const strength = (1 - dist / REPEL_RADIUS) * REPEL_FORCE;
        c.ox = (dx / dist) * strength;
        c.oy = (dy / dist) * strength;
        c.el.style.transform  = `translate(${c.ox}px,${c.oy}px)`;
        c.el.style.transition = 'transform 0.05s linear';
      } else if (c.ox || c.oy) {
        c.ox = 0;
        c.oy = 0;
        c.el.style.transform  = '';
        c.el.style.transition = RELEASE_TRANSITION;
      }
    });
    this._displaced = anyDisplaced;
  }
}

/* ============================================================
   MANAGER
   ============================================================ */
class RepelManager {
  constructor() {
    this.enabled    = isEnabled();
    this._instances = new Set();
    this._byEl      = new Map();   // containerEl -> instance (for the IO)
    this._svx       = -9999;       // snake viewport X
    this._svy       = -9999;       // snake viewport Y
    this._raf       = null;
    this._io        = null;

    if (!this.enabled) return;     // Gate 1 — fully inert

    /* Shared IntersectionObserver: marks instances on/off screen so
       off-screen ones cost a single boolean check per frame. */
    if (typeof IntersectionObserver !== 'undefined') {
      this._io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const inst = this._byEl.get(entry.target);
            if (inst) inst._visible = entry.isIntersecting;
          });
        },
        { rootMargin: '128px' }
      );
    }

    this._tick = () => {
      this._raf = null;
      this._instances.forEach((inst) => inst.update(this._svx, this._svy));
    };

    this._onMove = ({ detail }) => {
      this._svx = detail.x;
      this._svy = detail.y;
      if (!this._raf) {
        this._raf = requestAnimationFrame(this._tick);
      }
    };

    this._onResize = () => {
      this._instances.forEach((inst) => inst.invalidate());
    };

    window.addEventListener('snakemove', this._onMove,   { passive: true });
    window.addEventListener('resize',    this._onResize, { passive: true });

    /* Web fonts swapping in reflows text — re-measure once they load */
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(() => {
        this._instances.forEach((inst) => inst.invalidate());
      });
    }
  }

  _observe(el, inst) {
    this._byEl.set(el, inst);
    if (this._io) {
      this._io.observe(el);
    } else {
      inst._visible = true;
    }
  }

  _unobserve(el) {
    this._byEl.delete(el);
    if (this._io) this._io.unobserve(el);
  }

  createInstance() {
    const inst = new RepelInstance(this);
    if (this.enabled) this._instances.add(inst);
    return inst;
  }

  destroyInstance(inst) {
    inst.destroy();
    this._instances.delete(inst);
  }
}

export const repelManager = new RepelManager();
