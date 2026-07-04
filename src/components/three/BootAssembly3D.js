import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { buildFragments } from './Logo3D';

/* ============================================================
   BOOT ASSEMBLY — the real emblem mesh assembling from its own
   fragments while the boot log types. Same GLB + fragmenter as
   the hero's Logo3D (the parsed model is shared via drei's
   cache), so the object that builds itself here is literally
   the one that lands in the hero. Transparent canvas — no
   video, no background wash.

   Timeline (from mount): fragments start scattered on a wide
   sphere shell, fly in staggered over ~3.8s with ease-out, and
   the crimson rim swells as the emblem completes — timed to
   land just before ignite() fires.
   ============================================================ */

const GLB_URL = '/models/technolity-logo.glb';

const SILVER = new THREE.Color('#d8d6d3');
const ASSEMBLE_S = 3.8; // total assembly time
const STAGGER_S = 1.6; // spread of piece start times

/* deterministic pseudo-random (stable across renders) */
const rnd = (i, salt) => {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

function AssemblingEmblem() {
  const { scene } = useGLTF(GLB_URL);
  const rimRef = useRef(null);
  const meshRefs = useRef([]);
  const t0 = useRef(null);

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: SILVER,
        metalness: 0.88,
        roughness: 0.38,
      }),
    []
  );

  const fragments = useMemo(() => buildFragments(scene), [scene]);

  useEffect(
    () => () => {
      material.dispose();
      fragments.forEach((f) => f.geo.dispose());
    },
    [material, fragments]
  );

  /* scattered start pose per fragment: a point on a wide shell,
     biased outward from the piece's own rest direction */
  const scatter = useMemo(
    () =>
      fragments.map((f, i) => {
        const dir = f.rest.clone();
        if (dir.lengthSq() < 0.01) dir.set(rnd(i, 1) - 0.5, rnd(i, 2) - 0.5, 0.5);
        dir.normalize();
        const radius = 3.4 + rnd(i, 3) * 2.2;
        return {
          pos: new THREE.Vector3(
            dir.x * radius + (rnd(i, 4) - 0.5) * 1.6,
            dir.y * radius + (rnd(i, 5) - 0.5) * 1.6,
            dir.z * radius + (rnd(i, 6) - 0.5) * 2.4
          ),
          rot: new THREE.Euler(
            (rnd(i, 7) - 0.5) * 5,
            (rnd(i, 8) - 0.5) * 5,
            (rnd(i, 9) - 0.5) * 5
          ),
          start: (i / Math.max(1, fragments.length - 1)) * STAGGER_S,
        };
      }),
    [fragments]
  );

  useFrame((state) => {
    if (t0.current === null) t0.current = state.clock.elapsedTime;
    const t = state.clock.elapsedTime - t0.current;
    const flyTime = ASSEMBLE_S - STAGGER_S; // per-piece travel time

    let done = 0;
    fragments.forEach((f, i) => {
      const m = meshRefs.current[i];
      if (!m) return;
      const s = scatter[i];
      const k = Math.min(1, Math.max(0, (t - s.start) / flyTime));
      const e = 1 - Math.pow(1 - k, 3); // ease-out cubic
      m.position.lerpVectors(s.pos, f.rest, e);
      m.rotation.set(
        s.rot.x * (1 - e),
        s.rot.y * (1 - e),
        s.rot.z * (1 - e)
      );
      if (k >= 1) done += 1;
    });

    /* crimson rim swells as the emblem completes */
    if (rimRef.current) {
      const p = done / Math.max(1, fragments.length);
      rimRef.current.intensity = 0.6 + p * p * 2.6;
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 4, 5]} intensity={0.6} color="#F2F0ED" />
      <pointLight
        ref={rimRef}
        position={[-3, 1.5, -2.5]}
        intensity={0.6}
        color="#C8102E"
        distance={14}
      />
      {fragments.map((f, i) => (
        <mesh
          key={i}
          ref={(m) => {
            meshRefs.current[i] = m;
          }}
          geometry={f.geo}
          material={material}
        />
      ))}
    </>
  );
}

const BootAssembly3D = () => (
  <Canvas
    dpr={[1, 1.5]}
    gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    camera={{ position: [0, 0, 4.8], fov: 40, near: 0.1, far: 40 }}
    style={{ width: '100%', height: '100%' }}
  >
    <AssemblingEmblem />
  </Canvas>
);

useGLTF.preload(GLB_URL);

export default BootAssembly3D;
