import React, { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaInstagram, FaYoutube } from 'react-icons/fa';
import { containerVariants, itemVariants } from '@/utils/animations';
import Section from './Section';
import Card from './Card';

type EventType = 'All' | 'Wedding' | 'Clubs' | 'Events' | 'Food & Beverages' | 'Short Films';
type MediaType = 'all' | 'photo' | 'video';

interface WorkItem {
  id: number;
  title: string;
  eventType: Exclude<EventType, 'All'>;
  mediaType: Exclude<MediaType, 'all'>;
  thumb: string;
  description: string;
  duration?: string;
  videoUrl?: string;
  instagramUrl: string;
  youtubeUrl: string;
}

const sampleVideoUrl = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';

const WORK_ITEMS: WorkItem[] = [
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

const MediaLibrary: React.FC = () => {
  const [eventType, setEventType] = useState<EventType>('All');
  const [mediaType, setMediaType] = useState<MediaType>('all');
  const [activeItem, setActiveItem] = useState<WorkItem | null>(null);
  const [hoverPreviewId, setHoverPreviewId] = useState<number | null>(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const filterStripRef = useRef<HTMLDivElement | null>(null);
  const galleryStripRef = useRef<HTMLDivElement | null>(null);
  const autoScrollTimerRef = useRef<number | null>(null);
  const galleryAutoScrollTimerRef = useRef<number | null>(null);
  const autoScrollIndexRef = useRef(0);
  const galleryAutoScrollIndexRef = useRef(0);

  const filteredItems = useMemo(() => {
    return WORK_ITEMS.filter((item) => {
      const eventOk = eventType === 'All' || item.eventType === eventType;
      const mediaOk = mediaType === 'all' || item.mediaType === mediaType;
      return eventOk && mediaOk;
    });
  }, [eventType, mediaType]);

  const handleFilterClick = (type: EventType | MediaType, kind: 'event' | 'media') => {
    if (kind === 'event') {
      setEventType(type as EventType);
    } else {
      setMediaType(type as MediaType);
    }
  };

  const openItem = (item: WorkItem) => {
    setIsAutoScrolling(false);
    setActiveItem(item);
  };

  useEffect(() => {
    const strip = filterStripRef.current;
    if (!strip || !isAutoScrolling) {
      return;
    }

    const scrollStep = () => {
      const items = Array.from(strip.querySelectorAll<HTMLElement>('[data-strip-item="true"]'));
      if (items.length === 0) {
        return;
      }

      const currentIndex = autoScrollIndexRef.current % items.length;
      const nextIndex = (currentIndex + 1) % items.length;
      autoScrollIndexRef.current = nextIndex;

      const target = items[nextIndex];
      const targetLeft = target.offsetLeft - strip.clientWidth / 2 + target.clientWidth / 2;

      strip.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
    };

    autoScrollTimerRef.current = window.setInterval(scrollStep, 2000);

    return () => {
      if (autoScrollTimerRef.current) {
        window.clearInterval(autoScrollTimerRef.current);
        autoScrollTimerRef.current = null;
      }
    };
  }, [isAutoScrolling]);

  useEffect(() => {
    const strip = galleryStripRef.current;
    if (!strip || !isAutoScrolling) {
      return;
    }

    const scrollStep = () => {
      const items = Array.from(strip.querySelectorAll<HTMLElement>('[data-gallery-item="true"]'));
      if (items.length === 0) {
        return;
      }

      let nextIndex = galleryAutoScrollIndexRef.current + 1;

      if (nextIndex >= items.length) {
        nextIndex = 0;
        strip.scrollTo({ left: 0, behavior: 'auto' });
        galleryAutoScrollIndexRef.current = 0;
        setTimeout(() => {
          const firstTarget = items[0];
          const firstTargetLeft = firstTarget.offsetLeft - strip.clientWidth / 2 + firstTarget.clientWidth / 2;
          strip.scrollTo({ left: Math.max(0, firstTargetLeft), behavior: 'smooth' });
        }, 100);
      } else {
        galleryAutoScrollIndexRef.current = nextIndex;
        const target = items[nextIndex];
        const targetLeft = target.offsetLeft - strip.clientWidth / 2 + target.clientWidth / 2;
        strip.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
      }
    };

    galleryAutoScrollTimerRef.current = window.setInterval(scrollStep, 3000);

    return () => {
      if (galleryAutoScrollTimerRef.current) {
        window.clearInterval(galleryAutoScrollTimerRef.current);
        galleryAutoScrollTimerRef.current = null;
      }
    };
  }, [isAutoScrolling]);

  useEffect(() => {
    const filterStrip = filterStripRef.current;
    const galleryStrip = galleryStripRef.current;
    if (isAutoScrolling) {
      return;
    }

    if (filterStrip) {
      filterStrip.scrollTo({ left: filterStrip.scrollLeft, behavior: 'auto' });
    }
    if (galleryStrip) {
      galleryStrip.scrollTo({ left: galleryStrip.scrollLeft, behavior: 'auto' });
    }
  }, [isAutoScrolling]);

  return (
    <Section
      id="works-gallery"
      title="Our Works Gallery"
      subtitle="Browse photos and videos by event type: Wedding, Clubs, Events, Food & Beverages, and Short Films"
      background="gradient"
    >
      <div ref={filterStripRef} className="flex w-full gap-3 overflow-x-auto whitespace-nowrap rounded-2xl border border-[rgba(255,255,255,0.03)] bg-[rgba(255,255,255,0.02)] px-3 py-3 scrollbar-hide mb-8">
        <span className="shrink-0 rounded-full border border-[rgba(212,175,55,0.08)] bg-[rgba(212,175,55,0.03)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[rgba(212,175,55,0.9)]">Filters</span>
        {eventTypes.map((et) => (
          <button
            key={et}
            onClick={() => handleFilterClick(et, 'event')}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-300 ${eventType === et ? 'bg-[rgba(212,175,55,0.12)] text-[var(--color-text)] border-[rgba(212,175,55,0.12)]' : 'border-[rgba(255,255,255,0.03)] text-[var(--color-muted)] hover:border-[rgba(212,175,55,0.08)]'}`}
          >
            {et}
          </button>
        ))}

        <span className="shrink-0 rounded-full border border-[rgba(212,175,55,0.08)] bg-[rgba(212,175,55,0.03)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[rgba(212,175,55,0.9)] ml-4">Media</span>
        {(['all', 'photo', 'video'] as MediaType[]).map((mt) => (
          <button
            key={mt}
            onClick={() => handleFilterClick(mt, 'media')}
            className={`shrink-0 px-4 py-2 rounded-lg text-sm font-semibold border transition-all duration-300 ${mediaType === mt ? 'bg-[rgba(212,175,55,0.12)] text-[var(--color-text)] border-[rgba(212,175,55,0.12)]' : 'border-[rgba(255,255,255,0.03)] text-[var(--color-muted)] hover:border-[rgba(212,175,55,0.08)]'}`}
          >
            {mt === 'all' ? 'All' : mt === 'photo' ? 'Photos' : 'Videos'}
          </button>
        ))}
      </div>

      <motion.div
        ref={galleryStripRef}
        className="media-masonry"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        {filteredItems.map((item, idx) => (
          <motion.div key={item.id} variants={itemVariants} custom={idx * 0.05} className="mb-6 break-inside">
            <Card variant="hover" className="overflow-hidden rounded-[20px] glass-effect hover-lift">
              <div
                onMouseEnter={() => setHoverPreviewId(item.id)}
                onMouseLeave={() => setHoverPreviewId((id) => (id === item.id ? null : id))}
                className="relative w-full"
              >
                <div className="relative w-full h-64 md:h-72 lg:h-80">
                  <Image src={item.thumb} alt={item.title} fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" placeholder="blur" blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMB/0rXyQAAAABJRU5ErkJggg==" />

                  {item.mediaType === 'video' && hoverPreviewId === item.id && (
                    <video
                      src={item.videoUrl || sampleVideoUrl}
                      muted
                      autoPlay
                      loop
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover opacity-90"
                    />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-lg md:text-xl font-display text-text-primary">{item.title}</h3>
                    <p className="text-sm text-text-secondary mt-1">{item.eventType} • {item.duration || 'Gallery Item'}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-2">
                <h3 className="text-heading-2 font-bold">{item.title}</h3>
                <span className="text-xs px-2 py-1 rounded-full border border-accent/40 text-accent">
                  {item.eventType}
                </span>
              </div>

              <p className="text-text-secondary text-sm mb-4 flex-grow">{item.description}</p>

              <div className="text-xs text-text-secondary border-t border-border pt-3 flex justify-between items-center">
                <span className="uppercase tracking-wide">{item.mediaType}</span>
                <span>{item.duration || 'Gallery Item'}</span>
              </div>

              <div className="mt-4 flex gap-3">
                <a
                  href={item.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-sm px-3 py-2 rounded-lg border border-border text-text-secondary hover:border-accent hover:text-accent transition-all duration-300 flex items-center justify-center gap-2 ${
                    item.mediaType === 'photo' ? 'w-full' : 'flex-1'
                  }`}
                >
                  <FaInstagram />
                  Instagram
                </a>
                {item.mediaType === 'video' && (
                  <a
                    href={item.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-sm px-3 py-2 rounded-lg border border-border text-text-secondary hover:border-accent hover:text-accent transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <FaYoutube />
                    YouTube
                  </a>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-6" onClick={() => setActiveItem(null)}>
          <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-[#0c1119] shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <h3 className="text-xl font-semibold text-white">{activeItem.title}</h3>
                <p className="text-sm text-white/55">{activeItem.eventType} • {activeItem.mediaType}</p>
              </div>
              <button onClick={() => setActiveItem(null)} className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/80 hover:bg-white/10 transition">
                Close
              </button>
            </div>

            <div className="grid gap-0 lg:grid-cols-[1.5fr_0.9fr]">
              <div className="relative min-h-[320px] bg-black">
                {activeItem.mediaType === 'photo' ? (
                  <Image src={activeItem.thumb} alt={activeItem.title} fill sizes="100vw" className="object-contain" priority />
                ) : (
                  <video controls autoPlay playsInline poster={activeItem.thumb} className="h-full w-full bg-black object-contain">
                    <source src={activeItem.videoUrl || sampleVideoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>

              <div className="space-y-4 p-5 md:p-6">
                <p className="text-sm leading-relaxed text-white/70">{activeItem.description}</p>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/40">Event</p>
                  <p className="mt-2 text-lg font-medium">{activeItem.eventType}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/40">Media type</p>
                  <p className="mt-2 text-lg font-medium capitalize">{activeItem.mediaType}</p>
                </div>
                <div className="flex flex-col gap-3">
                  <a href={activeItem.instagramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-4 py-3 font-semibold text-primary transition hover:opacity-90">
                    <FaInstagram /> Open Instagram
                  </a>
                  {activeItem.mediaType === 'video' && (
                    <a href={activeItem.youtubeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-semibold text-white transition hover:bg-white/10">
                      <FaYoutube /> Open YouTube
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Section>
  );
};

    // Removed stray code and duplicate export
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

