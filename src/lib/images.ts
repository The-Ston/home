import { getImage, inferRemoteSize } from "astro:assets";
import type { ImageMetadata } from "astro";

export interface SafeImage {
  src: string;
  width?: number;
  height?: number;
}

/**
 * Optimizes an image at build time (resize + WebP), never failing the build:
 * a missing or unreachable remote image yields null and the caller falls back
 * to the generated visual. Paths starting with "/" (files in public/) are used as is.
 */
export async function safeImage(src: string | ImageMetadata | undefined, width: number): Promise<SafeImage | null> {
  if (!src) return null;
  if (typeof src === "string" && src.startsWith("/") && !src.startsWith("//")) return { src };
  try {
    // Remote images: read the real size first and scale the height with the
    // width, otherwise the original height is kept and the image gets cropped.
    let options;
    if (typeof src === "string") {
      const size = await inferRemoteSize(src);
      const w = Math.min(width, size.width);
      options = { src, width: w, height: Math.round((size.height * w) / size.width), format: "webp" as const };
    } else {
      options = { src, width: Math.min(width, src.width), format: "webp" as const };
    }
    const img = await getImage(options);
    return {
      src: img.src,
      width: Number(img.attributes.width) || undefined,
      height: Number(img.attributes.height) || undefined,
    };
  } catch (err) {
    console.warn(`[images] cannot load ${typeof src === "string" ? src : src.src}: ${(err as Error).message}`);
    return null;
  }
}

/** Optional profile picture: drop src/assets/avatar.(png|jpg|jpeg|webp) to enable it. */
const avatarFiles = import.meta.glob<{ default: ImageMetadata }>("/src/assets/avatar.{png,jpg,jpeg,webp}", { eager: true });
export const avatarSource: ImageMetadata | undefined = Object.values(avatarFiles)[0]?.default;

/**
 * GitHub avatar with its flat background made transparent (data URI), so the
 * button can paint a contrasting background behind it. Identicons have an
 * opaque light-gray background: every pixel matching the top-left corner color
 * is cleared. Returns null on failure (the button then shows no avatar).
 */
export async function transparentAvatar(url: string, size: number): Promise<string | null> {
  try {
    const { default: sharp } = await import("sharp");
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    // Key at full resolution (exact colors), then downscale with smooth edges.
    const { data, info } = await sharp(Buffer.from(await res.arrayBuffer()))
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const [r, g, b] = data;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i] === r && data[i + 1] === g && data[i + 2] === b) data[i + 3] = 0;
    }
    const png = await sharp(data, { raw: info }).resize(size, size).png().toBuffer();
    return `data:image/png;base64,${png.toString("base64")}`;
  } catch (err) {
    console.warn(`[images] cannot load ${url}: ${(err as Error).message}`);
    return null;
  }
}
