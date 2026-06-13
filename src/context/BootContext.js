import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import '../styles/BootLoader.css';

/* ============================================================
   BOOT CONTEXT — film boot sequence for the whole portfolio.
   A terminal log types out → ignite() flash → the hero
   assembles. Plays once per browser session (skippable with
   click / Esc / Enter / Space); a "replay intro" control
   re-runs it. Reduced-motion skips straight to the live state.

   The shared `phase` ('boot' | 'ignite' | 'live') is consumed
   by HeroCinematic to drive its reveal animations.
   ============================================================ */

const BootContext = createContext({ phase: 'live', replay: () => {} });
export const useBoot = () => useContext(BootContext);

const BOOT_LINES = [
  { t: '> booting technolity runtime  v2.6', s: 'ok' },
  { t: '> mounting modules · backend · automation · ai', s: 'ok' },
  { t: '> compiling hero shaders ............. done', s: 'ok' },
  { t: '> resolving identity → input("Waris Rawa")', s: 'rd' },
  { t: '> ignite()', s: 'rd' },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export function BootProvider({ children, lenisRef }) {
  const reduced =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Play the film intro on EVERY load/refresh (only reduced-motion skips it).
  const [phase, setPhase] = useState(reduced ? 'live' : 'boot');
  const [shown, setShown] = useState([]); // completed line indices
  const [cur, setCur] = useState(''); // partial current line
  const [replayN, setReplayN] = useState(0);

  /* ---- the boot sequence ---- */
  useEffect(() => {
    let cancelled = false;
    const skip = reduced;

    async function run() {
      if (skip) {
        setPhase('live');
        return;
      }
      setPhase('boot');
      setShown([]);
      setCur('');
      await sleep(360);
      for (let i = 0; i < BOOT_LINES.length; i++) {
        const line = BOOT_LINES[i].t;
        const speed = line.length > 32 ? 11 : 17;
        for (let c = 1; c <= line.length; c++) {
          if (cancelled) return;
          setCur(line.slice(0, c));
          await sleep(speed);
        }
        if (cancelled) return;
        setShown((s) => [...s, i]);
        setCur('');
        await sleep(BOOT_LINES[i].s === 'rd' ? 240 : 110);
      }
      await sleep(180);
      if (cancelled) return;
      setPhase('ignite');
      await sleep(720);
      if (cancelled) return;
      setPhase('live');
      try {
        window.sessionStorage.setItem('wr_intro', '1');
      } catch (e) {
        /* private mode — ignore */
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [replayN]);

  /* ---- skip + replay ---- */
  const skipNow = useCallback(() => {
    setPhase((p) => {
      if (p !== 'live') {
        try {
          window.sessionStorage.setItem('wr_intro', '1');
        } catch (e) {
          /* ignore */
        }
        return 'live';
      }
      return p;
    });
  }, []);

  const replay = useCallback(() => {
    try {
      window.sessionStorage.removeItem('wr_intro');
    } catch (e) {
      /* ignore */
    }
    setShown([]);
    setCur('');
    setReplayN((n) => n + 1);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Enter' || e.key === 'Escape' || e.key === ' ') skipNow();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [skipNow]);

  /* ---- lock scrolling until the hero is live ---- */
  useEffect(() => {
    const locked = phase !== 'live';
    const lenis = lenisRef && lenisRef.current;
    if (locked) {
      document.body.classList.add('boot-locked');
      window.scrollTo(0, 0);
      if (lenis && lenis.stop) lenis.stop();
    } else {
      document.body.classList.remove('boot-locked');
      if (lenis && lenis.start) lenis.start();
    }
    return () => document.body.classList.remove('boot-locked');
  }, [phase, lenisRef]);

  return (
    <BootContext.Provider value={{ phase, replay }}>
      {children}

      {phase !== 'live' && (
        <div
          className={`boot-loader boot-${phase}`}
          onClick={skipNow}
          role="presentation"
        >
          <div className="boot-scanflash" aria-hidden="true" />
          <div className="boot-grid" aria-hidden="true" />
          <div className="boot-inner" aria-label="Boot sequence">
            {shown.map((i) => {
              const L = BOOT_LINES[i];
              return (
                <div className="boot-line" key={i}>
                  <span className={L.s === 'rd' ? 'rd' : ''}>{L.t}</span>
                  {L.s === 'ok' && (
                    <span className="mut">
                      {'   [ '}
                      <span className="ok">ok</span>
                      {' ]'}
                    </span>
                  )}
                </div>
              );
            })}
            {phase === 'boot' && (
              <div className="boot-line">
                <span
                  className={
                    BOOT_LINES[shown.length] &&
                    BOOT_LINES[shown.length].s === 'rd'
                      ? 'rd'
                      : ''
                  }
                >
                  {cur}
                </span>
                <span className="boot-cursor" />
              </div>
            )}
          </div>
          <div className="boot-skip">click · esc to skip</div>
        </div>
      )}
    </BootContext.Provider>
  );
}
