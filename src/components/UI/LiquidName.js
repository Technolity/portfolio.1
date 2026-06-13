import React, { useEffect, useRef } from 'react';
import '../../styles/LiquidName.css';

/* ============================================================
   LIQUID NAME — raw-WebGL cursor-radial fluid displacement.
   Ported 1:1 from waris-webgl.html. The white name renders as a
   liquid surface; the red role sits underneath, hidden at rest.
   Under the cursor the white continuously flows AWAY (keeps
   streaming even when the cursor is still), exposing the red where
   the white has physically displaced — neither layer ever fades.

   Adapted for in-page use: the context is alpha:true and the buffer
   is cleared transparent (blend off, single quad), so the effect
   composites over the hero backdrop instead of a black box.

   TUNING (exposed as props):
     • strength  → how FAR the white flees the cursor (drives the reveal)
     • radius    → how WIDE the disturbance reaches around the cursor
   ============================================================ */

const VERT = `
attribute vec2 p; varying vec2 vUv;
void main(){ vUv = p*0.5+0.5; gl_Position = vec4(p,0.0,1.0); }`;

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uName, uRole;
uniform vec2  uMouse;
uniform float uHover;
uniform float uTime;
uniform float uAspect;
uniform float uRadius;
uniform float uStrength;
uniform float uIntro;     // 1 at load -> 0 (liquid "forming" animation)

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
float noise(vec2 p){
  vec2 i=floor(p), f=fract(p);
  float a=hash(i), b=hash(i+vec2(1.,0.)), c=hash(i+vec2(0.,1.)), d=hash(i+vec2(1.,1.));
  vec2 u=f*f*(3.-2.*f);
  return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
}

void main(){
  vec2 uv = vUv;
  vec2 toM = uv - uMouse;
  // a touch less aspect weighting so the wide word clears more fully across
  float d  = length(vec2(toM.x*uAspect*0.82, toM.y));
  vec2 away = normalize(toM + 1e-5);

  float strm = noise(uv*4.0 + uTime*0.8) + 0.5*noise(uv*9.0 - uTime*0.6);

  // Wider, fuller flee so the red word reads clearly under the cursor.
  // 'damp' calms only a tiny dot at the exact cursor so it doesn't pinch;
  // the noise term is gentle now so the parting is liquid but not a folded swirl.
  float near = exp(-(d*d)/(uRadius*uRadius));
  float damp = smoothstep(0.0, uRadius*0.12, d);
  float amt  = uHover * uStrength * (0.55 + 1.15*near) * damp * (0.9 + 0.18*strm);
  vec2  disp = away * amt;

  // ---- load intro: a liquid ripple that settles so the name forms from fluid
  float wob = sin(uv.x*6.5 + uTime*4.5 + uv.y*5.0) * 0.5 + (noise(uv*5.0 + uTime*1.3) - 0.5);
  disp += vec2(0.28, 1.0) * (uIntro * 0.13 * wob);

  vec4 nameC = texture2D(uName, uv - disp);    // white liquid flowing away
  vec4 roleC = texture2D(uRole, uv);           // red STATIC base, crisp

  float nameA = nameC.a;            // NO fade
  float roleA = roleC.a * uHover;   // armed on hover, full color

  vec3 col = vec3(0.0);
  col = mix(col, roleC.rgb, roleA);
  col = mix(col, nameC.rgb, nameA);
  gl_FragColor = vec4(col, max(nameA, roleA));
}`;

export default function LiquidName({
  name = 'WARIS RAWA',
  role = 'DEVELOPER',
  inkColor = '#f3f1e9',
  redColor = '#E50914',
  radius = 0.6,
  strength = 0.28,
  fontFamily = 'Anton',
  renderWidth = 1100,
  renderHeight = 440,
  nameSize = 150,
  roleSize = 118,
  roleSpacing = 10,
  active = true,
  className = '',
}) {
  const canvasRef = useRef(null);
  const activeRef = useRef(active);

  // Track `active` without re-initialising the GL context.
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2); // crisp on HiDPI
    const W = Math.round(renderWidth * dpr);
    const H = Math.round(renderHeight * dpr);
    canvas.width = W;
    canvas.height = H;

    const GL_OPTS = { alpha: true, premultipliedAlpha: false, antialias: true };
    let gl = canvas.getContext('webgl', GL_OPTS) || canvas.getContext('experimental-webgl', GL_OPTS);
    if (!gl) return undefined;

    let prog = null;
    let buf = null;
    let texName = null;
    let texRole = null;
    let raf = 0;
    let t0 = performance.now();
    let introStart = null; // set on the first frame; the liquid intro plays once
    let lost = false;
    let inView = true;
    let running = false;

    let mouse = [-1, -1];
    let hover = 0;
    let target = 0;

    const compile = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        // eslint-disable-next-line no-console
        console.error('LiquidName shader:', gl.getShaderInfoLog(s));
      }
      return s;
    };

    const U = (n) => gl.getUniformLocation(prog, n);

    /* draw a word onto a 2D canvas, upload as a texture. Centered with
       transparent margins so displaced sampling past the glyphs returns
       transparent (CLAMP_TO_EDGE on a clear edge = no smear). */
    const textTex = (text, color, size, spacing) => {
      const o = document.createElement('canvas');
      o.width = W;
      o.height = H;
      const x = o.getContext('2d');
      x.clearRect(0, 0, W, H);
      x.fillStyle = color;
      x.textAlign = 'center';
      x.textBaseline = 'middle';
      if ('letterSpacing' in x) x.letterSpacing = `${(spacing || 0) * dpr}px`;
      x.font = `${size * dpr}px "${fontFamily}", system-ui, sans-serif`;
      x.fillText(text, W / 2, H / 2);
      const t = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, o);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      return t;
    };

    const initGL = () => {
      prog = gl.createProgram();
      gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      gl.useProgram(prog);

      buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, 'p');
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

      texName = textTex(name, inkColor, nameSize, 0);
      texRole = textTex(role, redColor, roleSize, roleSpacing);
      gl.uniform1i(U('uName'), 0);
      gl.uniform1i(U('uRole'), 1);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texName);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, texRole);
      gl.uniform1f(U('uAspect'), renderWidth / renderHeight);
      gl.uniform1f(U('uRadius'), radius);
      gl.uniform1f(U('uStrength'), strength);
    };

    const render = (now) => {
      if (lost) return;
      // the liquid intro begins only once the hero is live (not while the
      // name is still hidden behind the boot loader)
      if (introStart === null && activeRef.current) introStart = now;
      const intro =
        reduce || introStart === null ? 0 : Math.max(0, 1 - (now - introStart) / 1500);
      hover += (target - hover) * 0.1;
      gl.uniform1f(U('uHover'), reduce ? target * 0.4 : hover);
      gl.uniform1f(U('uTime'), reduce ? 0.0 : (now - t0) / 1000);
      gl.uniform1f(U('uIntro'), intro);
      gl.uniform2f(U('uMouse'), mouse[0], mouse[1]);
      gl.viewport(0, 0, W, H);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(render);
    };

    const startLoop = () => {
      if (running || lost || !inView) return;
      running = true;
      t0 = performance.now();
      raf = requestAnimationFrame(render);
    };
    const stopLoop = () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    /* ---- pointer (works for mouse + touch via pointer events) ---- */
    const onEnter = () => { target = 1; };
    const onLeave = () => { target = 0; };
    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      mouse = [(e.clientX - r.left) / r.width, 1.0 - (e.clientY - r.top) / r.height];
      target = 1; // touch has no hover — moving arms the flow
    };
    canvas.addEventListener('pointerenter', onEnter);
    canvas.addEventListener('pointerleave', onLeave);
    canvas.addEventListener('pointercancel', onLeave);
    canvas.addEventListener('pointermove', onMove);

    /* ---- context loss / restore ---- */
    const onLost = (e) => {
      e.preventDefault();
      lost = true;
      stopLoop();
    };
    const onRestored = () => {
      gl = canvas.getContext('webgl', GL_OPTS) || canvas.getContext('experimental-webgl', GL_OPTS);
      if (!gl) return;
      lost = false;
      initGL();
      startLoop();
    };
    canvas.addEventListener('webglcontextlost', onLost, false);
    canvas.addEventListener('webglcontextrestored', onRestored, false);

    /* ---- pause the loop while off-screen ---- */
    let io = null;
    if (typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(
        ([entry]) => {
          inView = entry.isIntersecting;
          if (inView) startLoop();
          else stopLoop();
        },
        { rootMargin: '120px' }
      );
      io.observe(canvas);
    }

    /* ---- boot: load the font, then build + run ---- */
    let cancelled = false;
    const begin = () => {
      if (cancelled || lost) return;
      initGL();
      startLoop();
    };
    if (document.fonts && document.fonts.load) {
      document.fonts.load(`${nameSize}px "${fontFamily}"`).then(begin).catch(begin);
    } else {
      begin();
    }

    return () => {
      cancelled = true;
      stopLoop();
      if (io) io.disconnect();
      canvas.removeEventListener('pointerenter', onEnter);
      canvas.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('pointercancel', onLeave);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('webglcontextlost', onLost);
      canvas.removeEventListener('webglcontextrestored', onRestored);
      if (gl) {
        if (texName) gl.deleteTexture(texName);
        if (texRole) gl.deleteTexture(texRole);
        if (buf) gl.deleteBuffer(buf);
        if (prog) gl.deleteProgram(prog);
      }
    };
  }, [
    name,
    role,
    inkColor,
    redColor,
    radius,
    strength,
    fontFamily,
    renderWidth,
    renderHeight,
    nameSize,
    roleSize,
    roleSpacing,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className={`liquid-name ${className}`.trim()}
      style={{ aspectRatio: `${renderWidth} / ${renderHeight}` }}
      role="img"
      aria-label={`${name} — ${role}`}
    />
  );
}
