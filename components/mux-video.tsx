"use client";

import MuxPlayer from "@mux/mux-player-react/lazy";
import type { MuxCSSProperties } from "@mux/mux-player-react";

type MuxVideoProps = {
  playbackId: string;
  title?: string;
  accentColor?: string;
  /** CSS aspect-ratio value, e.g. "16 / 9" or "1624 / 1080". */
  aspectRatio?: string;
  /** Background color shown behind/around the video frame (letterbox area). */
  backgroundColor?: string;
  className?: string;
  style?: MuxCSSProperties;
};

export function MuxVideo({
  playbackId,
  title,
  accentColor = "#000000",
  aspectRatio,
  backgroundColor,
  className,
  style,
}: MuxVideoProps) {
  const mergedStyle: MuxCSSProperties = {
    width: "100%",
    aspectRatio,
    ...(backgroundColor && {
      "--media-background-color": backgroundColor,
      "--controls-backdrop-color": backgroundColor,
    }),
    ...style,
  };

  return (
    <MuxPlayer
      playbackId={playbackId}
      metadata={title ? { video_title: title } : undefined}
      accentColor={accentColor}
      className={className}
      style={mergedStyle}
    />
  );
}
