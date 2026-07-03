import { useState, useEffect } from "react";

/**
 * SafeImage — robust image loader for all platforms including WhatsApp,
 * Instagram, Facebook WebViews that block external CDNs.
 *
 * Strategy:
 * 1. For external URLs (Cloudinary, Picsum, Unsplash, etc.), route through
 *    our same-origin /api/images-proxy endpoint IMMEDIATELY. This avoids
 *    the "onerror never fires" problem in WebViews.
 * 2. For local URLs, use directly.
 * 3. If the proxy image also fails (rare), show a broken-img placeholder.
 */

function getProxiedUrl(src: string): string {
  try {
    const u = new URL(src);
    // Already local → don't proxy
    if (u.hostname === window.location.hostname) return src;
    if (u.hostname === "localhost") return src;
    if (u.hostname === "127.0.0.1") return src;
    // Already our proxy ↔ don't double-proxy
    if (u.pathname.startsWith("/api/images-proxy")) return src;
    // Replit domains are local
    if (u.hostname.includes("replit")) return src;
  } catch {
    // Not a valid URL (relative path) ↔ local
    return src;
  }
  const base = import.meta.env.BASE_URL || "/";
  const proxyBase = base === "/" ? "/api" : `${base}api`;
  return `${proxyBase}/images-proxy?url=${encodeURIComponent(src)}`;
}

const EXTERNAL_IMAGE_DOMAINS = [
  "res.cloudinary.com",
  "picsum.photos",
  "images.unsplash.com",
  "unsplash.com",
  "cdn.jsdelivr.net",
  "i.imgur.com",
  "imgur.com",
  "cloudfront.net",
  "s3.amazonaws.com",
  "storage.googleapis.com",
];

function shouldProxyDirectly(src: string): boolean {
  try {
    const u = new URL(src);
    if (u.hostname === window.location.hostname) return false;
    if (u.hostname === "localhost") return false;
    if (u.hostname === "127.0.0.1") return false;
    if (u.pathname.startsWith("/api/images-proxy")) return false;
    if (u.hostname.includes("replit")) return false;
    return EXTERNAL_IMAGE_DOMAINS.some(d => u.hostname.includes(d));
  } catch {
    return false;
  }
}

interface SafeImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> {
  src: string;
  alt: string;
}

export default function SafeImage({ src, alt, className, style, ...rest }: SafeImageProps) {
  // For known external CDNs, go directly through proxy (no double request)
  const initialSrc = shouldProxyDirectly(src) ? getProxiedUrl(src) : src;

  const [currentSrc, setCurrentSrc] = useState(initialSrc);
  const [triedProxy, setTriedProxy] = useState(shouldProxyDirectly(src));
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const newInitial = shouldProxyDirectly(src) ? getProxiedUrl(src) : src;
    setCurrentSrc(newInitial);
    setTriedProxy(shouldProxyDirectly(src));
    setFailed(false);
  }, [src]);

  function handleError() {
    if (!triedProxy) {
      setTriedProxy(true);
      setCurrentSrc(getProxiedUrl(src));
    } else {
      setFailed(true);
    }
  }

  if (failed) {
    return (
      <div
        className={className}
        style={{
          ...(typeof style === "object" ? style : {}),
          background: "#141416",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#333",
          fontSize: 11,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        <span>Imagen no disponible</span>
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      style={style}
      onError={handleError}
      loading="lazy"
      {...rest}
    />
  );
}
