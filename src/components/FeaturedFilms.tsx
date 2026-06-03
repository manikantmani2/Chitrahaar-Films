import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Section from './Section';
import { containerVariants, itemVariants } from '@/utils/animations';
import Card from './Card';
import MediaDetailModal from './MediaDetailModal';
import type { FeaturedContentItem } from '@/types/content';
import {
  getGalleryPosterWebp,
  getGalleryThumbAvif,
  getGalleryThumbWebp,
} from '@/utils/imagePaths';
import { normalizeGalleryGroup } from '@/utils/gallerySuggestions';

type ViewerItem = {
  id: string | number;
  title: string;
  description: string;
  mediaType: 'photo' | 'video';
  thumb: string;
  duration?: string;
  group?: string | undefined;
  kind: 'photo' | 'video';
  src: string;
  poster?: string;
  storageKey: string;
};

const FALLBACK_FEATURED: FeaturedContentItem[] = [];

function safeUrl(url: string) {
  return encodeURI(url);
}

const createFeaturedViewerItem = (item: FeaturedContentItem): ViewerItem => ({
  id: `featured:${item.id}`,
  title: item.title,
  description: item.duration ? `Featured film • ${item.duration}` : 'Featured film',
  mediaType: 'video',
  thumb: safeUrl(item.thumb),
  duration: item.duration,
  group: 'featured',
  kind: 'video',
  src: safeUrl(item.video || ''),
  poster: item.video ? getGalleryPosterWebp(safeUrl(item.video), 'large') : safeUrl(item.thumb),
  storageKey: `featured:${item.id}`,
});

const createPortfolioViewerItem = (item: { id: number; title: string; eventType: string; mediaType: 'photo' | 'video'; thumb: string; description: string; duration?: string; videoUrl?: string; }) => ({
  id: `portfolio:${item.id}`,
  title: item.title,
  description: item.description,
  mediaType: item.mediaType,
  thumb: safeUrl(item.thumb),
  duration: item.duration,
  group: normalizeGalleryGroup(item.eventType),
  kind: item.mediaType,
  src: item.mediaType === 'video' ? safeUrl(item.videoUrl || item.thumb) : safeUrl(item.thumb),
  poster: item.mediaType === 'video' ? getGalleryPosterWebp(safeUrl(item.videoUrl || item.thumb), 'large') : undefined,
  storageKey: `portfolio:${item.id}`,
});

const FeaturedFilms: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [cardWidth, setCardWidth] = useState<number | null>(null);
  const [featured, setFeatured] = useState<FeaturedContentItem[]>(FALLBACK_FEATURED);
  const [catalog, setCatalog] = useState<ViewerItem[]>(FALLBACK_FEATURED.map(createFeaturedViewerItem));
  const [activeItem, setActiveItem] = useState<ViewerItem | null>(null);
  const [current, setCurrent] = useState(0);
  const currentIndexRef = useRef(0);

  const handleViewerPrev = () => {
    if (!catalog.length) return;
    const prevIndex = (currentIndexRef.current - 1 + catalog.length) % catalog.length;
    currentIndexRef.current = prevIndex;
    setCurrent(prevIndex);
    setActiveItem(catalog[prevIndex]);
  };

  const handleViewerNext = () => {
    if (!catalog.length) return;
    const nextIndex = (currentIndexRef.current + 1) % catalog.length;
    currentIndexRef.current = nextIndex;
    setCurrent(nextIndex);
    setActiveItem(catalog[nextIndex]);
  };

  useEffect(() => {
    let cancelled = false;
    let timeoutId: number | null = null;
    let userInteracted = false;

    const clear = () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
        timeoutId = null;
      }
    };

    const parseDuration = (dur?: string) => {
      if (!dur) return null;
      const parts = dur.split(':').map(Number).reverse();
      let seconds = 0;
      if (parts.length >= 1) seconds += parts[0];
      if (parts.length >= 2) seconds += parts[1] * 60;
      if (parts.length >= 3) seconds += parts[2] * 3600;
      return seconds;
    };

    const scheduleNext = () => {
      clear();
      const el = containerRef.current;
      if (!el) return;
      const track = el.querySelector(':scope > div');
      if (!track) return;
      const items = Array.from(track.children) as HTMLElement[];
      if (!items.length) return;

      const idx = currentIndexRef.current;
      const currentItem = catalog[idx];
      const parsed = parseDuration(currentItem?.duration || undefined);
      const isVideo = currentItem?.kind === 'video';
      const dwell = parsed ? Math.min(Math.max(parsed * 1000, 3000), 20000) : (isVideo ? 9000 : 5000);

      timeoutId = window.setTimeout(() => {
        if (userInteracted) {
          userInteracted = false;
          scheduleNext();
          return;
        }

        const nextIndex = (currentIndexRef.current + 1) % items.length;
        const target = items[nextIndex];
        const left = target.offsetLeft - (el.clientWidth - target.clientWidth) / 2;
        el.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
        currentIndexRef.current = nextIndex;
        setCurrent(nextIndex);
        scheduleNext();
      }, dwell);
    };

    const onUserScroll = () => {
      userInteracted = true;
      clear();
      timeoutId = window.setTimeout(() => {
        userInteracted = false;
        scheduleNext();
      }, 1200);
    };

    const loadFeatured = async () => {
      try {
        const response = await fetch('/api/content');
        if (!response.ok) return;
        const data = await response.json();
        const items = Array.isArray(data?.featured) ? data.featured : [];
        if (!cancelled) {
          if (items.length > 0) setFeatured(items);
          const nextCatalog = items.map(createFeaturedViewerItem);
          setCatalog(nextCatalog);
        }
      } catch {
        // fall back to static content
      }
    };

    void loadFeatured();

    const localEl = containerRef.current;
    if (localEl) {
      const track = localEl.querySelector(':scope > div');
      if (track) {
        const children = Array.from(track.children) as HTMLElement[];
        if (children.length) {
          const firstTarget = children[0];
          const firstLeft = firstTarget.offsetLeft - (localEl.clientWidth - firstTarget.clientWidth) / 2;
          localEl.scrollTo({ left: Math.max(0, firstLeft), behavior: 'auto' });
        }
      }

      localEl.addEventListener('scroll', onUserScroll, { passive: true });
    }

    scheduleNext();

    return () => {
      clear();
      if (localEl) localEl.removeEventListener('scroll', onUserScroll);
      cancelled = true;
    };
  }, [catalog]);

  // compute a card width so each featured card fills the visible frame
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const compute = () => {
      const w = el.clientWidth;
      let ratio = 0.78;
      if (w >= 1280) ratio = 0.7;
      else if (w >= 1024) ratio = 0.76;
      else if (w >= 768) ratio = 0.84;
      else ratio = 0.95;
      setCardWidth(Math.max(300, Math.floor(w * ratio)));
    };

    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, [catalog.length]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onScroll = () => {
      const track = el.querySelector(':scope > div');
      if (!track) return;
      const cards = Array.from(track.children) as HTMLElement[];
      if (!cards.length) return;

      const center = el.scrollLeft + el.clientWidth / 2;
      let closest = 0;
      let minDist = Infinity;

      cards.forEach((child, idx) => {
        const childCenter = child.offsetLeft + child.clientWidth / 2;
        const dist = Math.abs(center - childCenter);
        if (dist < minDist) {
          minDist = dist;
          closest = idx;
        }
      });

      setCurrent(closest);
      currentIndexRef.current = closest;
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener('scroll', onScroll);
  }, [catalog]);

  return (
    <Section id="featured" title="Featured Films" subtitle="Curated cinematic stories" background="default">
      <motion.div
        className="relative"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div ref={containerRef} className="overflow-x-auto -mx-4 py-6 scrollbar-hide px-4 snap-carousel" role="region" aria-label="Featured films carousel">
          <div className="flex gap-6">
            {catalog.map((item, idx) => (
              <motion.div
                key={item.id}
                className={`snap-item transition-all duration-500 ease-out ${idx === current ? 'scale-[1.15] md:scale-[1.2] opacity-100 z-30 shadow-[0_18px_50px_rgba(0,0,0,0.3)]' : 'scale-[0.82] md:scale-[0.86] opacity-55 z-10'}`}
                style={cardWidth ? { width: cardWidth } : undefined}
                variants={itemVariants}
                role="listitem"
                tabIndex={0}
              >
                <Card variant="hover" className="p-0 overflow-hidden rounded-2xl">
                  <button
                    type="button"
                    className="relative w-full text-left"
                    onClick={() => {
                      currentIndexRef.current = idx;
                      setCurrent(idx);
                      setActiveItem(item);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        currentIndexRef.current = idx;
                        setCurrent(idx);
                        setActiveItem(item);
                      }
                    }}
                  >
                    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl">
                      <picture className="relative block h-full w-full">
                        <source srcSet={getGalleryThumbAvif(item.thumb, 'large')} type="image/avif" />
                        <source srcSet={getGalleryThumbWebp(item.thumb, 'large')} type="image/webp" />
                        <Image
                          src={item.thumb}
                          alt={item.title}
                          fill
                          sizes={item.kind === 'video' ? '(min-width:1280px) 860px, (min-width:768px) 720px, 420px' : '(min-width:1024px) 660px, 360px'}
                          className="object-cover object-center transition-transform duration-500 hover:scale-105"
                          loading="lazy"
                          placeholder="blur"
                          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMB/0rXyQAAAABJRU5ErkJggg=="
                        />
                      </picture>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                      <div className="absolute left-4 bottom-4">
                        <h3 className="text-xl font-display text-text-primary">{item.title}</h3>
                        <p className="text-sm text-text-secondary mt-1">{item.duration}</p>
                      </div>
                      <div className="absolute right-4 top-4 bg-[rgba(212,175,55,0.12)] text-gold rounded-full p-3">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 3v18l15-9L5 3z" fill="#D4AF37"/></svg>
                      </div>

                      {/* Only the centered item plays; the rest stay as still frames */}
                      {item.kind === 'video' && idx === current ? (
                        <video
                          src={item.src}
                          poster={item.poster}
                          preload="metadata"
                          autoPlay
                          muted
                          loop
                          playsInline
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : null}
                    </div>
                  </button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        
        <MediaDetailModal
          open={!!activeItem}
          title={activeItem?.title || ''}
          description={activeItem?.description || ''}
          kind={activeItem?.kind || 'video'}
          src={activeItem?.src || ''}
          poster={activeItem?.poster}
          metaLabel={activeItem?.group === 'featured' ? 'Featured film' : activeItem?.group || 'Portfolio item'}
          metaValue={activeItem?.duration}
          storageKey={activeItem ? activeItem.storageKey : 'featured:unknown'}
          onClose={() => setActiveItem(null)}
          onPrev={handleViewerPrev}
          onNext={handleViewerNext}
        />
      </motion.div>
    </Section>
  );
};

export default FeaturedFilms;

