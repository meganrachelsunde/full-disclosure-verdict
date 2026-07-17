"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";

type PlaneDef = {
  id: string;
  position: [number, number, number];
  size: [number, number];
  rotation: [number, number, number];
  driftSpeed: number;
};

// Two small panes only, held in the negative space at the outer edges of
// the hero — not centered, not facing the camera flat-on (large rotation.y
// angles them into depth so they read as thin sheets, not boards).
const PLANES: PlaneDef[] = [
  {
    id: "left",
    position: [-5.8, 1.1, -3.5],
    size: [2.1, 3.4],
    rotation: [0.06, 0.55, 0.03],
    driftSpeed: 0.05,
  },
  {
    id: "right",
    position: [5.6, -1.0, -4.5],
    size: [1.9, 3.7],
    rotation: [-0.04, -0.5, -0.02],
    driftSpeed: 0.045,
  },
];

type SceneMotion = {
  pointerX: number;
  pointerY: number;
  heroProgress: number; // 0 = fully in hero, 1 = fully faded/scrolled past
};

function EvidencePlaneMesh({
  def,
  index,
  motion,
  reduceMotion,
}: {
  def: PlaneDef;
  index: number;
  motion: React.RefObject<SceneMotion>;
  reduceMotion: boolean;
}) {
  const ref = useRef<THREE.Mesh | null>(null);
  const matRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const opacityRef = useRef(0.42);

  useFrame((state) => {
    const mesh = ref.current;
    const mat = matRef.current;
    // Reduced motion: leave the mesh at its static, declared resting
    // state permanently — no drift, no scroll-driven scale/fade.
    if (!mesh || !mat || reduceMotion) return;

    const t = state.clock.elapsedTime;
    mesh.rotation.x = def.rotation[0] + Math.sin(t * def.driftSpeed + index) * 0.02;
    mesh.rotation.y = def.rotation[1] + Math.cos(t * def.driftSpeed * 0.8 + index) * 0.025;

    const progress = motion.current.heroProgress;
    const scale = THREE.MathUtils.lerp(1, 0.55, progress);
    mesh.scale.setScalar(scale);

    const target = 0.42 * (1 - progress);
    opacityRef.current = THREE.MathUtils.lerp(opacityRef.current, target, 0.08);
    mat.opacity = opacityRef.current;
    mesh.visible = opacityRef.current > 0.01;
  });

  return (
    <mesh ref={ref} position={def.position} rotation={def.rotation}>
      <boxGeometry args={[def.size[0], def.size[1], 0.1]} />
      <meshPhysicalMaterial
        ref={matRef}
        color="#2b2823"
        transmission={0.85}
        roughness={0.38}
        thickness={0.4}
        ior={1.42}
        clearcoat={0.22}
        clearcoatRoughness={0.3}
        envMapIntensity={0.55}
        transparent
        opacity={0.42}
        side={THREE.DoubleSide}
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
  const fadeDistance = useRef(0);

  useEffect(() => {
    function measure() {
      const hero = document.getElementById("hero");
      fadeDistance.current = hero ? hero.offsetHeight * 1.15 : window.innerHeight * 1.15;
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Pointer tilt — fine pointers only.
  useEffect(() => {
    if (reduceMotion || !window.matchMedia("(pointer: fine)").matches) return;

    function handlePointerMove(e: PointerEvent) {
      motion.current.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      motion.current.pointerY = (e.clientY / window.innerHeight) * 2 - 1;
    }

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [reduceMotion, motion]);

  // Scroll — drives how far into the hero-to-content transition we are.
  useEffect(() => {
    let scrollFrame = 0;
    function handleScroll() {
      if (scrollFrame) return;
      scrollFrame = requestAnimationFrame(() => {
        scrollFrame = 0;
        const distance = fadeDistance.current || window.innerHeight * 1.15;
        motion.current.heroProgress = Math.min(Math.max(window.scrollY / distance, 0), 1);
      });
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollFrame) cancelAnimationFrame(scrollFrame);
    };
  }, [motion]);

  useFrame(() => {
    const group = groupRef.current;
    if (!group || reduceMotion) return;
    // Heavily damped — a few degrees max, never snaps toward the cursor.
    group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, motion.current.pointerX * 0.04, 0.03);
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, motion.current.pointerY * -0.03, 0.03);
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
  const motion = useRef<SceneMotion>({ pointerX: 0, pointerY: 0, heroProgress: 0 });
  const planes = simplified ? PLANES.slice(0, 1) : PLANES;
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
      <ambientLight intensity={0.35} color="#d9d0bc" />
      <directionalLight position={[3, 4, 5]} intensity={0.35} color="#e8e0cc" />
      <Environment resolution={128} frames={1}>
        <Lightformer intensity={0.9} color="#e8e0cc" position={[0, 4, 2]} scale={[8, 2, 1]} />
        <Lightformer
          intensity={0.5}
          color="#c8a968"
          position={[-5, -1, 3]}
          scale={[4, 4, 1]}
          rotation={[0, Math.PI / 4, 0]}
        />
        <Lightformer intensity={0.3} color="#6b665a" position={[5, -2, -3]} scale={[4, 4, 1]} />
      </Environment>
      <group ref={groupRef}>
        {planes.map((def, i) => (
          <EvidencePlaneMesh key={def.id} def={def} index={i} motion={motion} reduceMotion={reduceMotion} />
        ))}
      </group>
      <Rig groupRef={groupRef} motion={motion} reduceMotion={reduceMotion} />
    </Canvas>
  );
}
