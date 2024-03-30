export type ImageWithFallbackProps = {
  src?: string;
  alt: string;
  fallback: string;
  className?: string;
};

export const ImageWithFallback = ({
  src,
  alt,
  fallback,
  className,
}: ImageWithFallbackProps) => {
  return (
    <img
      className={className}
      src={src || fallback}
      alt={alt}
      onError={({ currentTarget }) => {
        currentTarget.onerror = null;
        currentTarget.src = fallback;
      }}
    />
  );
};
