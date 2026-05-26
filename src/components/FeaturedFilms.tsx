import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Section from './Section';
import { containerVariants, itemVariants } from '@/utils/animations';
import Card from './Card';

const FEATURED = [
  { id: 1, title: 'The Forever Moments', thumb: '/gallery/featured1.jpg', duration: '03:12', video: '/gallery/featured1.mp4' },
  { id: 2, title: 'Golden Vows', thumb: '/gallery/featured2.jpg', duration: '02:45', video: '/gallery/featured2.mp4' },
  { id: 3, title: 'Midnight Revels', thumb: '/gallery/featured3.jpg', duration: '01:58', video: '/gallery/featured3.mp4' },
];

const FeaturedFilms: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!containerRef.current) return;
      if (e.key === 'ArrowRight') scrollNext();
      if (e.key === 'ArrowLeft') scrollPrev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const track = el.querySelector(':scope > div');
    if (!track) return;

    const onScroll = () => {
      const children = Array.from(track.children) as HTMLElement[];
      const center = el.scrollLeft + el.clientWidth / 2;
      let closest = 0;
      let minDist = Infinity;
      children.forEach((child, idx) => {
        const childCenter = child.offsetLeft + child.clientWidth / 2;
        const dist = Math.abs(center - childCenter);
        if (dist < minDist) {
          minDist = dist;
          closest = idx;
        }
      });
      setCurrent(closest);
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const scrollNext = () => {
    if (!containerRef.current) return;
    const w = containerRef.current.clientWidth;
    containerRef.current.scrollBy({ left: w * 0.7, behavior: 'smooth' });
  };

  const scrollPrev = () => {
    if (!containerRef.current) return;
    const w = containerRef.current.clientWidth;
    containerRef.current.scrollBy({ left: -w * 0.7, behavior: 'smooth' });
  };

  return (
    <Section id="featured" title="Featured Films" subtitle="Curated cinematic stories" background="default">
      <motion.div
        className="relative"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="absolute right-4 top-2 z-20 flex gap-2">
          <button aria-label="Previous" onClick={scrollPrev} className="btn rounded-full bg-black/50 border border-gold/20 text-gold p-2">
            ‹
          </button>
          <button aria-label="Next" onClick={scrollNext} className="btn rounded-full bg-black/50 border border-gold/20 text-gold p-2">
            ›
          </button>
        </div>

        <div ref={containerRef} className="overflow-x-auto -mx-4 py-6 scrollbar-hide px-4 snap-carousel" role="region" aria-label="Featured films carousel">
          <div className="flex gap-6">
            {FEATURED.map((f) => (
              <motion.div key={f.id} className="min-w-[320px] md:min-w-[420px] snap-item" variants={itemVariants} role="listitem" tabIndex={0}>
                <Card variant="hover" className="p-0 overflow-hidden rounded-2xl">
                  <div
                    className="relative w-full h-64 md:h-80"
                    onMouseEnter={() => setHovered(f.id)}
                    onMouseLeave={() => setHovered((s) => (s === f.id ? null : s))}
                  >
                    <Image src={f.thumb} alt={f.title} fill sizes="(min-width:1024px) 420px, 320px" className="object-cover transition-transform duration-500 hover:scale-105" loading="lazy" placeholder="blur" blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMB/0rXyQAAAABJRU5ErkJggg==" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute left-4 bottom-4">
                      <h3 className="text-xl font-display text-text-primary">{f.title}</h3>
                      <p className="text-sm text-text-secondary mt-1">{f.duration}</p>
                    </div>
                    <div className="absolute right-4 top-4 bg-[rgba(212,175,55,0.12)] text-gold rounded-full p-3">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 3v18l15-9L5 3z" fill="#D4AF37"/></svg>
                    </div>

                    {/* Hover teaser video (if available) */}
                    {hovered === f.id && f.video ? (
                      <video
                        src={f.video}
                        poster={f.thumb}
                        preload="metadata"
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : null}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Dots / progress indicators */}
        <div className="flex items-center justify-center gap-3 mt-4" aria-hidden={false}>
          {FEATURED.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === current}
              className={`w-3 h-3 rounded-full focus-visible:outline-none ${i === current ? 'bg-gold' : 'bg-accent/30'}`}
              onClick={() => {
                const el = containerRef.current;
                if (!el) return;
                const track = el.querySelector(':scope > div');
                if (!track) return;
                const child = (track.children[i] as HTMLElement);
                if (!child) return;
                const left = child.offsetLeft - (el.clientWidth - child.clientWidth) / 2;
                el.scrollTo({ left, behavior: 'smooth' });
              }}
            />
          ))}
        </div>
        <div className="sr-only" aria-live="polite">Slide {current + 1} of {FEATURED.length}</div>
      </motion.div>
    </Section>
  );
};

export default FeaturedFilms;
