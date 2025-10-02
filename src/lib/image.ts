/**
 * Image optimization utilities for fast loading
 */

export const isSupabaseUrl = (url: string): boolean => {
  return url.includes('supabase.co') || url.includes('supabase');
};

export const isUnsplashUrl = (url: string): boolean => {
  return url.includes('unsplash.com');
};

interface ImageTransformOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
}

/**
 * Build Supabase Storage transformed URL
 */
export const buildSupabaseUrl = (
  url: string,
  { width, height, quality = 75, format = 'webp' }: ImageTransformOptions
): string => {
  try {
    const urlObj = new URL(url);
    const params = new URLSearchParams();
    
    if (width) params.set('width', width.toString());
    if (height) params.set('height', height.toString());
    params.set('quality', quality.toString());
    params.set('format', format);
    
    // Supabase transform API format
    return `${url}?${params.toString()}`;
  } catch {
    return url;
  }
};

/**
 * Build Unsplash optimized URL
 */
export const buildUnsplashUrl = (
  url: string,
  { width, height, quality = 75, format = 'webp' }: ImageTransformOptions
): string => {
  try {
    const urlObj = new URL(url);
    const params = urlObj.searchParams;
    
    if (width) params.set('w', width.toString());
    if (height) params.set('h', height.toString());
    params.set('q', quality.toString());
    params.set('fm', format);
    params.set('fit', 'crop');
    params.set('auto', 'format');
    
    return urlObj.toString();
  } catch {
    return url;
  }
};

/**
 * Build weserv.nl proxy URL as fallback
 */
export const buildWeservProxy = (
  url: string,
  { width, quality = 75, format = 'webp' }: ImageTransformOptions
): string => {
  const params = new URLSearchParams();
  params.set('url', url);
  if (width) params.set('w', width.toString());
  params.set('q', quality.toString());
  params.set('output', format);
  params.set('il', ''); // interlace for progressive loading
  
  return `https://images.weserv.nl/?${params.toString()}`;
};

/**
 * Get optimized image URL with fallbacks
 */
export const getOptimizedUrl = (
  src: string,
  options: ImageTransformOptions
): string => {
  if (!src) return src;
  
  // Try Supabase transforms first
  if (isSupabaseUrl(src)) {
    return buildSupabaseUrl(src, options);
  }
  
  // Use Unsplash built-in transforms
  if (isUnsplashUrl(src)) {
    return buildUnsplashUrl(src, options);
  }
  
  // Fallback to weserv proxy for other URLs
  return buildWeservProxy(src, options);
};

/**
 * Generate srcset string for responsive images
 */
export const generateSrcSet = (
  src: string,
  widths: number[],
  options: Omit<ImageTransformOptions, 'width'>
): string => {
  return widths
    .map((width) => {
      const url = getOptimizedUrl(src, { ...options, width });
      return `${url} ${width}w`;
    })
    .join(', ');
};

/**
 * Memory cache for loaded images to skip skeleton on repeat renders
 */
const imageCache = new Set<string>();

export const isImageCached = (src: string): boolean => {
  return imageCache.has(src);
};

export const cacheImage = (src: string): void => {
  imageCache.add(src);
};
