const GALLERY_ROOT = '/our-works-gallery';
const GALLERY_THUMBS_ROOT = '/our-works-gallery/thumbs';

const MEDIA_EXTENSIONS = /\.(mp4|m4v|mov|webm|mkv)$/i;

export const makeGallerySafePath = (path: string) => {
  if (!path) return path;

  return path
    .replace(`${GALLERY_ROOT}/`, '')
    .replace(/\\|\//g, '_')
    .replace(/\s+/g, '_')
    .replace(/&/g, 'and')
    .replace(/\.[^.]+$/, '');
};

export const getGalleryThumbWebp = (path: string, size: 'small' | 'large' = 'small') => {
  try {
    if (!path) return path;
    // already a generated thumb — return as-is
    if (path.startsWith(GALLERY_THUMBS_ROOT)) return path;
    if (!path.startsWith(GALLERY_ROOT)) return path;

    const safePath = makeGallerySafePath(path);
    if (MEDIA_EXTENSIONS.test(path)) {
      return size === 'small'
        ? `${GALLERY_THUMBS_ROOT}/${safePath}@640.webp`
        : `${GALLERY_THUMBS_ROOT}/${safePath}.webp`;
    }

    return `${GALLERY_THUMBS_ROOT}/${safePath}.webp`;
  } catch {
    return path;
  }
};

export const getGalleryThumbAvif = (path: string, size: 'small' | 'large' = 'small') => {
  try {
    if (!path) return path;
    // already a generated thumb — return as-is
    if (path.startsWith(GALLERY_THUMBS_ROOT)) return path;
    if (!path.startsWith(GALLERY_ROOT)) return path;

    const safePath = makeGallerySafePath(path);
    if (MEDIA_EXTENSIONS.test(path)) {
      return size === 'small'
        ? `${GALLERY_THUMBS_ROOT}/${safePath}@640.avif`
        : `${GALLERY_THUMBS_ROOT}/${safePath}.avif`;
    }

    return `${GALLERY_THUMBS_ROOT}/${safePath}.avif`;
  } catch {
    return path;
  }
};

export const getGalleryPosterWebp = (path: string, size: 'small' | 'large' = 'large') => {
  try {
    if (!path) return path;
    // if already a thumbs path, use as-is
    if (path.startsWith(GALLERY_THUMBS_ROOT)) return path;
    if (!path.startsWith(GALLERY_ROOT)) return path;

    const safePath = makeGallerySafePath(path);
    return size === 'small'
      ? `${GALLERY_THUMBS_ROOT}/${safePath}@640.webp`
      : `${GALLERY_THUMBS_ROOT}/${safePath}.webp`;
  } catch {
    return path;
  }
};

export const getGalleryPosterAvif = (path: string, size: 'small' | 'large' = 'large') => {
  try {
    if (!path) return path;
    if (path.startsWith(GALLERY_THUMBS_ROOT)) return path;
    if (!path.startsWith(GALLERY_ROOT)) return path;

    const safePath = makeGallerySafePath(path);
    return size === 'small'
      ? `${GALLERY_THUMBS_ROOT}/${safePath}@640.avif`
      : `${GALLERY_THUMBS_ROOT}/${safePath}.avif`;
  } catch {
    return path;
  }
};