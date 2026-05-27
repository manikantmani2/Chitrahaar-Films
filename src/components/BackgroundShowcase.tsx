import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

type MediaItem =
  | { type: 'video'; src: string; poster?: string }
  | { type: 'image'; src: string };

interface BackgroundShowcaseProps {
  /** list of media to cycle through. If omitted, sensible defaults are used */
  items?: MediaItem[];
  /** how long (ms) to show images before switching */
  imageDuration?: number;
}

/**
 * BackgroundShowcase
 * - Cycles through video and image items in an infinite loop
 * - Videos autoplay muted and advance onended
 * - Images are shown for `imageDuration` ms and get a subtle Ken-Burns effect
 * - Designed for use as a positioned background layer (absolute inset-0)
 */
export default function BackgroundShowcase({
  items,
  imageDuration = 5000,
}: BackgroundShowcaseProps) {
  const defaultItems: MediaItem[] = [
    // Prefer local fallbacks to avoid blocked cross-origin video requests in headless environments
    { type: 'image', src: '/portfolio/project-1.svg' },
    { type: 'image', src: '/portfolio/wedding-coverage.svg' },
    { type: 'image', src: '/gallery/hero1.svg' },
    { type: 'image', src: '/gallery/hero1.svg' },
    { type: 'image', src: '/gallery/hero2.svg' },
    { type: 'image', src: '/gallery/hero3.svg' },
  ];

  const playlist = items && items.length > 0 ? items : defaultItems;
  const [index, setIndex] = useState(0);
  // muted preference persisted in localStorage (default: true)
  const [muted, setMuted] = useState<boolean>(() => {
    try {
      const raw = localStorage.getItem('bg-audio-muted');
      return raw ? JSON.parse(raw) : true;
    } catch (e) {
      return true;
    }
  });
  const timerRef = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    // clear timer when index changes
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [index]);

  useEffect(() => {
    // When the current item is an image, set a timeout to advance
    const cur = playlist[index];
    if (cur.type === 'image') {
      timerRef.current = window.setTimeout(() => {
        setIndex((i) => (i + 1) % playlist.length);
      }, imageDuration);
    }

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [index, playlist, imageDuration]);

  // keep video elements' muted property in sync with preference
  useEffect(() => {
    const vids = Array.from(document.querySelectorAll('video.bg-showcase-video')) as HTMLVideoElement[];
    vids.forEach((v) => (v.muted = muted));
    try {
      localStorage.setItem('bg-audio-muted', JSON.stringify(muted));
    } catch (e) {
      // ignore
    }
  }, [muted]);

  const handleVideoEnded = () => {
    setIndex((i) => (i + 1) % playlist.length);
  };

  return (
    <div aria-hidden className="absolute inset-0 -z-20 overflow-hidden">
      {playlist.map((item, i) => {
        const active = i === index;
        const commonClass = `absolute inset-0 w-full h-full transition-opacity duration-1000 ease-out ${
          active ? 'opacity-100 pointer-events-none' : 'opacity-0 pointer-events-none'
        }`;

        if (item.type === 'video') {
          return (
            <video
              key={i}
              ref={active ? videoRef : undefined}
              src={item.src}
              autoPlay={active}
              muted
              playsInline
              onEnded={handleVideoEnded}
              onError={() => {
                // if a remote video fails to load, advance to the next item to avoid console spam
                handleVideoEnded();
              }}
              className={commonClass + ' object-cover bg-showcase-video'}
            />
          );
        }

        return (
          <div key={i} className={commonClass + ' bg-black'}>
            {/* Subtle Ken Burns: scale+translate via CSS */}
            <div className={`absolute inset-0 transform-gpu transition-transform duration-12000 ${
              active ? 'scale-105 translate-y-0' : 'scale-100'
            }`}
            >
              <Image
                src={item.src}
                alt="Background"
                fill
                sizes="100vw"
                className="object-cover"
                priority={i === 0}
              />
            </div>
            {/* gentle overlay to keep text legible */}
            <div className="absolute inset-0 bg-black/30" />
          </div>
        );
      })}
    </div>
  );
}

