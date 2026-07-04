import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

/* ============================================================
   LOGO 3D — the Technolity emblem as a real mesh.

   Brushed-silver metal, lit by a cursor-tracked SPOTLIGHT
   (a soft cone of light that follows the pointer across the
   face). Click → the emblem fractures into fragments that
   fall and settle like debris; click the debris → it flies
   back together. No entrance zoom: it appears at full size.

   Perf: frameloop="demand" — renders only while the pointer
   moves or a break/assemble animation is running.
   ============================================================ */

const GLB_URL = '/models/technolity-logo.glb';

const SILVER = new THREE.Color('#d8d6d3');
const FLOOR_Y = -1.35; // debris rest line — still inside the camera frame
const GRID = [4, 4, 2]; // fragment partition (≤32 pieces)

/* Partition the emblem's triangles into grid-cell fragments, each
   with its own pivot, so the one GLB mesh can shatter physically.
   Exported: the boot loader assembles the same fragments. */
export function buildFragments(scene) {
  const source = [];
  scene.traverse((o) => {
    if (o.isMesh) source.push(o);
  });
  if (!source.length) return [];

  /* merge every mesh's world-space triangles */
  const tris = []; // [{verts: Float32Array(9), centroid: Vector3}]
  const v = new THREE.Vector3();
  source.forEach((mesh) => {
    mesh.updateWorldMatrix(true, false);
    const geo = mesh.geometry.index
      ? mesh.geometry.toNonIndexed()
      : mesh.geometry;
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i += 3) {
      const verts = new Float32Array(9);
      const centroid = new THREE.Vector3();
      for (let k = 0; k < 3; k++) {
        v.fromBufferAttribute(pos, i + k).applyMatrix4(mesh.matrixWorld);
        verts[k * 3] = v.x;
        verts[k * 3 + 1] = v.y;
        verts[k * 3 + 2] = v.z;
        centroid.add(v);
      }
      centroid.multiplyScalar(1 / 3);
      tris.push({ verts, centroid });
    }
  });

  /* normalize the whole emblem to a ~2.9-unit body centred on origin */
  const box = new THREE.Box3();
  tris.forEach((t) => box.expandByPoint(t.centroid));
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const scale = 2.9 / Math.max(size.x, size.y, size.z);

  /* bucket triangles into grid cells */
  const cells = new Map();
  tris.forEach((t) => {
    const ix = Math.min(
      GRID[0] - 1,
      Math.floor(((t.centroid.x - box.min.x) / (size.x || 1)) * GRID[0])
    );
    const iy = Math.min(
      GRID[1] - 1,
      Math.floor(((t.centroid.y - box.min.y) / (size.y || 1)) * GRID[1])
    );
    const iz = Math.min(
      GRID[2] - 1,
      Math.floor(((t.centroid.z - box.min.z) / (size.z || 1)) * GRID[2])
    );
    const key = `${ix},${iy},${iz}`;
    if (!cells.has(key)) cells.set(key, []);
    cells.get(key).push(t);
  });

  /* one geometry per cell, pivot at the cell's own centroid */
  const fragments = [];
  cells.forEach((cellTris) => {
    const pivot = new THREE.Vector3();
    cellTris.forEach((t) => pivot.add(t.centroid));
    pivot.multiplyScalar(1 / cellTris.length).sub(center).multiplyScalar(scale);

    const arr = new Float32Array(cellTris.length * 9);
    cellTris.forEach((t, ti) => {
      for (let k = 0; k < 3; k++) {
        arr[ti * 9 + k * 3] =
          (t.verts[k * 3] - center.x) * scale - pivot.x;
        arr[ti * 9 + k * 3 + 1] =
          (t.verts[k * 3 + 1] - center.y) * scale - pivot.y;
        arr[ti * 9 + k * 3 + 2] =
          (t.verts[k * 3 + 2] - center.z) * scale - pivot.z;
      }
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(arr, 3));
    geo.computeVertexNormals();
    fragments.push({ geo, rest: pivot.clone() });
  });
  return fragments;
}

function Emblem() {
  const { scene } = useGLTF(GLB_URL);
  const invalidate = useThree((s) => s.invalidate);
  const spotRef = useRef(null);
  const groupRef = useRef(null);
  const meshRefs = useRef([]);

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

  /* per-fragment physics state */
  const world = useRef({
    mode: 'whole', // whole | breaking | assembling
    spot: 0, // eased spotlight intensity 0..1
    spotTarget: 0,
    rx: 0, ry: 0, tx: 0, ty: 0, // eased tilt
    t: 0, // assembling progress
    pieces: fragments.map((f) => ({
      pos: f.rest.clone(),
      rot: new THREE.Euler(0, 0, 0),
      vel: new THREE.Vector3(),
      spin: new THREE.Vector3(),
      from: f.rest.clone(),
      fromRot: new THREE.Euler(0, 0, 0),
      rest: f.rest,
      settled: false,
    })),
  });

  useEffect(() => () => {
    material.dispose();
    fragments.forEach((f) => f.geo.dispose());
  }, [material, fragments]);

  /* pointer: spotlight position + gentle tilt; click: break/assemble */
  useEffect(() => {
    const el = document.querySelector('.hero-logostage');
    if (!el) return undefined;
    const w = world.current;

    const move = (e) => {
      const r = el.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
      w.ty = nx;
      w.tx = ny;
      w.spotTarget = 1;
      if (spotRef.current) {
        spotRef.current.position.set(nx * 2.6, -ny * 2.2, 3.4);
      }
      invalidate();
    };
    const leave = () => {
      w.spotTarget = 0;
      w.tx = 0;
      w.ty = 0;
      invalidate();
    };
    const announce = (mode) => {
      window.dispatchEvent(
        new CustomEvent('technolity:logo3d', { detail: { mode } })
      );
    };

    const click = (e) => {
      /* the revealed card owns its own clicks (links, tilt) — only
         clicks OUTSIDE it (debris / empty stage) reassemble */
      if (
        e.target &&
        e.target.closest &&
        (e.target.closest('a') || e.target.closest('.contact-card'))
      ) {
        return;
      }
      if (w.mode === 'whole') {
        w.mode = 'breaking';
        announce('breaking');
        w.pieces.forEach((p) => {
          p.settled = false;
          const out = p.rest.clone().normalize();
          p.vel.set(
            out.x * (1.2 + Math.random() * 1.6),
            0.8 + Math.random() * 1.4,
            out.z * (0.8 + Math.random()) + (Math.random() - 0.5)
          );
          p.spin.set(
            (Math.random() - 0.5) * 7,
            (Math.random() - 0.5) * 7,
            (Math.random() - 0.5) * 7
          );
        });
      } else if (w.mode === 'breaking') {
        w.mode = 'assembling';
        announce('assembling');
        w.t = 0;
        w.pieces.forEach((p) => {
          p.from.copy(p.pos);
          p.fromRot.copy(p.rot);
        });
      }
      invalidate();
    };

    el.addEventListener('mousemove', move);
    el.addEventListener('mouseleave', leave);
    el.addEventListener('click', click);
    return () => {
      el.removeEventListener('mousemove', move);
      el.removeEventListener('mouseleave', leave);
      el.removeEventListener('click', click);
    };
  }, [invalidate]);

  useFrame((_, delta) => {
    const w = world.current;
    const dt = Math.min(delta, 0.05);
    let active = false;

    /* eased spotlight + tilt */
    w.spot += (w.spotTarget - w.spot) * 0.1;
    if (Math.abs(w.spotTarget - w.spot) > 0.004) active = true;
    if (spotRef.current) {
      spotRef.current.intensity = w.spot * 26;
    }
    w.rx += (w.tx * 0.22 - w.rx) * 0.08;
    w.ry += (w.ty * 0.38 - w.ry) * 0.08;
    if (
      Math.abs(w.rx - w.tx * 0.22) > 0.001 ||
      Math.abs(w.ry - w.ty * 0.38) > 0.001
    ) {
      active = true;
    }
    if (groupRef.current && w.mode === 'whole') {
      groupRef.current.rotation.x = w.rx;
      groupRef.current.rotation.y = w.ry;
    }

    /* fragment physics */
    if (w.mode === 'breaking') {
      let allSettled = true;
      w.pieces.forEach((p, i) => {
        if (p.settled) return;
        allSettled = false;
        p.vel.y -= 7.5 * dt; // gravity
        p.pos.addScaledVector(p.vel, dt);
        p.rot.x += p.spin.x * dt;
        p.rot.y += p.spin.y * dt;
        p.rot.z += p.spin.z * dt;
        if (p.pos.y <= FLOOR_Y) {
          p.pos.y = FLOOR_Y;
          if (Math.abs(p.vel.y) > 0.9) {
            p.vel.y *= -0.28; // one soft bounce
            p.vel.x *= 0.6;
            p.spin.multiplyScalar(0.5);
          } else {
            p.settled = true;
          }
        }
        const m = meshRefs.current[i];
        if (m) {
          m.position.copy(p.pos);
          m.rotation.copy(p.rot);
        }
      });
      if (!allSettled) active = true;
    } else if (w.mode === 'assembling') {
      w.t = Math.min(1, w.t + dt / 1.15);
      const e = 1 - Math.pow(1 - w.t, 3); // ease-out cubic
      w.pieces.forEach((p, i) => {
        p.pos.lerpVectors(p.from, p.rest, e);
        p.rot.set(
          p.fromRot.x * (1 - e),
          p.fromRot.y * (1 - e),
          p.fromRot.z * (1 - e)
        );
        const m = meshRefs.current[i];
        if (m) {
          m.position.copy(p.pos);
          m.rotation.copy(p.rot);
        }
      });
      if (w.t >= 1) {
        w.mode = 'whole';
        w.pieces.forEach((p) => {
          p.pos.copy(p.rest);
          p.rot.set(0, 0, 0);
          p.vel.set(0, 0, 0);
        });
        window.dispatchEvent(
          new CustomEvent('technolity:logo3d', { detail: { mode: 'whole' } })
        );
      }
      active = true;
    }

    if (active) invalidate();
  });

  return (
    <>
      {/* base ambience keeps the silver readable at rest */}
      <ambientLight intensity={0.55} />
      <directionalLight position={[2, 4, 5]} intensity={0.55} color="#F2F0ED" />
      {/* crimson rim from behind-left — the brand glow */}
      <pointLight position={[-3, 1.5, -2.5]} intensity={1.1} color="#C8102E" distance={14} />
      {/* the cursor-tracked spotlight: a soft cone raking the face */}
      <spotLight
        ref={spotRef}
        angle={0.42}
        penumbra={0.85}
        intensity={0}
        distance={16}
        color="#ffffff"
        position={[0, 0, 3.4]}
      />
      <group ref={groupRef}>
        {fragments.map((f, i) => (
          <mesh
            key={i}
            ref={(m) => {
              meshRefs.current[i] = m;
              if (m) m.position.copy(f.rest);
            }}
            geometry={f.geo}
            material={material}
          />
        ))}
      </group>
    </>
  );
}

const Logo3D = () => (
  <Canvas
    dpr={[1, 1.5]}
    frameloop="demand"
    gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    camera={{ position: [0, 0, 4.6], fov: 38, near: 0.1, far: 30 }}
    style={{ width: '100%', height: '100%' }}
  >
    <Emblem />
  </Canvas>
);

useGLTF.preload(GLB_URL);

export default Logo3D;
