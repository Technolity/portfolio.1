import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import HeroBackdrop from './HeroBackdrop';
import '../../styles/HeroScene.css';

/* ============================================================
   LIVING AUTOMATION GRAPH
   A 3D constellation of workflow nodes connected by thin
   edges, with crimson "data packets" travelling along the
   wires — like watching an n8n workflow run in the dark.
   ============================================================ */

const NODE_COUNT = 60;
const ACCENT_RATIO = 0.15;        // ~15% crimson nodes
const DEEP_RATIO = 0.4;           // of the rest: near-invisible depth dust
const NEAREST_LINKS = 2;          // edges per node (k-nearest)
const LONG_LINKS = 5;             // extra long-range connections
const PACKET_COUNT = 14;          // travelling data packets

const COLOR_WARM = new THREE.Color('#6f6a62');   // dim warm white (low ambient)
const COLOR_ACCENT = new THREE.Color('#C8102E'); // crimson

/* ---------- graph generation (pure, runs once) ---------- */
function buildGraph() {
  const positions = new Float32Array(NODE_COUNT * 3);
  const scales = new Float32Array(NODE_COUNT);
  const accents = new Array(NODE_COUNT).fill(false);
  const deeps = new Array(NODE_COUNT).fill(false);

  // Organic cloud: flattened ellipsoid, denser toward middle
  for (let i = 0; i < NODE_COUNT; i++) {
    const u = Math.random();
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = Math.cbrt(u); // bias toward center
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta) * 5.6;
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 3.1;
    positions[i * 3 + 2] = r * Math.cos(phi) * 2.6;
    scales[i] = 0.6 + Math.random();
    accents[i] = Math.random() < ACCENT_RATIO;
    // Depth dust: dim non-accent nodes receding into the fog
    if (!accents[i] && Math.random() < DEEP_RATIO) {
      deeps[i] = true;
      positions[i * 3 + 2] -= 1.4 + Math.random() * 2.2;
    }
  }

  // Edges: k-nearest neighbours, deduped
  const edgeSet = new Set();
  const edges = [];
  const addEdge = (a, b) => {
    if (a === b) return;
    const key = a < b ? `${a}-${b}` : `${b}-${a}`;
    if (edgeSet.has(key)) return;
    edgeSet.add(key);
    edges.push([a, b]);
  };

  for (let i = 0; i < NODE_COUNT; i++) {
    const dists = [];
    for (let j = 0; j < NODE_COUNT; j++) {
      if (i === j) continue;
      const dx = positions[i * 3] - positions[j * 3];
      const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
      const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
      dists.push([j, dx * dx + dy * dy + dz * dz]);
    }
    dists.sort((a, b) => a[1] - b[1]);
    for (let k = 0; k < NEAREST_LINKS; k++) addEdge(i, dists[k][0]);
  }

  // A few long-range links so the network reads as one organism
  for (let n = 0; n < LONG_LINKS; n++) {
    addEdge(
      Math.floor(Math.random() * NODE_COUNT),
      Math.floor(Math.random() * NODE_COUNT)
    );
  }

  // Flat line-segment positions
  const linePositions = new Float32Array(edges.length * 6);
  edges.forEach(([a, b], i) => {
    linePositions[i * 6] = positions[a * 3];
    linePositions[i * 6 + 1] = positions[a * 3 + 1];
    linePositions[i * 6 + 2] = positions[a * 3 + 2];
    linePositions[i * 6 + 3] = positions[b * 3];
    linePositions[i * 6 + 4] = positions[b * 3 + 1];
    linePositions[i * 6 + 5] = positions[b * 3 + 2];
  });

  return { positions, scales, accents, deeps, edges, linePositions };
}

/* ---------- the animated graph ---------- */
function AutomationGraph({ reducedMotion }) {
  const groupRef = useRef(null);
  const meshRef = useRef(null);
  const packetsRef = useRef(null);
  const pointer = useRef({ x: 0, y: 0 });
  const eased = useRef({ x: 0, y: 0 });
  const invalidate = useThree((state) => state.invalidate);

  const graph = useMemo(buildGraph, []);

  // Packets: each rides one edge with its own progress + speed
  const packets = useMemo(() => {
    const list = [];
    for (let i = 0; i < PACKET_COUNT; i++) {
      list.push({
        edge: Math.floor(Math.random() * graph.edges.length),
        t: Math.random(), // staggered starts
        speed: 0.18 + Math.random() * 0.3,
      });
    }
    return list;
  }, [graph]);

  const packetPositions = useMemo(() => {
    const arr = new Float32Array(PACKET_COUNT * 3);
    packets.forEach((p, i) => {
      const [a, b] = graph.edges[p.edge];
      arr[i * 3] = THREE.MathUtils.lerp(
        graph.positions[a * 3], graph.positions[b * 3], p.t
      );
      arr[i * 3 + 1] = THREE.MathUtils.lerp(
        graph.positions[a * 3 + 1], graph.positions[b * 3 + 1], p.t
      );
      arr[i * 3 + 2] = THREE.MathUtils.lerp(
        graph.positions[a * 3 + 2], graph.positions[b * 3 + 2], p.t
      );
    });
    return arr;
  }, [packets, graph]);

  // Write instance matrices + colors once
  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    for (let i = 0; i < NODE_COUNT; i++) {
      dummy.position.set(
        graph.positions[i * 3],
        graph.positions[i * 3 + 1],
        graph.positions[i * 3 + 2]
      );
      dummy.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      const s = graph.scales[i] * (graph.accents[i] ? 1.25 : 1);
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      // Three exposure tiers: crimson accents carry the scene,
      // warm-white mids stay subdued, deep nodes are barely-there dust
      if (graph.accents[i]) {
        color.copy(COLOR_ACCENT).multiplyScalar(0.95 + Math.random() * 0.3);
      } else if (graph.deeps[i]) {
        color.copy(COLOR_WARM).multiplyScalar(0.28 + Math.random() * 0.18);
      } else {
        color.copy(COLOR_WARM).multiplyScalar(0.65 + Math.random() * 0.3);
      }
      mesh.setColorAt(i, color);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    invalidate();
  }, [graph, invalidate]);

  // Pointer parallax via window listener (canvas is pointer-events: none)
  useEffect(() => {
    if (reducedMotion) return undefined;
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [reducedMotion]);

  useFrame((state, delta) => {
    if (reducedMotion) return;
    const dt = Math.min(delta, 0.05); // clamp tab-switch spikes
    const t = state.clock.elapsedTime;

    // Slow idle rotation + eased mouse parallax
    eased.current.x = THREE.MathUtils.lerp(eased.current.x, pointer.current.x, 0.04);
    eased.current.y = THREE.MathUtils.lerp(eased.current.y, pointer.current.y, 0.04);
    const group = groupRef.current;
    if (group) {
      group.rotation.y = t * 0.045 + eased.current.x * 0.14;
      group.rotation.x = Math.sin(t * 0.08) * 0.03 - eased.current.y * 0.08;
    }

    // Data packets travelling along edges
    const points = packetsRef.current;
    if (points) {
      const arr = points.geometry.attributes.position.array;
      for (let i = 0; i < packets.length; i++) {
        const p = packets[i];
        p.t += p.speed * dt;
        if (p.t >= 1) {
          p.t = 0;
          p.edge = Math.floor(Math.random() * graph.edges.length);
          p.speed = 0.18 + Math.random() * 0.3;
        }
        const [a, b] = graph.edges[p.edge];
        arr[i * 3] = THREE.MathUtils.lerp(
          graph.positions[a * 3], graph.positions[b * 3], p.t
        );
        arr[i * 3 + 1] = THREE.MathUtils.lerp(
          graph.positions[a * 3 + 1], graph.positions[b * 3 + 1], p.t
        );
        arr[i * 3 + 2] = THREE.MathUtils.lerp(
          graph.positions[a * 3 + 2], graph.positions[b * 3 + 2], p.t
        );
      }
      points.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef} rotation={[0.08, -0.4, 0]}>
      {/* workflow nodes */}
      <instancedMesh ref={meshRef} args={[undefined, undefined, NODE_COUNT]} frustumCulled={false}>
        <octahedronGeometry args={[0.065, 0]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>

      {/* connection wires */}
      <lineSegments frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={graph.linePositions.length / 3}
            array={graph.linePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#F2F0ED"
          transparent
          opacity={0.055}
          depthWrite={false}
          toneMapped={false}
        />
      </lineSegments>

      {/* travelling data packets */}
      <points ref={packetsRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={PACKET_COUNT}
            array={packetPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#E01535"
          size={0.1}
          sizeAttenuation
          transparent
          opacity={1}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </points>
    </group>
  );
}

/* ---------- drifting crimson ember (cheap "red light") ----------
   A single additive sprite with a radial-gradient canvas texture
   drifting slowly behind the graph — reads like a far-off red
   source moving through smoke, at near-zero cost. */
function EmberDrift({ reducedMotion }) {
  const ref = useRef(null);

  const texture = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 128;
    c.height = 128;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, 'rgba(200, 16, 46, 0.85)');
    g.addColorStop(0.4, 'rgba(200, 16, 46, 0.22)');
    g.addColorStop(1, 'rgba(200, 16, 46, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }, []);

  useEffect(() => () => texture.dispose(), [texture]);

  useFrame((state) => {
    if (reducedMotion || !ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.set(
      Math.sin(t * 0.07) * 3.4,
      Math.cos(t * 0.05) * 1.6 - 0.4,
      -2.5
    );
    ref.current.material.opacity = 0.15 + Math.sin(t * 0.45) * 0.04;
  });

  return (
    <sprite ref={ref} position={[2.2, -0.6, -2.5]} scale={[5.5, 5.5, 1]}>
      <spriteMaterial
        map={texture}
        transparent
        opacity={0.15}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
        fog={false}
      />
    </sprite>
  );
}

/* ---------- camera breathing (~14s period, tiny amplitude) ---------- */
function CameraBreath({ reducedMotion }) {
  useFrame((state) => {
    if (reducedMotion) return;
    const t = state.clock.elapsedTime;
    state.camera.position.z = 9 + Math.sin((t * Math.PI * 2) / 14) * 0.16;
  });
  return null;
}

/* ---------- exported wrapper ---------- */
const HeroScene = ({ className = '' }) => {
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e) => setReducedMotion(e.matches);
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', onChange);
      else mq.removeListener(onChange);
    };
  }, []);

  return (
    <div className={`hero-scene ${className}`.trim()} aria-hidden="true">
      <HeroBackdrop reducedMotion={reducedMotion} />
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 9], fov: 45, near: 0.1, far: 30 }}
        frameloop={reducedMotion ? 'demand' : 'always'}
      >
        <fog attach="fog" args={['#080808', 5, 13.5]} />
        <EmberDrift reducedMotion={reducedMotion} />
        <AutomationGraph reducedMotion={reducedMotion} />
        <CameraBreath reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
};

export default HeroScene;
