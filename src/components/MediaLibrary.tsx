import React, { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '@/utils/animations';
import Section from './Section';
import Card from './Card';
import MediaDetailModal from './MediaDetailModal';
import type { PortfolioContentItem } from '@/types/content';

type EventType = 'All' | 'Wedding' | 'Clubs' | 'Events' | 'Food & Beverages' | 'Short Films';
type MediaType = 'all' | 'photo' | 'video';

const sampleVideoUrl = '/videos/intro.mp4';

const FALLBACK_WORK_ITEMS: PortfolioContentItem[] = [
  {
    id: 1,
    title: 'Wedding Highlights Photos',
    eventType: 'Wedding',
    mediaType: 'photo',
    thumb: '/gallery/wedding-photo.svg',
    description: 'Candid portraits, rituals, and cinematic wedding moments.',
    instagramUrl: 'https://instagram.com/chitrahaarfilms',
    youtubeUrl: 'https://youtube.com/@chitrahaarfilms',
  },
  {
    id: 2,
    title: 'Wedding Reel Video',
    eventType: 'Wedding',
    mediaType: 'video',
    thumb: '/gallery/wedding-video.svg',
    description: 'A premium wedding teaser with emotional storytelling.',
    duration: '01:12',
    videoUrl: sampleVideoUrl,
    instagramUrl: 'https://instagram.com/chitrahaarfilms',
    youtubeUrl: 'https://youtube.com/@chitrahaarfilms',
  },
  {
    id: 3,
    title: 'Clubs Night Photos',
    eventType: 'Clubs',
    mediaType: 'photo',
    thumb: '/gallery/clubs-photo.svg',
    description: 'Energetic nightlife captures for artists and venues.',
    instagramUrl: 'https://instagram.com/chitrahaarfilms',
    youtubeUrl: 'https://youtube.com/@chitrahaarfilms',
  },
  {
    id: 4,
    title: 'Clubs Promo Video',
    eventType: 'Clubs',
    mediaType: 'video',
    thumb: '/gallery/clubs-video.svg',
    description: 'Fast-paced vertical and cinematic edits for club promotion.',
    duration: '00:42',
    videoUrl: sampleVideoUrl,
    instagramUrl: 'https://instagram.com/chitrahaarfilms',
    youtubeUrl: 'https://youtube.com/@chitrahaarfilms',
  },
  {
    id: 5,
    title: 'Event Coverage Photos',
    eventType: 'Events',
    mediaType: 'photo',
    thumb: '/gallery/events-photo.svg',
    description: 'Launches, conferences, and social event captures.',
    instagramUrl: 'https://instagram.com/chitrahaarfilms',
    youtubeUrl: 'https://youtube.com/@chitrahaarfilms',
  },
  {
    id: 6,
    title: 'Event Aftermovie',
    eventType: 'Events',
    mediaType: 'video',
    thumb: '/gallery/events-video.svg',
    description: 'Complete event story with highlights and keynote moments.',
    duration: '01:35',
    videoUrl: sampleVideoUrl,
    instagramUrl: 'https://instagram.com/chitrahaarfilms',
    youtubeUrl: 'https://youtube.com/@chitrahaarfilms',
  },
  {
    id: 7,
    title: 'Food & Beverages Photos',
    eventType: 'Food & Beverages',
    mediaType: 'photo',
    thumb: '/gallery/food-beverages-photo.svg',
    description: 'Menu showcases, plating, ambience, and signature dishes.',
    instagramUrl: 'https://instagram.com/chitrahaarfilms',
    youtubeUrl: 'https://youtube.com/@chitrahaarfilms',
  },
  {
    id: 8,
    title: 'Food & Beverages Promo Video',
    eventType: 'Food & Beverages',
    mediaType: 'video',
    thumb: '/gallery/food-beverages-video.svg',
    description: 'Recipe reels and cinematic food promos for brands.',
    duration: '00:58',
    videoUrl: sampleVideoUrl,
    instagramUrl: 'https://instagram.com/chitrahaarfilms',
    youtubeUrl: 'https://youtube.com/@chitrahaarfilms',
  },
  {
    id: 9,
    title: 'Short Films Showcase',
    eventType: 'Short Films',
    mediaType: 'video',
    thumb: '/gallery/short-films-video.svg',
    description: 'Narrative films and dramatic cinematic sequences.',
    duration: '02:08',
    videoUrl: sampleVideoUrl,
    instagramUrl: 'https://instagram.com/chitrahaarfilms',
    youtubeUrl: 'https://youtube.com/@chitrahaarfilms',
  },
];

const eventTypes: EventType[] = ['All', 'Wedding', 'Clubs', 'Events', 'Food & Beverages', 'Short Films'];

type RunningStripProps = {
  title: string;
  items: PortfolioContentItem[];
  onOpenItem: (item: PortfolioContentItem) => void;
};

const RunningStrip: React.FC<RunningStripProps> = ({ title, items, onOpenItem }) => {
  const stripRef = useRef<HTMLDivElement | null>(null);
  const [cardWidth, setCardWidth] = useState<number | null>(null);
  const currentIndexRef = useRef(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    currentIndexRef.current = 0;
    setCurrentIndex(0);
  }, [items]);

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;

    const onScroll = () => {
      const track = strip.querySelector(':scope > div');
      if (!track) return;
      const cards = Array.from(track.children) as HTMLElement[];
      if (!cards.length) return;

      const center = strip.scrollLeft + strip.clientWidth / 2;
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

      currentIndexRef.current = closest;
      setCurrentIndex(closest);
    };

    strip.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => strip.removeEventListener('scroll', onScroll);
  }, [items]);

  // compute a card width so each card takes a single frame in the carousel
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;

    const compute = () => {
      const w = strip.clientWidth;
      let ratio = 0.85;
      if (w >= 1280) ratio = 0.72;
      else if (w >= 1024) ratio = 0.78;
      else if (w >= 768) ratio = 0.86;
      else ratio = 0.95;
      setCardWidth(Math.max(260, Math.floor(w * ratio)));
    };

    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, [items]);

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const track = strip.querySelector(':scope > div');
    if (!track) return;

    const cards = Array.from(track.children) as HTMLElement[];
    if (!cards.length) return;

    const index = Math.min(currentIndexRef.current, cards.length - 1);
    const target = cards[index];
    const left = target.offsetLeft - (strip.clientWidth - target.clientWidth) / 2;
    strip.scrollTo({ left: Math.max(0, left), behavior: 'auto' });
  }, [items]);

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

    const scheduleNext = (localStrip: HTMLDivElement) => {
      clear();
      const track = localStrip.querySelector(':scope > div');
      if (!track) return;
      const cards = Array.from(track.children) as HTMLElement[];
      if (!cards.length) return;

      const idx = currentIndexRef.current;
      const currentItem = items[idx];
      const parsed = parseDuration(currentItem?.duration || undefined);
      const isVideo = currentItem?.mediaType === 'video' || !!currentItem?.videoUrl;
      const dwell = parsed ? Math.min(Math.max(parsed * 1000, 3000), 20000) : (isVideo ? 9000 : 5000);

      timeoutId = window.setTimeout(() => {
        if (cancelled) return;
        if (userInteracted) {
          userInteracted = false;
          scheduleNext(localStrip);
          return;
        }

        const nextIndex = (currentIndexRef.current + 1) % cards.length;
        const target = cards[nextIndex];
        const left = target.offsetLeft - (localStrip.clientWidth - target.clientWidth) / 2;
        localStrip.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
        currentIndexRef.current = nextIndex;
        setCurrentIndex(nextIndex);
        scheduleNext(localStrip);
      }, dwell);
    };

    const localStrip = stripRef.current;
    if (!localStrip || items.length <= 1) return;

    const onUserScroll = () => {
      userInteracted = true;
      clear();
      timeoutId = window.setTimeout(() => {
        userInteracted = false;
        if (!cancelled && localStrip) scheduleNext(localStrip);
      }, 1200);
    };

    localStrip.addEventListener('scroll', onUserScroll, { passive: true });
    scheduleNext(localStrip);

    return () => {
      cancelled = true;
      clear();
      if (localStrip) localStrip.removeEventListener('scroll', onUserScroll);
    };
  }, [items]);

  return (
    <div className="mb-10">
        <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[rgba(212,175,55,0.9)]">Running Strip</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">{title}</h3>
        </div>
      </div>

      <motion.div
        ref={stripRef}
        className="overflow-x-auto -mx-4 py-4 px-4 scrollbar-hide snap-carousel"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        role="region"
        aria-label={title}
      >
          <div className="flex gap-6 items-stretch">
          {items.map((item, idx) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              custom={idx * 0.05}
              className={`snap-item transition-all duration-500 ease-out ${idx === currentIndex ? 'scale-[1.18] md:scale-[1.22] opacity-100 z-40 shadow-[0_18px_50px_rgba(0,0,0,0.32)]' : 'scale-[0.78] md:scale-[0.84] opacity-50 z-10'}`} 
              style={cardWidth ? { width: cardWidth } : undefined}
            >
              <Card variant="hover" className="overflow-hidden rounded-[20px] glass-effect hover-lift p-0">
                <button
                  type="button"
                  onClick={() => onOpenItem(item)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      onOpenItem(item);
                    }
                  }}
                  className="relative block w-full text-left"
                >
                    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[20px]">
                    <Image
                      src={item.thumb}
                      alt={item.title}
                      fill
                      sizes={item.mediaType === 'video' ? '(min-width:1280px) 840px, (min-width:768px) 680px, 420px' : '(min-width:1024px) 680px, (min-width:768px) 560px, 380px'}
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMB/0rXyQAAAABJRU5ErkJggg=="
                    />

                    {item.mediaType === 'video' && idx === currentIndex ? (
                      <video
                        src={item.videoUrl || sampleVideoUrl}
                        muted
                        autoPlay
                        loop
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover opacity-90"
                      />
                    ) : null}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-90" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="truncate text-lg md:text-xl font-display text-text-primary">{item.title}</h3>
                        <p className="mt-1 text-xs uppercase tracking-[0.26em] text-text-secondary">{item.eventType}</p>
                      </div>
                      <span className="shrink-0 rounded-full border border-[rgba(212,175,55,0.18)] bg-black/30 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-[rgba(212,175,55,0.95)] backdrop-blur-sm">
                        {item.duration || item.mediaType}
                      </span>
                    </div>
                  </div>
                </button>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

const MediaLibrary: React.FC = () => {
  const [eventType, setEventType] = useState<EventType>('All');
  const [items, setItems] = useState<PortfolioContentItem[]>(FALLBACK_WORK_ITEMS);
  const [activeItem, setActiveItem] = useState<PortfolioContentItem | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadPortfolio = async () => {
      try {
        const response = await fetch('/api/content');
        if (!response.ok) {
          return;
        }

        const data = await response.json();
        const nextItems = Array.isArray(data?.portfolio) ? data.portfolio : [];
        if (!cancelled && nextItems.length > 0) {
          setItems(nextItems);
        }
      } catch {
        // fall back to static content
      }
    };

    void loadPortfolio();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const eventOk = eventType === 'All' || item.eventType === eventType;
      return eventOk;
    });
  }, [eventType, items]);

  const openItem = (item: PortfolioContentItem) => {
    setActiveItem(item);
  };

  const relatedSuggestions = useMemo(() => {
    if (!activeItem) return [];

    const sameEvent = items.filter(
      (item) => item.id !== activeItem.id && item.eventType === activeItem.eventType,
    );

    const sameTypeOtherEvent = items.filter(
      (item) => item.id !== activeItem.id && item.mediaType === activeItem.mediaType && item.eventType !== activeItem.eventType,
    );

    const oppositeTypeSameEvent = items.filter(
      (item) => item.id !== activeItem.id && item.mediaType !== activeItem.mediaType && item.eventType === activeItem.eventType,
    );

    const oppositeTypeOtherEvent = items.filter(
      (item) => item.id !== activeItem.id && item.mediaType !== activeItem.mediaType && item.eventType !== activeItem.eventType,
    );

    const seen = new Set<number>();

    return [...sameEvent, ...sameTypeOtherEvent, ...oppositeTypeSameEvent, ...oppositeTypeOtherEvent]
      .filter((item) => {
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      })
      .slice(0, 6)
      .map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        mediaType: item.mediaType,
        thumb: item.thumb,
        duration: item.duration,
      }));
  }, [activeItem, items]);

  const photoItems = useMemo(
    () => filteredItems.filter((item) => item.mediaType === 'photo'),
    [filteredItems],
  );

  const videoItems = useMemo(
    () => filteredItems.filter((item) => item.mediaType === 'video'),
    [filteredItems],
  );

  return (
    <Section
      id="portfolio"
      title="Our Works Gallery"
      subtitle="Browse photos and videos by event type: Wedding, Clubs, Events, Food & Beverages, and Short Films"
      background="gradient"
    >
      <div className="flex w-full gap-3 overflow-x-auto whitespace-nowrap rounded-2xl border border-[rgba(255,255,255,0.03)] bg-[rgba(255,255,255,0.02)] px-3 py-3 scrollbar-hide mb-8">
        <span className="shrink-0 rounded-full border border-[rgba(212,175,55,0.08)] bg-[rgba(212,175,55,0.03)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[rgba(212,175,55,0.9)]">Filters</span>
        {eventTypes.map((et) => (
          <button
            key={et}
            onClick={() => setEventType(et)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-300 ${eventType === et ? 'bg-[rgba(212,175,55,0.12)] text-[var(--color-text)] border-[rgba(212,175,55,0.12)]' : 'border-[rgba(255,255,255,0.03)] text-[var(--color-muted)] hover:border-[rgba(212,175,55,0.08)]'}`}
          >
            {et}
          </button>
        ))}

      </div>

      <RunningStrip title="Photo Strip" items={photoItems} onOpenItem={openItem} />
      <RunningStrip title="Video Strip" items={videoItems} onOpenItem={openItem} />

      <MediaDetailModal
        open={!!activeItem}
        title={activeItem?.title || ''}
        description={activeItem?.description || ''}
        kind={activeItem?.mediaType === 'video' ? 'video' : 'photo'}
        src={activeItem?.mediaType === 'video' ? (activeItem?.videoUrl || sampleVideoUrl) : (activeItem?.thumb || '')}
        poster={activeItem?.thumb}
        metaLabel={activeItem?.eventType}
        metaValue={activeItem?.duration || activeItem?.mediaType || ''}
                      sourceLinks={activeItem ? [
            { label: 'Instagram', href: activeItem.instagramUrl },
            ...(activeItem.mediaType === 'video' ? [{ label: 'YouTube', href: activeItem.youtubeUrl }] : []),
          ] : []}
        suggestions={relatedSuggestions}
        onSelectSuggestion={(suggestionId) => {
          const nextItem = items.find((item) => item.id === suggestionId) || null;
          setActiveItem(nextItem);
        }}
        storageKey={activeItem ? `portfolio:${activeItem.id}` : 'portfolio:unknown'}
        onClose={() => setActiveItem(null)}
      />
    </Section>
  );
};

export default MediaLibrary;

