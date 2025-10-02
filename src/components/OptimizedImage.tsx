import { useState, useEffect, useRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { getOptimizedUrl, generateSrcSet, isImageCached, cacheImage } from '@/lib/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  skeletonClassName?: string;
  priority?: boolean;
  widths?: number[];
  sizes?: string;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
  fetchPriority?: 'high' | 'low' | 'auto';
  placeholder?: 'blur' | 'skeleton';
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage = ({
  src,
  alt,
  className,
  skeletonClassName,
  priority = false,
  widths = [320, 640, 1024, 1280],
  sizes = '100vw',
  quality = 75,
  format = 'webp',
  fetchPriority = 'auto',
  placeholder = 'skeleton',
  onLoad,
  onError,
}: OptimizedImageProps) => {
  const wasAlreadyLoaded = isImageCached(src);
  const [isLoading, setIsLoading] = useState(!wasAlreadyLoaded);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [retryCount, setRetryCount] = useState(0);
  const imgRef = useRef<HTMLDivElement>(null);

  // Generate optimized URLs
  const optimizedSrc = getOptimizedUrl(src, { width: widths[widths.length - 1], quality, format });
  const srcSet = generateSrcSet(src, widths, { quality, format });
  const blurSrc = placeholder === 'blur' ? getOptimizedUrl(src, { width: 24, quality: 10, format: 'jpeg' }) : undefined;

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || !imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
      }
    );

    observer.observe(imgRef.current);

    return () => {
      observer.disconnect();
    };
  }, [priority]);

  const handleLoad = () => {
    setIsLoading(false);
    cacheImage(src);
    onLoad?.();
  };

  const handleError = () => {
    // Retry once with original src if transformed URL fails
    if (retryCount === 0) {
      setRetryCount(1);
      return;
    }
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  return (
    <div ref={imgRef} className={cn('relative overflow-hidden', className)}>
      {/* Blur placeholder */}
      {placeholder === 'blur' && blurSrc && isLoading && (
        <img
          src={blurSrc}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover blur-lg scale-110 z-0"
        />
      )}

      {/* Skeleton loader */}
      {placeholder === 'skeleton' && isLoading && (
        <Skeleton 
          className={cn(
            'absolute inset-0 z-10',
            skeletonClassName
          )} 
        />
      )}

      {/* Fallback for error */}
      {hasError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="text-center text-muted-foreground">
            <svg
              className="w-12 h-12 mx-auto mb-2 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm">Image unavailable</p>
          </div>
        </div>
      ) : (
        isInView && (
          <picture>
            <source
              type="image/webp"
              srcSet={srcSet}
              sizes={sizes}
            />
            <img
              src={retryCount > 0 ? src : optimizedSrc}
              alt={alt}
              loading={priority ? 'eager' : 'lazy'}
              decoding="async"
              fetchPriority={fetchPriority}
              onLoad={handleLoad}
              onError={handleError}
              sizes={sizes}
              className={cn(
                'w-full h-full object-cover transition-opacity duration-500',
                isLoading ? 'opacity-0' : 'opacity-100',
                className
              )}
            />
          </picture>
        )
      )}
    </div>
  );
};
