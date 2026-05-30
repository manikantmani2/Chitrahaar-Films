import React from 'react';
import Image from 'next/image';
import {
  getGalleryThumbAvif,
  getGalleryThumbWebp,
  getGalleryPosterWebp,
} from '@/utils/imagePaths';

interface Props {
  src: string;
  alt?: string;
  size?: 'small' | 'large';
  role?: 'thumb' | 'poster';
  priority?: boolean;
  className?: string;
}

const GalleryImage: React.FC<Props> = ({ src, alt = '', size = 'small', role = 'thumb', priority = false, className = '' }) => {
  const usePoster = role === 'poster';
  const avif = usePoster ? getGalleryPosterWebp(src, size).replace(/\.webp$/i, '.avif') : getGalleryThumbAvif(src, size);
  const webp = usePoster ? getGalleryPosterWebp(src, size) : getGalleryThumbWebp(src, size);
  const fallback = webp || src;

  return (
    <picture className={`relative block h-full w-full ${className}`}>
      <source srcSet={avif} type="image/avif" />
      <source srcSet={webp} type="image/webp" />
      <Image src={fallback} alt={alt} fill className={className || 'object-cover'} loading={priority ? 'eager' : 'lazy'} priority={priority} />
    </picture>
  );
};

export default GalleryImage;
