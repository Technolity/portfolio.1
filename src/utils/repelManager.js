/* ============================================================
   REPEL MANAGER — singleton
   One snakemove listener + one RAF loop for the whole page.
   Instances register themselves; the manager does spatial
   culling at the instance level and caches page-absolute
   char positions so getBoundingClientRect is only called
   once per layout change (not every frame).
   ============================================================ */

const REPEL_RADIUS = 90;  // px
const REPEL_FORCE  = 28;  // px — max push at distance 0

class RepelInstance {
  constructor() {
    this._containerEl   = null;
    this._chars         = [];   // { el, px, py } — page-absolute centre
    this._bbox          = null; // null means cache is dirty
    this._displaced     = false;
  }

  setContainer(el) {
    this._containerEl = el;
    this._bbox = null;
  }

  setChars(els) {
    this._chars = els.map(el => ({ el, px: 0, py: 0 }));
    this._bbox  = null;
  }

  invalidate() {
    this._bbox = null;
  }

  /* ---- called once per layout change (not per frame) ---- */
  _buildCache() {
    if (!this._containerEl) return;
    const sx = window.scrollX;
    const sy = window.scrollY;

    /* Batch-read all char rects → page-absolute centres */
    this._chars.forEach(c => {
      if (!c.el) return;
      const r = c.el.getBoundingClientRect();
      c.px = r.left + r.width  * 0.5 + sx;
      c.py = r.top  + r.height * 0.5 + sy;
    });

    /* Instance bounding box for fast culling, padded by REPEL_RADIUS */
    const cr = this._containerEl.getBoundingClientRect();
    this._bbox = {
      minX: cr.left   + sx - REPEL_RADIUS,
      maxX: cr.right  + sx + REPEL_RADIUS,
      minY: cr.top    + sy - REPEL_RADIUS,
      maxY: cr.bottom + sy + REPEL_RADIUS,
    };
  }

  /* ---- called every RAF frame by the manager ---- */
  update(snakePageX, snakePageY) {
    if (!this._bbox) this._buildCache();
    if (!this._bbox) return;

    /* Spatial cull — skip the whole instance if snake is far away */
    if (
      snakePageX < this._bbox.minX || snakePageX > this._bbox.maxX ||
      snakePageY < this._bbox.minY || snakePageY > this._bbox.maxY
    ) {
      if (this._displaced) {
        this._displaced = false;
        this._chars.forEach(c => {
          if (c.el && c.el.style.transform) {
            c.el.style.transform  = '';
            c.el.style.transition = 'transform 0.45s cubic-bezier(0.16,1,0.3,1)';
          }
        });
      }
      return;
    }

    /* Fine-grained per-char repulsion */
    let anyDisplaced = false;
    this._chars.forEach(c => {
      if (!c.el) return;
      const dx   = c.px - snakePageX;
      const dy   = c.py - snakePageY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < REPEL_RADIUS && dist > 0) {
        anyDisplaced = true;
        const strength = (1 - dist / REPEL_RADIUS) * REPEL_FORCE;
        c.el.style.transform  = `translate(${(dx / dist) * strength}px,${(dy / dist) * strength}px)`;
        c.el.style.transition = 'transform 0.05s linear';
      } else if (c.el.style.transform) {
        c.el.style.transform  = '';
        c.el.style.transition = 'transform 0.45s cubic-bezier(0.16,1,0.3,1)';
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
    this._instances = new Set();
    this._svx  = -9999;  // snake viewport X
    this._svy  = -9999;  // snake viewport Y
    this._raf  = null;

    this._tick = () => {
      this._raf = null;
      const spx = this._svx + window.scrollX;
      const spy = this._svy + window.scrollY;
      this._instances.forEach(inst => inst.update(spx, spy));
    };

    this._onMove = ({ detail }) => {
      this._svx = detail.x;
      this._svy = detail.y;
      if (!this._raf) {
        this._raf = requestAnimationFrame(this._tick);
      }
    };

    this._onResize = () => {
      this._instances.forEach(inst => inst.invalidate());
    };

    window.addEventListener('snakemove', this._onMove,   { passive: true });
    window.addEventListener('resize',    this._onResize, { passive: true });
  }

  createInstance() {
    const inst = new RepelInstance();
    this._instances.add(inst);
    return inst;
  }

  destroyInstance(inst) {
    this._instances.delete(inst);
  }
}

export const repelManager = new RepelManager();
