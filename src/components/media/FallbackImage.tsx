"use client";

import { useCallback, useState } from "react";
import Image, { type ImageProps } from "next/image";
import {
  getCultureImageUrl,
  getSecondaryCulturePhoto,
  isBrokenOrMissingImageUrl,
  resolveHeroImage,
} from "@/lib/media/resolve-image";
import type { CultureAspect } from "@/lib/media/culture-images";

type FallbackImageProps = Omit<ImageProps, "src" | "onError"> & {
  src: string | null | undefined;
  /** Stable key (post slug) — same article always gets the same culture fallback. */
  fallbackSeed: string;
  aspect?: CultureAspect;
};

/**
 * Next/Image wrapper with 3-tier fallback (all real photos):
 *   1. Original src (if valid)
 *   2. Culture photo pool (deterministic by seed)
 *   3. Alternate culture photo from the same pool
 */
export function FallbackImage({
  src,
  fallbackSeed,
  aspect = "card",
  alt,
  ...props
}: FallbackImageProps) {
  const initial = resolveHeroImage(src, fallbackSeed, aspect);
  const [currentSrc, setCurrentSrc] = useState(initial);
  const [tier, setTier] = useState<0 | 1 | 2>(isBrokenOrMissingImageUrl(src) ? 1 : 0);

  const handleError = useCallback(() => {
    if (tier === 0) {
      setCurrentSrc(getCultureImageUrl(fallbackSeed, aspect));
      setTier(1);
    } else if (tier === 1) {
      setCurrentSrc(getSecondaryCulturePhoto(fallbackSeed));
      setTier(2);
    }
  }, [tier, fallbackSeed, aspect]);

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt || ""}
      onError={handleError}
    />
  );
}
