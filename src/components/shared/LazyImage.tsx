

import React, { useState, useRef, useEffect } from 'react';
import { imageService } from '../../services/image/ImageService';
import { t } from '../../lang/helpers';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderClassName?: string;

  useResolveMediaPath?: boolean;
  loadingPlaceholder?: React.ReactNode;
  errorPlaceholder?: React.ReactNode;
  rootMargin?: string;
  threshold?: number;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  placeholderClassName = '',

  useResolveMediaPath = false,
  loadingPlaceholder,
  errorPlaceholder,
  rootMargin = '50px',
  threshold = 0.1,
}) => {
  
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  
  const containerRef = useRef<HTMLDivElement>(null);

  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect(); 
        }
      },
      {
        rootMargin,
        threshold,
      }
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  
  const imageUrl = isInView
    ? useResolveMediaPath
      ? imageService.resolveMediaPath(src)
      : imageService.getResourceUrl(src)
    : '';

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(false);
  };

  return (
    <div ref={containerRef} className={`lazy-image-container ${className}`}>
      
      {(!isInView || !isLoaded) && !hasError && (
        <div className={`lazy-image-placeholder ${placeholderClassName}`}>
          {loadingPlaceholder || (
            <div className="lazy-image-placeholder-inner">
              {t('image.loading')}
            </div>
          )}
        </div>
      )}

      
      {hasError && (
        <div className={`lazy-image-error ${placeholderClassName}`}>
          {errorPlaceholder || (
            <div className="lazy-image-error-inner">
              {t('image.load-failed')}
            </div>
          )}
        </div>
      )}

      
      {isInView && !hasError && (
        <img
          src={imageUrl}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={`lazy-image-img${isLoaded ? ' is-loaded' : ''}`}
        />
      )}
    </div>
  );
};
