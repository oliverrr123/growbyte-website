"use client";

import dynamic from "next/dynamic";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import type MuxPlayerElement from "@mux/mux-player";
import { Maximize, Minimize, Pause, Play, Volume2, VolumeX, X } from "lucide-react";
import styles from "./myfriend-launch-video.module.css";

const MuxPlayer = dynamic(() => import("@mux/mux-player-react"), { ssr: false });
// The public playback ID is safe to include in the client bundle.
const PLAYBACK_ID = process.env.NEXT_PUBLIC_MYFRIEND_LAUNCH_PLAYBACK_ID
  || "5h3uIDSKHARw027vL9oTPG7soZ8SCAR501d5qGBVY33gU";
const LOCAL_PREVIEW_SRC = process.env.NODE_ENV === "development"
  ? process.env.NEXT_PUBLIC_MYFRIEND_LAUNCH_PREVIEW_SRC
  : undefined;

// The original SVG's first Bézier is split in two without changing its shape,
// giving both outlines eight matching curves for a continuous morph.
const BLOB_POINTS = [
  672.585, 217.443,
  716.767, 238.653, 749.38975, 265.79475, 772.852875, 299.75775,
  796.316, 333.72075, 810.6195, 374.505, 818.163, 423,
  834.015, 524.901, 792.717, 632.419, 712.937, 697.905,
  639.829, 757.913, 534.402, 708.5, 440.587, 697.905,
  345.718, 687.191, 248.511, 713.056, 188.665, 638.696,
  120.462, 553.95, 86.52, 414.558, 135.083, 316.942,
  180.725, 225.197, 277.582, 225.443, 380.585, 208.943,
  469.582, 194.687, 596.567, 180.95, 672.585, 217.443,
];
const RECTANGLE_POINTS = [
  805, 245,
  813.837, 245, 821, 252.163, 821, 261,
  821, 383.458, 821, 505.917, 821, 628.375,
  821, 637.212, 813.837, 644.375, 805, 644.375,
  579, 644.375, 353, 644.375, 127, 644.375,
  118.163, 644.375, 111, 637.212, 111, 628.375,
  111, 505.917, 111, 383.458, 111, 261,
  111, 252.163, 118.163, 245, 127, 245,
  353, 245, 579, 245, 805, 245,
];

function outline(points: number[]) {
  return `M${points[0]} ${points[1]}C${points.slice(2).join(" ")}Z`;
}

function timestamp(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
}

export function MyFriendLaunchVideo({ children }: { children: ReactNode }) {
  const container = useRef<HTMLDivElement>(null);
  const clipId = `launch-video-${useId().replace(/:/g, "")}`;
  const clipPath = useRef<SVGPathElement>(null);
  const currentOutline = useRef(BLOB_POINTS);
  const player = useRef<MuxPlayerElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const pauseButton = useRef<HTMLButtonElement>(null);
  const controlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasStarted = useRef(false);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [duration, setDuration] = useState(0);
  const [time, setTime] = useState(0);
  const [touchControlsVisible, setTouchControlsVisible] = useState(false);

  function revealTouchControls() {
    if (controlsTimer.current) clearTimeout(controlsTimer.current);
    setTouchControlsVisible(true);
    controlsTimer.current = setTimeout(() => setTouchControlsVisible(false), 2500);
  }

  useEffect(() => {
    setTouchControlsVisible(false);
    return () => {
      if (controlsTimer.current) clearTimeout(controlsTimer.current);
    };
  }, [started]);

  function updateTime() {
    const media = player.current;
    if (!media) return;
    setTime(media.currentTime || 0);
    if (Number.isFinite(media.duration) && media.duration > 0) setDuration(media.duration);
  }

  useEffect(() => {
    const target = started ? RECTANGLE_POINTS : BLOB_POINTS;
    const path = clipPath.current;
    if (!path) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      currentOutline.current = target;
      path.setAttribute("d", outline(target));
      return;
    }
    const from = currentOutline.current;
    if (from === target) return;
    const began = performance.now();
    let frame: number;
    const morph = (now: number) => {
      const progress = Math.min((now - began) / 700, 1);
      // Smooth at both ends and safe to reverse even halfway through opening.
      const eased = progress * progress * (3 - 2 * progress);
      const points = from.map((value, index) => value + (target[index] - value) * eased);
      currentOutline.current = progress === 1 ? target : points;
      path.setAttribute("d", outline(currentOutline.current));
      if (progress < 1) frame = requestAnimationFrame(morph);
    };
    frame = requestAnimationFrame(morph);
    return () => cancelAnimationFrame(frame);
  }, [started]);

  useEffect(() => {
    const onFullscreenChange = () => setExpanded(document.fullscreenElement === container.current);
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  // Both responsive artboards exist in the DOM. Never leave a hidden one playing.
  useEffect(() => {
    if (!started) {
      if (hasStarted.current) trigger.current?.focus({ preventScroll: true });
      return;
    }
    hasStarted.current = true;
    const onResize = () => {
      if (document.fullscreenElement === container.current) return;
      if (container.current && !container.current.getClientRects().length) {
        player.current?.pause();
        setStarted(false);
      }
    };
    window.addEventListener("resize", onResize);
    pauseButton.current?.focus({ preventScroll: true });
    return () => window.removeEventListener("resize", onResize);
  }, [started]);

  async function expand() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (container.current?.requestFullscreen) await container.current.requestFullscreen();
      else {
        // Safari on iPhone uses the media element's native fullscreen player.
        const video = player.current?.media?.nativeEl as HTMLVideoElement & { webkitEnterFullscreen?: () => void };
        video?.webkitEnterFullscreen?.();
      }
    } catch {
      // Keep inline playback working if the browser denies fullscreen.
    }
  }

  async function close() {
    player.current?.pause();
    if (document.fullscreenElement === container.current) await document.exitFullscreen();
    setStarted(false);
    setTime(0);
  }

  const hasVideo = Boolean(PLAYBACK_ID || LOCAL_PREVIEW_SRC);

  return (
    <div ref={container} className={styles.root} data-launch-video data-shape={started ? "rectangle" : "blob"}
      data-touch-controls={touchControlsVisible ? "visible" : "hidden"}>
      <svg width="0" height="0" aria-hidden focusable="false" className={styles.clipDefinition}>
        <defs><clipPath id={clipId} clipPathUnits="userSpaceOnUse">
          <path ref={clipPath} d={outline(BLOB_POINTS)} />
        </clipPath></defs>
      </svg>
      <div className={styles.surface} style={{ clipPath: `url(#${clipId})` }}
        onPointerDown={(event) => {
          if (!started || event.pointerType === "mouse") return;
          if (touchControlsVisible) {
            if (controlsTimer.current) clearTimeout(controlsTimer.current);
            setTouchControlsVisible(false);
          } else revealTouchControls();
        }}>
        <div className={styles.photo}>{children}</div>
        {started && (
          <div className={styles.frame}>
            <MuxPlayer
              ref={player}
              playbackId={PLAYBACK_ID || undefined}
              src={PLAYBACK_ID ? undefined : LOCAL_PREVIEW_SRC}
              streamType="on-demand"
              autoPlay
              playsInline
              preload="auto"
              nohotkeys
              muted={muted}
              metadata={{ video_title: "MyFriend launch video" }}
              className={styles.player}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onEnded={() => setPlaying(false)}
              onLoadedMetadata={updateTime}
              onDurationChange={updateTime}
              onTimeUpdate={updateTime}
              onError={() => { setFailed(true); void close(); }}
            />
          </div>
        )}
      </div>
      {hasVideo && (!started ? (
        <button
          ref={trigger}
          type="button"
          className={styles.launch}
          aria-label={failed ? "Retry MyFriend launch video" : "Play MyFriend launch video"}
          onClick={() => { setFailed(false); setPlaying(false); setStarted(true); }}
        >
          <Play aria-hidden fill="currentColor" size={38} />
        </button>
      ) : (
        <>
          <div className={styles.controls} role="group" aria-label="Video controls"
            onPointerDown={(event) => { if (event.pointerType !== "mouse") revealTouchControls(); }}>
            <button ref={pauseButton} type="button" aria-label={playing ? "Pause video" : "Play video"}
              onClick={() => { if (player.current?.paused) void player.current.play(); else player.current?.pause(); }}>
              {playing ? <Pause aria-hidden /> : <Play aria-hidden />}
            </button>
            <span className={styles.time}>{timestamp(time)}</span>
            <input type="range" aria-label="Seek video" min={0} max={duration || 1} step={0.1} value={time}
              disabled={!duration} onChange={(event) => { if (player.current) player.current.currentTime = Number(event.target.value); }} />
            <button type="button" aria-label={muted ? "Unmute video" : "Mute video"} onClick={() => setMuted(!muted)}>
              {muted ? <VolumeX aria-hidden /> : <Volume2 aria-hidden />}
            </button>
            <button type="button" aria-label={expanded ? "Exit fullscreen" : "Expand video"} disabled={!duration} onClick={() => void expand()}>
              {expanded ? <Minimize aria-hidden /> : <Maximize aria-hidden />}
            </button>
            <button type="button" aria-label="Close video" onClick={() => void close()}><X aria-hidden /></button>
          </div>
        </>
      ))}
      {failed && <span role="alert" className={styles.error}>The video couldn’t load. Please try again.</span>}
    </div>
  );
}
