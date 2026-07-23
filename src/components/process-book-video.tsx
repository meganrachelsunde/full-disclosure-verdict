"use client";

import { useEffect, useRef, useState } from "react";

// A second, separate piece of filmed footage — distinct from the hero's
// protected video (see hero-book-video.tsx, which this file deliberately
// shares no constants or files with). Mounted as a faint background
// layer behind the Process section, below the hero, so it only comes
// into view as the visitor scrolls down rather than competing with the
// hero on first paint.
const VIDEO_SRC = "/media/fdv-process.mp4";
const POSTER_SRC = "/media/fdv-process-poster.jpg";

export function ProcessBookVideo() {
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
    // Same literal-attribute fix as the hero video: React only sets
    // `muted` as a DOM property, which mobile Safari-class autoplay
    // gating does not honor on its own.
    video.setAttribute("muted", "");
    video.muted = true;
    if (reduceMotion) {
      video.pause();
      video.currentTime = 0;
    } else {
      video.play().catch(() => {
        // Poster frame remains visible if autoplay is blocked.
      });
    }
  }, [reduceMotion, ready]);

  if (!ready) return null;

  return (
    <div aria-hidden="true" className="process-media-background">
      <video
        ref={videoRef}
        className="process-media-video"
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
