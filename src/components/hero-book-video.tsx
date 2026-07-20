"use client";

import { useEffect, useRef, useState } from "react";

// Real filmed footage only — a physical open book, one page turning
// slowly, shot for this purpose. This component intentionally contains
// no procedural geometry, no generated imagery, and no lighting/shader
// tricks: it is a thin, decorative <video> layer and nothing else.
const VIDEO_SRC = "/media/fdv-hero.mp4";
const POSTER_SRC = "/media/fdv-hero-poster.jpg";

// Client-only, decorative background scoped to whichever positioned
// ancestor renders it (the hero section) — never blocks the initial HTML
// paint of the headline or copy, since it only starts loading after
// mount and sits in an absolutely positioned layer clipped to that
// ancestor. Strictly decorative: aria-hidden, no controls, no pointer
// events. Reduced motion is respected by never starting playback — the
// poster frame (a still from the same footage) is the permanent visual
// in that case, not a paused-but-loaded video.
export function HeroBookVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");

    queueMicrotask(() => {
      setReduceMotion(reduceMq.matches);
      setReady(true);
    });

    const handleChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    reduceMq.addEventListener("change", handleChange);
    return () => reduceMq.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // React only ever sets `muted` as a DOM property, never as the HTML
    // attribute — the JSX `muted` prop below is not enough on its own.
    // Mobile autoplay gating (most notably iOS Safari) checks for the
    // literal attribute, not just the property, so without this a muted
    // autoplaying video can silently work on desktop and never start on
    // mobile.
    video.setAttribute("muted", "");
    video.muted = true;
    if (reduceMotion) {
      video.pause();
      video.currentTime = 0;
    } else {
      video.play().catch(() => {
        // Autoplay can be blocked by the browser even when muted; the
        // poster frame remains visible either way, so there is nothing
        // to recover from here.
      });
    }
  }, [reduceMotion, ready]);

  if (!ready) return null;

  return (
    <div aria-hidden="true" className="hero-media-background">
      <video
        ref={videoRef}
        className="hero-media-video"
        src={VIDEO_SRC}
        poster={POSTER_SRC}
        autoPlay={!reduceMotion}
        muted
        loop
        playsInline
        preload="metadata"
      />
    </div>
  );
}
