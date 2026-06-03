const GALLERY_ROOT = '/gallery';
const GALLERY_THUMBS_ROOT = '/gallery/thumbs';

const MEDIA_EXTENSIONS = /\.(mp4|m4v|mov|webm|mkv)$/i;

const MEDIA_BASE_URL = process.env.NEXT_PUBLIC_MEDIA_BASE_URL?.replace(/\/+|\s+$/g, '') || '';

export const makeGallerySafePath = (path: string) => {
  if (!path) return path;

  return path
    .replace(`${GALLERY_ROOT}/`, '')
    .replace(/\\|\//g, '_')
    .replace(/\s+/g, '_')
    .replace(/&/g, 'and')
    .replace(/\.[^.]+$/, '');
};

const resolveGalleryPath = (path: string) => getMediaUrl(path);

export const getGalleryThumbWebp = (path: string, size: 'small' | 'large' = 'small') => {
  try {
    if (!path) return path;
    if (path.startsWith(GALLERY_THUMBS_ROOT)) return resolveGalleryPath(path);
    if (!path.startsWith(GALLERY_ROOT)) return path;

    const safePath = makeGallerySafePath(path);
    const thumbPath = MEDIA_EXTENSIONS.test(path)
      ? size === 'small'
        ? `${GALLERY_THUMBS_ROOT}/${safePath}@640.webp`
        : `${GALLERY_THUMBS_ROOT}/${safePath}.webp`
      : `${GALLERY_THUMBS_ROOT}/${safePath}.webp`;

    return resolveGalleryPath(thumbPath);
  } catch {
    return path;
  }
};

export const getGalleryThumbAvif = (path: string, size: 'small' | 'large' = 'small') => {
  try {
    if (!path) return path;
    if (path.startsWith(GALLERY_THUMBS_ROOT)) return resolveGalleryPath(path);
    if (!path.startsWith(GALLERY_ROOT)) return path;

    const safePath = makeGallerySafePath(path);
    const thumbPath = MEDIA_EXTENSIONS.test(path)
      ? size === 'small'
        ? `${GALLERY_THUMBS_ROOT}/${safePath}@640.avif`
        : `${GALLERY_THUMBS_ROOT}/${safePath}.avif`
      : `${GALLERY_THUMBS_ROOT}/${safePath}.avif`;

    return resolveGalleryPath(thumbPath);
  } catch {
    return path;
  }
};

export const getGalleryPosterWebp = (path: string, size: 'small' | 'large' = 'large') => {
  try {
    if (!path) return path;
    if (path.startsWith(GALLERY_THUMBS_ROOT)) return resolveGalleryPath(path);
    if (!path.startsWith(GALLERY_ROOT)) return path;

    const safePath = makeGallerySafePath(path);
    const posterPath = size === 'small'
      ? `${GALLERY_THUMBS_ROOT}/${safePath}@640.webp`
      : `${GALLERY_THUMBS_ROOT}/${safePath}.webp`;

    return resolveGalleryPath(posterPath);
  } catch {
    return path;
  }
};

export const getMediaUrl = (path?: string) => {
  if (!path) return '';
  const trimmed = path.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (!MEDIA_BASE_URL) return trimmed;
  return trimmed.startsWith('/') ? `${MEDIA_BASE_URL}${trimmed}` : `${MEDIA_BASE_URL}/${trimmed}`;
};

export const encodeMediaUrl = (path?: string) => {
  const raw = getMediaUrl(path);
  if (!raw) return '';
  try {
    return encodeURI(raw).replace(/&/g, '%26');
  } catch {
    return raw;
  }
};

export const getGalleryPosterAvif = (path: string, size: 'small' | 'large' = 'large') => {
  try {
    if (!path) return path;
    if (path.startsWith(GALLERY_THUMBS_ROOT)) return resolveGalleryPath(path);
    if (!path.startsWith(GALLERY_ROOT)) return path;

    const safePath = makeGallerySafePath(path);
    const posterPath = size === 'small'
      ? `${GALLERY_THUMBS_ROOT}/${safePath}@640.avif`
      : `${GALLERY_THUMBS_ROOT}/${safePath}.avif`;

    return resolveGalleryPath(posterPath);
  } catch {
    return path;
  }
};