"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";

// A recognizable open book — a spine, a static stack of pages on each
// side, and one page that continuously, slowly turns between them. All
// geometry for a single page is built with local x in [0, PAGE_WIDTH],
// so local x = distance from the spine — the spine sits at each page
// mesh's own local origin, making the hinge a plain mesh rotation with no
// extra pivot math. A page lying on the right stack is unrotated; one
// lying on the left stack is rotated 180° around that same origin.
const SPINE_X = 0.8;
const BOOK_Y = -0.2;
const BOOK_Z = -3.2;
const PAGE_WIDTH = 4.3;
const PAGE_HEIGHT = 7.2;
const HALF_HEIGHT = PAGE_HEIGHT / 2;

type SceneMotion = {
  pointerX: number;
  pointerY: number;
};

// Rolls a flat page around a cylinder, conserving arc length from the
// spine (a real geometric curl, not a shader trick) — at curvature -> 0
// this reduces to the flat rest pose, so it starts and ends perfectly
// flat with no seam. A small y-dependent term added on top makes the
// free corners lag the vertical center slightly, the way real paper
// doesn't bend as a perfect rigid cylinder.
function applyCurl(mesh: THREE.Mesh, flatX: Float32Array, flatY: Float32Array, curvature: number) {
  const geometry = mesh.geometry as THREE.BufferGeometry;
  const position = geometry.attributes.position as THREE.BufferAttribute;

  for (let i = 0; i < position.count; i++) {
    const x0 = flatX[i];
    const y0 = flatY[i];

    let nx: number;
    let nz: number;
    if (curvature < 1e-4) {
      nx = x0;
      nz = 0;
    } else {
      const radius = 1 / curvature;
      const theta = x0 * curvature;
      const yNorm = y0 / HALF_HEIGHT;
      const cornerLag = 1 + 0.12 * yNorm * yNorm;
      nx = radius * Math.sin(theta);
      nz = radius * (1 - Math.cos(theta)) * cornerLag;
    }

    position.setX(i, nx);
    position.setZ(i, nz);
  }

  position.needsUpdate = true;
  geometry.computeVertexNormals();
}

// A page permanently at rest on one side of the spine — flat, no curl,
// only a slight per-index z/rotation offset so a stack of them reads as
// paper thickness rather than duplicate coincident planes.
function StackPage({
  side,
  index,
  count,
  simplified,
}: {
  side: "left" | "right";
  index: number;
  count: number;
  simplified: boolean;
}) {
  // Tighter, denser spacing than a sparse handful of sheets reads as the
  // edge of an actual page block rather than a few floating panes. A
  // slight alternating tone (not a texture map) is enough to break up an
  // otherwise perfectly flat, uniform color into something that reads as
  // paper rather than plastic.
  const depthOffset = index * 0.024;
  const jitter = ((index % 2) * 2 - 1) * 0.008;
  const opacity = 0.08 + (index / Math.max(count - 1, 1)) * 0.045;
  const color = index % 2 === 0 ? "#efe4cf" : "#e8dcc2";

  return (
    <mesh
      position={[SPINE_X, BOOK_Y, BOOK_Z - depthOffset]}
      rotation={[0, side === "left" ? Math.PI : 0, jitter]}
    >
      <planeGeometry args={[PAGE_WIDTH, PAGE_HEIGHT, simplified ? 1 : 2, 1]} />
      <meshPhysicalMaterial
        color={color}
        roughness={0.46}
        clearcoat={0.26}
        clearcoatRoughness={0.42}
        envMapIntensity={0.75}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// The single page that actually turns: a full 0 -> PI hinge rotation
// around the spine, with the curl amount peaking at the midpoint of the
// swing (most curved while airborne between the two stacks, flat at
// either end where it rests on a stack) — an oscillating back-and-forth
// turn, so it never needs a "next page" state machine to stay perpetual.
function TurningPage({
  turnDuration,
  restDuration,
  simplified,
  reduceMotion,
}: {
  turnDuration: number;
  restDuration: number;
  simplified: boolean;
  reduceMotion: boolean;
}) {
  const meshRef = useRef<THREE.Mesh | null>(null);
  const matRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const flatXRef = useRef<Float32Array | null>(null);
  const flatYRef = useRef<Float32Array | null>(null);
  const maxCurvature = 0.26;
  const cycle = 2 * turnDuration + 2 * restDuration;

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const position = mesh.geometry.attributes.position as THREE.BufferAttribute;
    const flatX = new Float32Array(position.count);
    const flatY = new Float32Array(position.count);
    for (let i = 0; i < position.count; i++) {
      flatX[i] = position.getX(i);
      flatY[i] = position.getY(i);
    }
    flatXRef.current = flatX;
    flatYRef.current = flatY;
    // Static resting pose (also the permanent shape under reduced motion):
    // caught mid-turn, curved, roughly upright.
    applyCurl(mesh, flatX, flatY, maxCurvature * 0.6);
    mesh.rotation.y = Math.PI * 0.5;
  }, []);

  useFrame((state) => {
    const mesh = meshRef.current;
    const mat = matRef.current;
    const flatX = flatXRef.current;
    const flatY = flatYRef.current;
    if (!mesh || !mat || !flatX || !flatY || reduceMotion) return;

    // Turn, hold flat against the far stack, turn back, hold flat at
    // rest — a short pause at each end rather than an immediate
    // reversal, and a full cycle long enough to read as unhurried.
    const phase = state.clock.elapsedTime % cycle;
    let progress: number;
    if (phase < turnDuration) {
      progress = 0.5 - 0.5 * Math.cos((phase / turnDuration) * Math.PI);
    } else if (phase < turnDuration + restDuration) {
      progress = 1;
    } else if (phase < 2 * turnDuration + restDuration) {
      const backPhase = phase - turnDuration - restDuration;
      progress = 0.5 + 0.5 * Math.cos((backPhase / turnDuration) * Math.PI);
    } else {
      progress = 0;
    }

    mesh.rotation.y = progress * Math.PI;
    applyCurl(mesh, flatX, flatY, maxCurvature * Math.sin(progress * Math.PI));
    mat.opacity = 0.12 + 0.06 * Math.sin(progress * Math.PI);
  });

  return (
    <mesh ref={meshRef} position={[SPINE_X, BOOK_Y, BOOK_Z]}>
      <planeGeometry args={[PAGE_WIDTH, PAGE_HEIGHT, simplified ? 16 : 26, simplified ? 8 : 14]} />
      {/* No `transmission` — its per-object refraction render pass is
          expensive without real GPU acceleration. Alpha blending plus
          a restrained clearcoat sheen reads as warm paper without that
          cost. */}
      <meshPhysicalMaterial
        ref={matRef}
        color="#f2ead9"
        roughness={0.38}
        clearcoat={0.38}
        clearcoatRoughness={0.3}
        envMapIntensity={0.95}
        transparent
        opacity={0.16}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// A thin, restrained champagne-gold bar along the hinge — the one
// concrete cue that reads as "book spine" without any literal cover art.
function Spine() {
  return (
    <mesh position={[SPINE_X, BOOK_Y, BOOK_Z + 0.02]}>
      <boxGeometry args={[0.055, PAGE_HEIGHT * 1.02, 0.09]} />
      <meshPhysicalMaterial
        color="#c8a968"
        roughness={0.4}
        metalness={0.12}
        clearcoat={0.45}
        envMapIntensity={0.95}
        transparent
        opacity={0.32}
      />
    </mesh>
  );
}

function Rig({
  groupRef,
  motion,
  reduceMotion,
}: {
  groupRef: React.RefObject<THREE.Group | null>;
  motion: React.RefObject<SceneMotion>;
  reduceMotion: boolean;
}) {
  // Pointer tilt — fine pointers only, restrained parallax on top of the
  // book's own continuous motion (never the primary movement).
  useEffect(() => {
    if (reduceMotion || !window.matchMedia("(pointer: fine)").matches) return;

    function handlePointerMove(e: PointerEvent) {
      motion.current.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      motion.current.pointerY = (e.clientY / window.innerHeight) * 2 - 1;
    }

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [reduceMotion, motion]);

  useFrame(() => {
    const group = groupRef.current;
    if (!group || reduceMotion) return;
    group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, motion.current.pointerX * 0.015, 0.03);
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, motion.current.pointerY * -0.012, 0.03);
  });

  return null;
}

export function EvidenceScene({
  reduceMotion,
  simplified,
}: {
  reduceMotion: boolean;
  simplified: boolean;
}) {
  const groupRef = useRef<THREE.Group | null>(null);
  const motion = useRef<SceneMotion>({ pointerX: 0, pointerY: 0 });
  const stackCount = simplified ? 3 : 5;
  const [frameloop, setFrameloop] = useState<"always" | "never">("always");

  useEffect(() => {
    function handleVisibility() {
      setFrameloop(document.hidden ? "never" : "always");
    }
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true }}
      camera={{ position: [0, 0, 9], fov: 42 }}
      frameloop={reduceMotion ? "demand" : frameloop}
    >
      <ambientLight intensity={0.32} color="#ece0c8" />
      <directionalLight position={[3, 5, 6]} intensity={0.42} color="#f3e9d2" />
      <Environment resolution={128} frames={1}>
        <Lightformer intensity={0.82} color="#f3e9d2" position={[0, 4, 3]} scale={[9, 3, 1]} />
        <Lightformer
          intensity={0.6}
          color="#c8a968"
          position={[-4, -1, 4]}
          scale={[5, 5, 1]}
          rotation={[0, Math.PI / 4, 0]}
        />
        <Lightformer intensity={0.22} color="#7a7266" position={[5, -2, -2]} scale={[4, 4, 1]} />
      </Environment>
      {/* Upright and level — no diagonal cant on the object itself. The
          Rig below still applies a few tenths of a degree of pointer
          parallax on top of this, but the resting pose is flat. */}
      <group ref={groupRef} position={[-1.1, 0, 0]} rotation={[0, 0, 0]}>
        {Array.from({ length: stackCount }, (_, i) => (
          <StackPage key={`l${i}`} side="left" index={i} count={stackCount} simplified={simplified} />
        ))}
        {Array.from({ length: stackCount }, (_, i) => (
          <StackPage key={`r${i}`} side="right" index={i} count={stackCount} simplified={simplified} />
        ))}
        <Spine />
        <TurningPage
          turnDuration={13}
          restDuration={7}
          simplified={simplified}
          reduceMotion={reduceMotion}
        />
      </group>
      <Rig groupRef={groupRef} motion={motion} reduceMotion={reduceMotion} />
    </Canvas>
  );
}
