"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const EvidenceScene = dynamic(
  () => import("./evidence-scene").then((m) => m.EvidenceScene),
  { ssr: false, loading: () => null }
);

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl2") || canvas.getContext("webgl"))
    );
  } catch {
    return false;
  }
}

// Client-only, decorative background scoped to whichever positioned
// ancestor renders it (the hero section) — never blocks the initial HTML
// paint of the headline or any other content, since it only starts
// loading after mount and sits in an absolutely positioned layer that
// fills and is clipped to that ancestor. If WebGL is unavailable, this
// renders nothing and the CSS .bg-ambient layer (see globals.css) is the
// visible fallback.
export function WebglBackground() {
  const [ready, setReady] = useState(false);
  const [supported, setSupported] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [simplified, setSimplified] = useState(false);

  useEffect(() => {
    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileMq = window.matchMedia("(max-width: 767px)");

    // Deferred to a microtask callback (rather than called synchronously
    // at the top of the effect) so this reads as "setState from a
    // callback," matching the pattern used for the change listeners below.
    queueMicrotask(() => {
      setSupported(supportsWebGL());
      setReduceMotion(reduceMq.matches);
      setSimplified(mobileMq.matches);
      setReady(true);
    });

    const handleReduce = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    const handleMobile = (e: MediaQueryListEvent) => setSimplified(e.matches);
    reduceMq.addEventListener("change", handleReduce);
    mobileMq.addEventListener("change", handleMobile);
    return () => {
      reduceMq.removeEventListener("change", handleReduce);
      mobileMq.removeEventListener("change", handleMobile);
    };
  }, []);

  if (!ready || !supported) return null;

  return (
    <div aria-hidden="true" className="hero-webgl-background">
      <EvidenceScene reduceMotion={reduceMotion} simplified={simplified} />
    </div>
  );
}
