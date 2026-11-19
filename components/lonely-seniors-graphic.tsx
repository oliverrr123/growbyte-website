import { SoftFadeImage } from "@/components/soft-fade-image";
import { STORY_CLIP_PATHS } from "@/lib/story-clip-paths";

/**
 * Visual for “1 out of 3 seniors live alone”: painterly illustration
 * of three seniors, with one set slightly apart.
 */
export function LonelySeniorsGraphic({
  label = "1 out of 3 seniors live alone",
}: {
  label?: string;
}) {
  return (
    <SoftFadeImage
      src="/images/robo-companion/lonely-seniors.jpg"
      alt={label}
      className="w-full md:w-[32rem]"
      imageClassName="object-cover"
      width={1200}
      height={800}
      sizes="(max-width: 768px) 100vw, 512px"
      clipPath={STORY_CLIP_PATHS.lonely}
    />
  );
}
