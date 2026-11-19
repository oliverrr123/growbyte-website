import Image, { type ImageProps } from "next/image";

function clipIdFromPath(d: string) {
  let h = 0;
  for (let i = 0; i < d.length; i++) h = (h * 31 + d.charCodeAt(i)) | 0;
  return `story-clip-${(h >>> 0).toString(36)}`;
}

/**
 * Content image with optional organic shape.
 * Prefer SVG clipPath (vector, smooth anti-aliased edges).
 */
export function SoftFadeImage({
  className = "",
  imageClassName = "object-cover",
  maskSrc,
  clipPath,
  alt,
  src,
  width,
  height,
  sizes,
  ...imageProps
}: Omit<ImageProps, "className"> & {
  className?: string;
  imageClassName?: string;
  /** @deprecated Prefer clipPath for smooth edges */
  maskSrc?: string;
  /** SVG path `d` in objectBoundingBox units (0–1) */
  clipPath?: string;
}) {
  const hasAspect = typeof width === "number" && typeof height === "number";

  if (clipPath && hasAspect) {
    const clipId = clipIdFromPath(clipPath);
    return (
      <div
        className={`relative w-full ${className}`.trim()}
        style={{ aspectRatio: `${width} / ${height}` }}
      >
        <svg width={0} height={0} aria-hidden className="absolute">
          <defs>
            <clipPath id={clipId} clipPathUnits="objectBoundingBox">
              <path d={clipPath} />
            </clipPath>
          </defs>
        </svg>
        <div className="absolute inset-0" style={{ clipPath: `url(#${clipId})` }}>
          <Image
            alt={alt}
            src={src}
            fill
            sizes={sizes ?? "(max-width: 768px) 100vw, 384px"}
            className={imageClassName}
            {...imageProps}
          />
        </div>
      </div>
    );
  }

  if (maskSrc && hasAspect) {
    return (
      <div
        className={`relative w-full ${className}`.trim()}
        style={{
          aspectRatio: `${width} / ${height}`,
          WebkitMaskImage: `url("${maskSrc}")`,
          maskImage: `url("${maskSrc}")`,
          WebkitMaskSize: "100% 100%",
          maskSize: "100% 100%",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
        }}
      >
        <Image
          alt={alt}
          src={src}
          fill
          sizes={sizes ?? "(max-width: 768px) 100vw, 384px"}
          className={imageClassName}
          {...imageProps}
        />
      </div>
    );
  }

  return (
    <div className={className || undefined}>
      <Image
        alt={alt}
        src={src}
        width={width}
        height={height}
        sizes={sizes}
        className={`h-auto w-full ${imageClassName}`.trim()}
        {...imageProps}
      />
    </div>
  );
}
