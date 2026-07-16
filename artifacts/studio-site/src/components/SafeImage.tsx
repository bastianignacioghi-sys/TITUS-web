import { useState, useEffect } from "react";

/**
 * SafeImage — simple image component that falls back to an invisible placeholder
 * on failure, preserving layout without showing broken-image text.
 */

interface SafeImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> {
  src: string;
  alt: string;
}

export default function SafeImage({ src, alt, className, style, ...rest }: SafeImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setCurrentSrc(src);
    setFailed(false);
  }, [src]);

  function handleError() {
    setFailed(true);
  }

  if (failed) {
    return <div className={className} style={style} aria-hidden="true" />;
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
