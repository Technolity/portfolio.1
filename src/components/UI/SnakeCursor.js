import { useEffect, useRef } from 'react';
import { isTouch } from '../../utils/deviceCapabilities';

/* ============================================================
   GLOBAL SNAKE CURSOR
   Fixed canvas overlay — covers the entire page.
   Dispatches 'snakemove' CustomEvent so RepelText components
   can read the viewport-relative head coordinates.
   ============================================================ */

const SEGS   = 32;
const LEAD   = 0.20;   // head tracking speed
const FOLLOW = 0.19;   // segment spring

const SnakeCursor = () => {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Segments in VIEWPORT coordinates (fixed canvas)
    const segs  = Array.from({ length: SEGS }, () => ({ x: -600, y: -600 }));
    let mouse   = { x: -600, y: -600 };
    let entered = false;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const touch = isTouch();

    const setPointer = (x, y) => {
      mouse.x = x;
      mouse.y = y;
      if (!entered) {
        segs.forEach(s => { s.x = mouse.x; s.y = mouse.y; });
        entered = true;
      }
    };

    const onMouseMove = (e) => setPointer(e.clientX, e.clientY);
    // Touch drives the same spring + snakemove event so the fixed
    // canvas and the repel effect come alive on phones/tablets.
    const onTouchMove = (e) => {
      const t = e.touches[0];
      if (t) setPointer(t.clientX, t.clientY);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('touchstart', onTouchMove, { passive: true });
    document.addEventListener('touchmove', onTouchMove, { passive: true });

    // Hide native cursor only where there is one (not on touch screens)
    if (!touch) document.body.style.cursor = 'none';

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (entered && segs[0].x > -500) {
        // Update spring chain
        segs[0].x += (mouse.x - segs[0].x) * LEAD;
        segs[0].y += (mouse.y - segs[0].y) * LEAD;
        for (let i = 1; i < SEGS; i++) {
          segs[i].x += (segs[i - 1].x - segs[i].x) * FOLLOW;
          segs[i].y += (segs[i - 1].y - segs[i].y) * FOLLOW;
        }

        // Body — tapered width + alpha fade toward tail
        for (let i = 0; i < SEGS - 1; i++) {
          const t = 1 - i / SEGS;
          ctx.beginPath();
          ctx.moveTo(segs[i].x, segs[i].y);
          ctx.lineTo(segs[i + 1].x, segs[i + 1].y);
          ctx.strokeStyle = `rgba(200,16,46,${t * 0.85})`;
          ctx.lineWidth   = t * 5.5 + 1.2;
          ctx.lineCap     = 'round';
          ctx.stroke();
        }

        // Head
        ctx.fillStyle = '#C8102E';
        ctx.beginPath();
        ctx.arc(segs[0].x, segs[0].y, 5, 0, Math.PI * 2);
        ctx.fill();

        // Eyes oriented toward movement direction
        if (SEGS > 1) {
          const dx  = segs[0].x - segs[1].x;
          const dy  = segs[0].y - segs[1].y;
          const len = Math.sqrt(dx * dx + dy * dy) || 1;
          const nx  = dx / len;
          const ny  = dy / len;
          const px  = -ny;
          const py  =  nx;

          ctx.fillStyle = '#080808';
          ctx.beginPath();
          ctx.arc(segs[0].x + px * 2.2 + nx * 2.5, segs[0].y + py * 2.2 + ny * 2.5, 1.5, 0, Math.PI * 2);
          ctx.arc(segs[0].x - px * 2.2 + nx * 2.5, segs[0].y - py * 2.2 + ny * 2.5, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Broadcast head position so RepelText can respond
        window.dispatchEvent(new CustomEvent('snakemove', {
          detail: { x: segs[0].x, y: segs[0].y },
        }));
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('touchstart', onTouchMove);
      document.removeEventListener('touchmove', onTouchMove);
      document.body.style.cursor = '';
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 8888,
      }}
      aria-hidden="true"
    />
  );
};

export default SnakeCursor;
