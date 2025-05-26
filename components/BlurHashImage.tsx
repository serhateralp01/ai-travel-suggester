import React, { useEffect, useRef, useState, ImgHTMLAttributes } from 'react';
import { decode } from 'blurhash';

interface BlurHashImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  blurHash?: string | null;
  hashWidth?: number;
  hashHeight?: number;
  alt: string;
  className?: string;
}

export const BlurHashImage: React.FC<BlurHashImageProps> = ({
  src,
  blurHash,
  hashWidth = 32, // Default BlurHash canvas width
  hashHeight = 32, // Default BlurHash canvas height
  alt,
  className,
  ...imgProps
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (blurHash && canvasRef.current) {
      try {
        const pixels = decode(blurHash, hashWidth, hashHeight);
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const imageData = ctx.createImageData(hashWidth, hashHeight);
          imageData.data.set(pixels);
          ctx.putImageData(imageData, 0, 0);
        }
      } catch (error) {
        console.error('Failed to decode blurhash', error);
        // Could set a fallback background on error if desired
      }
    }
  }, [blurHash, hashWidth, hashHeight]);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsError(true);
    if (imgProps.onError) {
      imgProps.onError(e);
    }
  };

  return (
    <div className={`relative overflow-hidden ${className || ''}`}>
      {blurHash && !isLoaded && !isError && (
        <canvas
          ref={canvasRef}
          width={hashWidth}
          height={hashHeight}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ease-in-out opacity-100"
        />
      )}
      {isError && !blurHash && (
        // Fallback for when image errors AND no blurhash is available (keeps space)
        <div className="absolute inset-0 w-full h-full bg-slate-700 flex items-center justify-center text-slate-500">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-16 h-16 opacity-50"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        onLoad={handleImageLoad}
        onError={handleImageError}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'} ${isError ? 'hidden' : ''}`}
        {...imgProps}
      />
      {isError && blurHash && (
        // If image errors but blurhash was shown, keep blurhash visible to avoid empty space
        // Canvas is already rendered and visible if blurhash exists
        // This ensures the canvas doesn't get hidden by the errored img if blurhash was there
        <div className="absolute inset-0 w-full h-full opacity-0">Error state with blurhash</div>
      )}
    </div>
  );
}; 