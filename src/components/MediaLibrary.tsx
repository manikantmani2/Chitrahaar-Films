import React, { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaInstagram, FaYoutube, FaHeart, FaShareAlt } from 'react-icons/fa';
import { containerVariants, itemVariants } from '@/utils/animations';
import { getGalleryPosterWebp } from '@/utils/imagePaths';
import { getRelatedGallerySuggestions, normalizeGalleryGroup, ALLOWED_GALLERY_GROUPS, type GallerySuggestionItem } from '@/utils/gallerySuggestions';
import Section from './Section';
import Card from './Card';

type ItemEvent = 'All' | 'Food & Beverages' | 'Corporate & Events' | 'Fashion' | 'Artist' | 'Short Films' | 'Wedding';
type EventFilter = 'All' | 'Food & Beverages' | 'Corporate & Events' | 'Fashion' | 'Artist' | 'Short Films' | 'Wedding';
type MediaType = 'all' | 'photo' | 'video';

interface WorkItem {
  id: number;
  title: string;
  eventType: ItemEvent;
  mediaType: Exclude<MediaType, 'all'>;
  thumb: string;
  description: string;
  duration?: string;
  videoUrl?: string;
  instagramUrl: string;
  youtubeUrl: string;
}

const sampleVideoUrl = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';

const getOrCreateClientId = () => {
  if (typeof window === 'undefined') return '';

  const storageKey = 'chitrahaar-client-id';
  const existing = localStorage.getItem(storageKey);
  if (existing) return existing;

  const generated = `anon-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  localStorage.setItem(storageKey, generated);
  return generated;
};


const WORK_ITEMS: WorkItem[] = [
  {
    id: 1,
    title: 'Wedding Highlights Photos',
    eventType: 'Wedding',
    mediaType: 'photo',
    thumb: '/our-works-gallery/Wedding/0U8A4373.jpg',
    description: 'Candid portraits, rituals, and cinematic wedding moments.',
    instagramUrl: 'https://instagram.com/chitrahaarfilms',
    youtubeUrl: 'https://youtube.com/@chitrahaarfilms',
  },
  {
    id: 2,
    title: 'Wedding Reel Video',
    eventType: 'Wedding',
    mediaType: 'video',
    thumb: '/our-works-gallery/Wedding/0U8A5138.jpg',
    description: 'A premium wedding teaser with emotional storytelling.',
    duration: '01:12',
    videoUrl: '/our-works-gallery/Wedding/WEDDING.mp4',
    instagramUrl: 'https://instagram.com/chitrahaarfilms',
    youtubeUrl: 'https://youtube.com/@chitrahaarfilms',
  },
  {
    id: 8,
    title: 'Wedding Editorial Frame',
    eventType: 'Wedding',
    mediaType: 'photo',
    thumb: '/our-works-gallery/Wedding/cf-2.jpg',
    description: 'Elegant wedding editorial moments with a cinematic finish.',
    instagramUrl: 'https://instagram.com/chitrahaarfilms',
    youtubeUrl: 'https://youtube.com/@chitrahaarfilms',
  },
  {
    id: 9,
    title: 'Wedding Portrait Story',
    eventType: 'Wedding',
    mediaType: 'photo',
    thumb: '/our-works-gallery/Wedding/cf-3.jpg',
    description: 'Portrait-driven wedding visuals with soft, dramatic light.',
    instagramUrl: 'https://instagram.com/chitrahaarfilms',
    youtubeUrl: 'https://youtube.com/@chitrahaarfilms',
  },
  {
    id: 14,
    title: 'Wedding Ceremony Moments',
    eventType: 'Wedding',
    mediaType: 'photo',
    thumb: '/our-works-gallery/Wedding/cf-4.jpg',
    description: 'Timeless ceremony details and candid reception captures.',
    instagramUrl: 'https://instagram.com/chitrahaarfilms',
    youtubeUrl: 'https://youtube.com/@chitrahaarfilms',
  },
  {
    id: 15,
    title: 'Wedding Candid Highlights',
    eventType: 'Wedding',
    mediaType: 'photo',
    thumb: '/our-works-gallery/Wedding/DSC04511.jpg',
    description: 'Candid wedding moments with a polished documentary feel.',
    instagramUrl: 'https://instagram.com/chitrahaarfilms',
    youtubeUrl: 'https://youtube.com/@chitrahaarfilms',
  },
  {
    id: 16,
    title: 'Wedding Day Drama',
    eventType: 'Wedding',
    mediaType: 'photo',
    thumb: '/our-works-gallery/Wedding/DSC04586.jpg',
    description: 'A moody, cinematic wedding portrait with a premium look.',
    instagramUrl: 'https://instagram.com/chitrahaarfilms',
    youtubeUrl: 'https://youtube.com/@chitrahaarfilms',
  },
  {
    id: 17,
    title: 'Wedding Couple Motion',
    eventType: 'Wedding',
    mediaType: 'photo',
    thumb: '/our-works-gallery/Wedding/0U8A5532.jpg',
    description: 'Dynamic couple frames captured with natural movement.',
    instagramUrl: 'https://instagram.com/chitrahaarfilms',
    youtubeUrl: 'https://youtube.com/@chitrahaarfilms',
  },
  {
    id: 18,
    title: 'Wedding Celebration Close-Up',
    eventType: 'Wedding',
    mediaType: 'photo',
    thumb: '/our-works-gallery/Wedding/cf.jpg',
    description: 'Close-up celebration details and premium wedding storytelling.',
    instagramUrl: 'https://instagram.com/chitrahaarfilms',
    youtubeUrl: 'https://youtube.com/@chitrahaarfilms',
  },
  {
    id: 19,
    title: 'Wedding Prewedding Reel',
    eventType: 'Wedding',
    mediaType: 'video',
    thumb: '/our-works-gallery/Wedding/0U8A4857.jpg',
    description: 'Pre-wedding storytelling with a clean cinematic finish.',
    duration: '01:18',
    videoUrl: '/our-works-gallery/Wedding/Tejas & Taniya.mov Preweding.mov',
    instagramUrl: 'https://instagram.com/chitrahaarfilms',
    youtubeUrl: 'https://youtube.com/@chitrahaarfilms',
  },
  {
    id: 3,
    title: 'Artist — Portraits',
    eventType: 'Artist',
    mediaType: 'photo',
    thumb: '/our-works-gallery/Artist/Worldclass-354.jpg',
    description: 'Portraits and editorial artist shoots.',
    instagramUrl: 'https://instagram.com/chitrahaarfilms',
    youtubeUrl: 'https://youtube.com/@chitrahaarfilms',
  },
  {
    id: 4,
    title: 'Artist Promo Reel',
    eventType: 'Artist',
    mediaType: 'video',
    thumb: '/our-works-gallery/Artist/Worldclass-355.jpg',
    description: 'Short promotional edits for artists and performers.',
    duration: '00:42',
    videoUrl: '/our-works-gallery/Corporate & Events/CORPRATE.mp4',
    instagramUrl: 'https://instagram.com/chitrahaarfilms',
    youtubeUrl: 'https://youtube.com/@chitrahaarfilms',
  },
  {
    id: 20,
    title: 'Artist Spotlight Portrait',
    eventType: 'Artist',
    mediaType: 'photo',
    thumb: '/our-works-gallery/Artist/RAJ04410.JPG',
    description: 'Editorial portrait coverage for artists and performers.',
    instagramUrl: 'https://instagram.com/chitrahaarfilms',
    youtubeUrl: 'https://youtube.com/@chitrahaarfilms',
  },
  {
    id: 21,
    title: 'Artist Performance Frame',
    eventType: 'Artist',
    mediaType: 'photo',
    thumb: '/our-works-gallery/Artist/cf.jpg',
    description: 'Performance stills with bold framing and dramatic light.',
    instagramUrl: 'https://instagram.com/chitrahaarfilms',
    youtubeUrl: 'https://youtube.com/@chitrahaarfilms',
  },
  {
    id: 22,
    title: 'Artist Stage Portrait',
    eventType: 'Artist',
    mediaType: 'photo',
    thumb: '/our-works-gallery/Artist/Worldclass-358.jpg',
    description: 'Stage-ready artist portrait with a clean editorial finish.',
    instagramUrl: 'https://instagram.com/chitrahaarfilms',
    youtubeUrl: 'https://youtube.com/@chitrahaarfilms',
  },
  {
    id: 23,
    title: 'Artist Crowd Energy',
    eventType: 'Artist',
    mediaType: 'photo',
    thumb: '/our-works-gallery/Artist/Worldclass-374.jpg',
    description: 'Live crowd energy and artist coverage in one frame.',
    instagramUrl: 'https://instagram.com/chitrahaarfilms',
    youtubeUrl: 'https://youtube.com/@chitrahaarfilms',
  },
  {
    id: 24,
    title: 'Artist Finale',
    eventType: 'Artist',
    mediaType: 'photo',
    thumb: '/our-works-gallery/Artist/Worldclass-379.jpg',
    description: 'A final artist frame with premium editorial color.',
    instagramUrl: 'https://instagram.com/chitrahaarfilms',
    youtubeUrl: 'https://youtube.com/@chitrahaarfilms',
  },

  // Fashion
  {
    id: 10,
    title: 'Fashion Editorial Photos',
    eventType: 'Fashion',
    mediaType: 'photo',
    thumb: '/our-works-gallery/Fashion/cf-2.jpg',
    description: 'Studio and runway fashion editorials with dramatic lighting.',
    instagramUrl: 'https://instagram.com/chitrahaarfilms',
    youtubeUrl: 'https://youtube.com/@chitrahaarfilms',
  },
  {
    id: 11,
    title: 'Fashion Lookbook Reel',
    eventType: 'Fashion',
    mediaType: 'video',
    thumb: '/our-works-gallery/Fashion/cf-3.jpg',
    description: 'Stylized lookbook video with elegant transitions.',
    duration: '00:55',
    videoUrl: '/our-works-gallery/Fashion/fashion-video.mp4',
    instagramUrl: 'https://instagram.com/chitrahaarfilms',
    youtubeUrl: 'https://youtube.com/@chitrahaarfilms',
  },
  {
    id: 25,
    title: 'Fashion Runway Portrait',
    eventType: 'Fashion',
    mediaType: 'photo',
    thumb: '/our-works-gallery/Fashion/cf-3.jpg',
    description: 'Runway-inspired fashion portrait with premium styling.',
    instagramUrl: 'https://instagram.com/chitrahaarfilms',
    youtubeUrl: 'https://youtube.com/@chitrahaarfilms',
  },
  {
    id: 26,
    title: 'Fashion Editorial Close-Up',
    eventType: 'Fashion',
    mediaType: 'photo',
    thumb: '/our-works-gallery/Fashion/cf-4.jpg',
    description: 'Close-up fashion capture with dramatic studio lighting.',
    instagramUrl: 'https://instagram.com/chitrahaarfilms',
    youtubeUrl: 'https://youtube.com/@chitrahaarfilms',
  },
  {
    id: 27,
    title: 'Fashion Lookbook Shot',
    eventType: 'Fashion',
    mediaType: 'photo',
    thumb: '/our-works-gallery/Fashion/cf-5.jpg',
    description: 'High-end lookbook photo for fashion campaigns.',
    instagramUrl: 'https://instagram.com/chitrahaarfilms',
    youtubeUrl: 'https://youtube.com/@chitrahaarfilms',
  },
  {
    id: 28,
    title: 'Fashion Campaign Still',
    eventType: 'Fashion',
    mediaType: 'photo',
    thumb: '/our-works-gallery/Fashion/cf-6.jpg',
    description: 'Campaign-ready fashion still with premium color grading.',
    instagramUrl: 'https://instagram.com/chitrahaarfilms',
    youtubeUrl: 'https://youtube.com/@chitrahaarfilms',
  },
  {
    id: 29,
    title: 'Fashion Runway Reel',
    eventType: 'Fashion',
    mediaType: 'video',
    thumb: '/our-works-gallery/Fashion/cf-2.jpg',
    description: 'Stylized runway cut with elegant transitions.',
    duration: '00:55',
    videoUrl: '/our-works-gallery/Fashion/fashion-video.mp4',
    instagramUrl: 'https://instagram.com/chitrahaarfilms',
    youtubeUrl: 'https://youtube.com/@chitrahaarfilms',
  },

  // Corporate
  {
    id: 12,
    title: 'Corporate Event Photos',
    eventType: 'Corporate & Events',
    mediaType: 'photo',
    thumb: '/our-works-gallery/Corporate & Events/CF-27.jpg',
    description: 'Professional corporate event coverage and headshots.',
    instagramUrl: 'https://instagram.com/chitrahaarfilms',
    youtubeUrl: 'https://youtube.com/@chitrahaarfilms',
  },
  {
    id: 13,
    title: 'Corporate Highlights Video',
    eventType: 'Corporate & Events',
    mediaType: 'video',
    thumb: '/our-works-gallery/Corporate & Events/Worldclass-174.jpg',
    description: 'Highlight reel for conferences and corporate launches.',
    duration: '01:05',
    videoUrl: '/our-works-gallery/Corporate & Events/CORPRATE.mp4',
    instagramUrl: 'https://instagram.com/chitrahaarfilms',
    youtubeUrl: 'https://youtube.com/@chitrahaarfilms',
  },
  {
    id: 30,
    title: 'Corporate Event Highlight',
    eventType: 'Corporate & Events',
    mediaType: 'photo',
    thumb: '/our-works-gallery/Corporate & Events/CF-40.jpg',
    description: 'Conference and launch coverage with a premium visual finish.',
    instagramUrl: 'https://instagram.com/chitrahaarfilms',
    youtubeUrl: 'https://youtube.com/@chitrahaarfilms',
  },
  {
    id: 31,
    title: 'Corporate Event Detail',
    eventType: 'Corporate & Events',
    mediaType: 'photo',
    thumb: '/our-works-gallery/Corporate & Events/CF-42.jpg',
    description: 'Corporate event details framed for a professional gallery.',
    instagramUrl: 'https://instagram.com/chitrahaarfilms',
    youtubeUrl: 'https://youtube.com/@chitrahaarfilms',
  },
  {
    id: 32,
    title: 'Corporate Launch Portrait',
    eventType: 'Corporate & Events',
    mediaType: 'photo',
    thumb: '/our-works-gallery/Corporate & Events/CF-53.jpg',
    description: 'Brand launch portrait shot with cinematic lighting.',
    instagramUrl: 'https://instagram.com/chitrahaarfilms',
    youtubeUrl: 'https://youtube.com/@chitrahaarfilms',
  },
  {
    id: 33,
    title: 'Corporate Panel Frame',
    eventType: 'Corporate & Events',
    mediaType: 'photo',
    thumb: '/our-works-gallery/Corporate & Events/CF-54.jpg',
    description: 'Panel and stage coverage captured for corporate storytelling.',
    instagramUrl: 'https://instagram.com/chitrahaarfilms',
    youtubeUrl: 'https://youtube.com/@chitrahaarfilms',
  },
  {
    id: 34,
    title: 'Corporate Event Crowd',
    eventType: 'Corporate & Events',
    mediaType: 'photo',
    thumb: '/our-works-gallery/Corporate & Events/CF-61.jpg',
    description: 'Audience and stage moments for a polished event reel.',
    instagramUrl: 'https://instagram.com/chitrahaarfilms',
    youtubeUrl: 'https://youtube.com/@chitrahaarfilms',
  },
  {
    id: 35,
    title: 'Corporate Event Finish',
    eventType: 'Corporate & Events',
    mediaType: 'photo',
    thumb: '/our-works-gallery/Corporate & Events/CF-68.jpg',
    description: 'A final event frame with clean, premium composition.',
    instagramUrl: 'https://instagram.com/chitrahaarfilms',
    youtubeUrl: 'https://youtube.com/@chitrahaarfilms',
  },
  {
    id: 36,
    title: 'Corporate Highlight Reel 2',
    eventType: 'Corporate & Events',
    mediaType: 'video',
    thumb: '/our-works-gallery/Corporate & Events/Worldclass-174.jpg',
    description: 'Corporate launch reel with a modern energetic cut.',
    duration: '01:08',
    videoUrl: '/our-works-gallery/Corporate & Events/Event photo/PRODUCT VIDEO.mp4',
    instagramUrl: 'https://instagram.com/chitrahaarfilms',
    youtubeUrl: 'https://youtube.com/@chitrahaarfilms',
  },
  {
    id: 37,
    title: 'Corporate Aftermovie',
    eventType: 'Corporate & Events',
    mediaType: 'video',
    thumb: '/our-works-gallery/Corporate & Events/Worldclass-177.jpg',
    description: 'Event aftermovie with keynote moments and crowd energy.',
    duration: '01:35',
    videoUrl: '/our-works-gallery/Corporate & Events/Event photo/EVENTS.m4v',
    instagramUrl: 'https://instagram.com/chitrahaarfilms',
    youtubeUrl: 'https://youtube.com/@chitrahaarfilms',
  },
  {
    id: 5,
    title: 'Event Coverage Photos',
    eventType: 'Corporate & Events',
    mediaType: 'photo',
    thumb: '/our-works-gallery/Corporate & Events/Event photo/CF008231.jpg',
    description: 'Launches, conferences, and social event captures.',
    instagramUrl: 'https://instagram.com/chitrahaarfilms',
    youtubeUrl: 'https://youtube.com/@chitrahaarfilms',
  },
  {
    id: 6,
    title: 'Event Aftermovie',
    eventType: 'Corporate & Events',
    mediaType: 'video',
    thumb: '/our-works-gallery/Corporate & Events/Event photo/CF008434.jpg',
    description: 'Complete event story with highlights and keynote moments.',
    duration: '01:35',
    videoUrl: '/our-works-gallery/Corporate & Events/Event photo/EVENTS.m4v',
    instagramUrl: 'https://instagram.com/chitrahaarfilms',
    youtubeUrl: 'https://youtube.com/@chitrahaarfilms',
  },
  {
    id: 38,
    title: 'Event Coverage Frame 2',
    eventType: 'Corporate & Events',
    mediaType: 'photo',
    thumb: '/our-works-gallery/Corporate & Events/Worldclass-179.jpg',
    description: 'Conference coverage with crisp editorial framing.',
    instagramUrl: 'https://instagram.com/chitrahaarfilms',
    youtubeUrl: 'https://youtube.com/@chitrahaarfilms',
  },
  {
    id: 39,
    title: 'Event Coverage Frame 3',
    eventType: 'Corporate & Events',
    mediaType: 'photo',
    thumb: '/our-works-gallery/Corporate & Events/Worldclass-183.jpg',
    description: 'Audience and stage storytelling for a live event gallery.',
    instagramUrl: 'https://instagram.com/chitrahaarfilms',
    youtubeUrl: 'https://youtube.com/@chitrahaarfilms',
  },
  {
    id: 40,
    title: 'Event Coverage Frame 4',
    eventType: 'Corporate & Events',
    mediaType: 'photo',
    thumb: '/our-works-gallery/Corporate & Events/Worldclass-185.jpg',
    description: 'Premium event stills with a cinematic documentary look.',
    instagramUrl: 'https://instagram.com/chitrahaarfilms',
    youtubeUrl: 'https://youtube.com/@chitrahaarfilms',
  },
  {
    id: 41,
    title: 'Event Coverage Frame 5',
    eventType: 'Corporate & Events',
    mediaType: 'photo',
    thumb: '/our-works-gallery/Corporate & Events/Worldclass-342.jpg',
    description: 'Live event framing with strong visual balance.',
    instagramUrl: 'https://instagram.com/chitrahaarfilms',
    youtubeUrl: 'https://youtube.com/@chitrahaarfilms',
  },
  {
    id: 42,
    title: 'Event Coverage Frame 6',
    eventType: 'Corporate & Events',
    mediaType: 'photo',
    thumb: '/our-works-gallery/Corporate & Events/Worldclass-349.jpg',
    description: 'A clean event finale frame for the gallery rail.',
    instagramUrl: 'https://instagram.com/chitrahaarfilms',
    youtubeUrl: 'https://youtube.com/@chitrahaarfilms',
  },
  {
    id: 43,
    title: 'Event Coverage Frame 7',
    eventType: 'Corporate & Events',
    mediaType: 'photo',
    thumb: '/our-works-gallery/Corporate & Events/CF-7.jpg',
    description: 'Stage and crowd coverage with premium grading.',
    instagramUrl: 'https://instagram.com/chitrahaarfilms',
    youtubeUrl: 'https://youtube.com/@chitrahaarfilms',
  },
  {
    id: 7,
    title: 'Food & Beverages Promo',
    eventType: 'Food & Beverages',
    mediaType: 'video',
    thumb: '/our-works-gallery/thumbs/Food_and_Beverages_FandB.webp',
    description: 'Recipe reels and cinematic food promos for brands.',
    duration: '00:58',
    videoUrl: '/our-works-gallery/Food & Beverages/F&B.mp4',
    instagramUrl: 'https://instagram.com/chitrahaarfilms',
    youtubeUrl: 'https://youtube.com/@chitrahaarfilms',
  },
  {
    id: 44,
    title: 'Food & Beverages Still',
    eventType: 'Food & Beverages',
    mediaType: 'photo',
    thumb: '/our-works-gallery/thumbs/Food_and_Beverages_FandB.webp',
    description: 'Food styling still used as a crisp gallery preview.',
    instagramUrl: 'https://instagram.com/chitrahaarfilms',
    youtubeUrl: 'https://youtube.com/@chitrahaarfilms',
  },
  {
    id: 45,
    title: 'Food & Beverages Highlight',
    eventType: 'Food & Beverages',
    mediaType: 'photo',
    thumb: '/featured2.jpg',
    description: 'Premium food and lifestyle frame for the gallery rail.',
    instagramUrl: 'https://instagram.com/chitrahaarfilms',
    youtubeUrl: 'https://youtube.com/@chitrahaarfilms',
  },
];

const eventTypes: EventFilter[] = ['All', ...ALLOWED_GALLERY_GROUPS];

const MediaLibrary: React.FC = () => {
  const [eventType, setEventType] = useState<EventFilter>('All');
  const [mediaType, setMediaType] = useState<MediaType>('all');
  const [activeItem, setActiveItem] = useState<WorkItem | null>(null);
  const [hoverPreviewId, setHoverPreviewId] = useState<number | null>(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [likes, setLikes] = useState<Record<number, boolean>>({});
  const [toast, setToast] = useState<string | null>(null);
  const [likesCount, setLikesCount] = useState<Record<number, number>>({});
  const [clientId, setClientId] = useState('');
  const filterStripRef = useRef<HTMLDivElement | null>(null);
  const galleryStripRef = useRef<HTMLDivElement | null>(null);
  const photoStripRef = useRef<HTMLDivElement | null>(null);
  const videoStripRef = useRef<HTMLDivElement | null>(null);
  const groupRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const autoScrollTimerRef = useRef<number | null>(null);
  const photoAutoScrollTimerRef = useRef<number | null>(null);
  const videoAutoScrollTimerRef = useRef<number | null>(null);
  const autoScrollIndexRef = useRef(0);
  const photoAutoScrollIndexRef = useRef(0);
  const videoAutoScrollIndexRef = useRef(0);
  const [photoActiveIndex, setPhotoActiveIndex] = useState(0);
  const [videoActiveIndex, setVideoActiveIndex] = useState(0);
  const modalAdvanceTimerRef = useRef<number | null>(null);

  const parseDurationSeconds = (duration?: string) => {
    if (!duration) return null;

    const parts = duration.split(':').map(Number).reverse();
    let seconds = 0;
    if (parts.length >= 1) seconds += parts[0];
    if (parts.length >= 2) seconds += parts[1] * 60;
    if (parts.length >= 3) seconds += parts[2] * 3600;
    return seconds;
  };

  const relatedItems = useMemo(() => {
    if (!activeItem) return [];

    const suggestions: GallerySuggestionItem[] = WORK_ITEMS.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      mediaType: item.mediaType,
      thumb: item.thumb,
      duration: item.duration,
      group: normalizeGalleryGroup(item.eventType) || undefined,
    }));

    return getRelatedGallerySuggestions(
      suggestions,
      {
        activeId: activeItem.id,
        activeGroup: normalizeGalleryGroup(activeItem.eventType) || undefined,
        activeMediaType: activeItem.mediaType,
      },
      8,
    );
  }, [activeItem]);

  const filteredItems = useMemo(() => {
    return WORK_ITEMS.filter((item) => {
      const eventOk = item.eventType === eventType;
      const mediaOk = mediaType === 'all' || item.mediaType === mediaType;
      return eventOk && mediaOk;
    });
  }, [eventType, mediaType]);

  const photoItems = useMemo(
    () =>
      WORK_ITEMS.filter((i) => {
        const eventOk = i.eventType === eventType;
        return eventOk && i.mediaType === 'photo';
      }),
    [eventType]
  );

  const videoItems = useMemo(
    () =>
      WORK_ITEMS.filter((i) => {
        const eventOk = i.eventType === eventType;
        return eventOk && i.mediaType === 'video';
      }),
    [eventType]
  );

  const handleFilterClick = (type: EventFilter | MediaType, kind: 'event' | 'media') => {
    if (kind === 'event') {
      setEventType(type as EventFilter);
    } else {
      setMediaType(type as MediaType);
    }
  };

  const openItem = (item: WorkItem) => {
    setIsAutoScrolling(false);
    setActiveItem(item);
  };

  useEffect(() => {
    if (modalAdvanceTimerRef.current) {
      window.clearTimeout(modalAdvanceTimerRef.current);
      modalAdvanceTimerRef.current = null;
    }

    if (!activeItem || relatedItems.length === 0) {
      return;
    }

    const dwellSeconds = parseDurationSeconds(activeItem.duration) ?? (activeItem.mediaType === 'video' ? 8 : 5);
    const dwell = Math.min(Math.max(dwellSeconds, 4), 20) * 1000;

    modalAdvanceTimerRef.current = window.setTimeout(() => {
      const currentIndex = WORK_ITEMS.findIndex((item) => item.id === activeItem.id);
      if (currentIndex === -1) return;

      const nextRelated = WORK_ITEMS.slice(currentIndex + 1).find((item) => item.eventType === activeItem.eventType && item.mediaType === activeItem.mediaType && item.id !== activeItem.id)
        || WORK_ITEMS.find((item) => item.eventType === activeItem.eventType && item.mediaType === activeItem.mediaType && item.id !== activeItem.id)
        || relatedItems[0];

      if (nextRelated) {
        setActiveItem(WORK_ITEMS.find((item) => item.id === nextRelated.id) || activeItem);
      }
    }, dwell);

    return () => {
      if (modalAdvanceTimerRef.current) {
        window.clearTimeout(modalAdvanceTimerRef.current);
        modalAdvanceTimerRef.current = null;
      }
    };
  }, [activeItem, relatedItems]);

  // Manual scroller: auto-scroll disabled to keep user control

  // load local like flags and a stable anonymous client id
  useEffect(() => {
    try {
      setClientId(getOrCreateClientId());
      const raw = localStorage.getItem('chitrahaar-likes');
      if (raw) setLikes(JSON.parse(raw));
    } catch (e) {}
  }, []);

  // fetch shared like counts
  useEffect(() => {
    let cancelled = false;

    const loadCounts = async () => {
      try {
        const response = await fetch('/api/reactions');
        if (!response.ok) return;
        const data = await response.json();
        if (!cancelled && data?.counts && typeof data.counts === 'object') {
          const normalized: Record<number, number> = {};
          Object.entries(data.counts as Record<string, number>).forEach(([key, value]) => {
            const id = Number(key);
            if (!Number.isNaN(id)) normalized[id] = Number(value) || 0;
          });
          setLikesCount(normalized);
        }
      } catch {
        // ignore transient errors
      }
    };

    void loadCounts();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('chitrahaar-likes', JSON.stringify(likes));
    } catch (e) {}
  }, [likes]);

  const toggleLike = async (id: number) => {
    const nextLiked = !likes[id];

    setLikes((prev) => ({ ...prev, [id]: nextLiked }));
    setLikesCount((current) => ({
      ...current,
      [id]: Math.max(0, (current[id] || 0) + (nextLiked ? 1 : -1)),
    }));

    try {
      const response = await fetch('/api/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: id,
          clientId,
          liked: nextLiked,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update like');
      }

      const data = await response.json();
      const serverCount = Number(data?.count);
      const serverLiked = Boolean(data?.liked);

      setLikes((prev) => ({ ...prev, [id]: serverLiked }));
      setLikesCount((prev) => ({
        ...prev,
        [id]: Number.isFinite(serverCount) ? serverCount : prev[id] || 0,
      }));
    } catch {
      // revert optimistic change if request fails
      setLikes((prev) => ({ ...prev, [id]: !nextLiked }));
      setLikesCount((current) => ({
        ...current,
        [id]: Math.max(0, (current[id] || 0) + (nextLiked ? -1 : 1)),
      }));
    }
  };

  const doShare = async (item: WorkItem) => {
    const url = typeof window !== 'undefined' ? window.location.href.split('#')[0] + `#works-gallery` : '';
    try {
      if ((navigator as any).share) {
        await (navigator as any).share({ title: item.title, text: item.description, url });
        setToast('Shared');
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setToast('Link copied to clipboard');
      } else {
        setToast('Share not supported');
      }
    } catch (e) {
      setToast('Failed to share');
    }
    setTimeout(() => setToast(null), 2500);
  };

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
      subtitle="Browse photos and videos by event type: Food & Beverages, Corporate & Events, Fashion, Artist, Short Films, Wedding"
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

      {/* Photo & Video strips: show grouped view when 'All' selected, otherwise show current event filter */}
      {eventType === 'All' ? (
        <div>
          {eventTypes.filter((t) => t !== 'All').map((group) => {
            const groupPhotoItems = WORK_ITEMS.filter((i) => i.eventType === group && i.mediaType === 'photo');
            const groupVideoItems = WORK_ITEMS.filter((i) => i.eventType === group && i.mediaType === 'video');
            return (
              <div key={group} className="mb-8" ref={(el) => { groupRefs.current[group] = el; }}>
                <h4 className="mb-2 text-lg font-semibold">{group}</h4>
                {(mediaType === 'all' || mediaType === 'photo') && groupPhotoItems.length > 0 && (
                  <div className="mb-4">
                    <p className="mb-3 text-sm font-medium">Photos</p>
                    <div className="flex gap-4 overflow-x-auto scrollbar-hide py-2">
                      {groupPhotoItems.map((item) => (
                        <div key={item.id} className={`shrink-0 w-64`}>
                          <Card variant="hover" className={`overflow-hidden rounded-[12px] hover-lift`}>
                            <div className="relative h-40 cursor-pointer" onClick={() => openItem(item)} role="button" tabIndex={0}>
                                <Image src={item.thumb} alt={item.title} fill className="object-cover" priority={groupPhotoItems.length <= 2} />
                            </div>
                            <div className="p-3">
                              <h5 className="text-sm font-semibold">{item.title}</h5>
                              <p className="text-xs text-text-secondary">{item.eventType}</p>
                            </div>
                          </Card>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(mediaType === 'all' || mediaType === 'video') && groupVideoItems.length > 0 && (
                  <div className="mb-2">
                    <p className="mb-3 text-sm font-medium">Videos</p>
                    <div className="flex gap-4 overflow-x-auto scrollbar-hide py-2">
                      {groupVideoItems.map((item) => (
                        <div key={item.id} className={`shrink-0 w-64`}>
                          <Card variant="hover" className={`overflow-hidden rounded-[12px] hover-lift`}>
                            <div className="relative h-40 bg-black cursor-pointer" onClick={() => openItem(item)} role="button" tabIndex={0}>
                              <video
                                src={item.videoUrl || sampleVideoUrl}
                                muted
                                playsInline
                                preload="metadata"
                                className="h-full w-full object-cover"
                                aria-label={item.title}
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="rounded-full bg-black/60 p-3 text-white/90">▶</div>
                              </div>
                            </div>
                            <div className="p-3">
                              <h5 className="text-sm font-semibold">{item.title}</h5>
                              <p className="text-xs text-text-secondary">{item.duration || 'Video'}</p>
                            </div>
                          </Card>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <>
          {/* Photo strip */}
          {(mediaType === 'all' || mediaType === 'photo') && (
            <div className="mb-8">
              <h4 className="mb-4 text-lg font-semibold">Photos</h4>
              <div ref={photoStripRef} className="flex gap-4 overflow-x-auto scrollbar-hide py-2">
                {photoItems.map((item, idx) => (
                  <div key={item.id} data-photo-item="true" className={`shrink-0 w-64 transition-all duration-500 ${idx === photoActiveIndex ? 'scale-[1.14] z-10' : 'scale-[0.9] opacity-65'}`}>
                    <Card variant="hover" className={`overflow-hidden rounded-[12px] hover-lift transition-all duration-500 ${idx === photoActiveIndex ? 'shadow-[0_22px_55px_rgba(0,0,0,0.35)]' : ''}`}>
                      <div className="relative h-40 cursor-pointer" onClick={() => openItem(item)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openItem(item); } }} role="button" tabIndex={0}>
                        <Image src={item.thumb} alt={item.title} fill className="object-cover" priority={idx === photoActiveIndex && idx < 2} />
                          <div className="absolute top-2 right-2 flex gap-2">
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleLike(item.id); }}
                              aria-pressed={!!likes[item.id]}
                              className={`rounded-full p-2 text-white/90 ${likes[item.id] ? 'bg-accent text-primary scale-110' : 'bg-black/50'}`}
                            ><FaHeart /></button>
                            <button
                              onClick={(e) => { e.stopPropagation(); doShare(item); }}
                              className="rounded-full bg-black/50 p-2 text-white/90"
                            ><FaShareAlt /></button>
                          </div>
                      </div>
                      <div className="p-3">
                        <h5 className="text-sm font-semibold">{item.title}</h5>
                        <p className="text-xs text-text-secondary">{item.eventType}</p>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Video strip */}
          {(mediaType === 'all' || mediaType === 'video') && (
            <div className="mb-8">
              <h4 className="mb-4 text-lg font-semibold">Videos</h4>
              <div ref={videoStripRef} className="flex gap-4 overflow-x-auto scrollbar-hide py-2">
                {videoItems.map((item, idx) => (
                  <div key={item.id} data-video-item="true" className={`shrink-0 w-64 transition-all duration-500 ${idx === videoActiveIndex ? 'scale-[1.14] z-10' : 'scale-[0.9] opacity-65'}`}>
                    <Card variant="hover" className={`overflow-hidden rounded-[12px] hover-lift transition-all duration-500 ${idx === videoActiveIndex ? 'shadow-[0_22px_55px_rgba(0,0,0,0.35)]' : ''}`}>
                      <div className="relative h-40 bg-black cursor-pointer" onClick={() => openItem(item)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openItem(item); } }} role="button" tabIndex={0}>
                        <video
                          src={item.videoUrl || sampleVideoUrl}
                          muted
                          playsInline
                          preload="metadata"
                          className="h-full w-full object-cover"
                          aria-label={item.title}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="rounded-full bg-black/60 p-3 text-white/90">▶</div>
                        </div>
                        <div className="absolute top-2 right-2 flex gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleLike(item.id); }}
                            aria-pressed={!!likes[item.id]}
                            className={`rounded-full p-2 text-white/90 ${likes[item.id] ? 'bg-accent text-primary scale-110' : 'bg-black/50'} transform transition`}
                          ><FaHeart /></button>
                          <button
                            onClick={(e) => { e.stopPropagation(); doShare(item); }}
                            className="rounded-full bg-black/50 p-2 text-white/90"
                          ><FaShareAlt /></button>
                        </div>
                      </div>
                      <div className="p-3">
                        <h5 className="text-sm font-semibold">{item.title}</h5>
                        <p className="text-xs text-text-secondary">{item.duration || 'Video'}</p>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Video strip: rendered above per-group when 'All' selected, avoid duplicate rendering here */}

      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-6" onClick={() => setActiveItem(null)}>
          <div className="w-full max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-[#0c1119] shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <h3 className="text-xl font-semibold text-white">{activeItem.title}</h3>
                <p className="text-sm text-white/55">{activeItem.eventType} • {activeItem.mediaType}</p>
              </div>
              <button onClick={() => setActiveItem(null)} className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/80 hover:bg-white/10 transition">
                Close
              </button>
            </div>

            <div className="grid gap-0 lg:grid-cols-[1.6fr_0.9fr]">
                          <div className="relative min-h-[420px] bg-black flex items-center justify-center">
                {activeItem.mediaType === 'photo' ? (
                  <Image src={activeItem.thumb} alt={activeItem.title} fill sizes="100vw" className="object-contain" priority />
                ) : (
                  <video controls autoPlay playsInline className="h-full w-full bg-black object-contain">
                    <source src={activeItem.videoUrl || sampleVideoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
                <div className="absolute top-4 right-4 flex gap-3">
                  <button onClick={() => toggleLike(activeItem.id)} className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm text-white transform transition ${likes[activeItem.id] ? 'bg-accent text-primary scale-105' : 'bg-white/6'}`}>
                    <FaHeart /> Like <span className="ml-2 text-xs">{likesCount[activeItem.id] || 0}</span>
                  </button>
                  <button onClick={() => doShare(activeItem)} className="inline-flex items-center gap-2 rounded-full bg-white/6 px-3 py-2 text-sm text-white"><FaShareAlt /> Share</button>
                </div>
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

                {/* Suggestions: keep the rail inside the clicked media type */}
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-2">You may also like</p>
                  {relatedItems.length > 0 ? (
                    <div>
                      <p className="mb-2 text-[11px] uppercase tracking-[0.25em] text-[rgba(212,175,55,0.75)]">
                        Similar picks
                      </p>
                      <div className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-1">
                                {relatedItems.map((suggestion) => (
                                  <button key={suggestion.id} aria-label={`Open ${suggestion.title}`} onClick={() => setActiveItem(WORK_ITEMS.find((item) => item.id === suggestion.id) || activeItem)} className="shrink-0 w-32 rounded-xl overflow-hidden border border-white/6 bg-black/20 snap-center">
                            <div className="relative h-20 w-full">
                              <Image src={suggestion.thumb} alt={suggestion.title} fill className="object-cover" loading="lazy" />
                            </div>
                            <div className="p-2 text-xs text-white/80">{suggestion.title}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-white/45">No matching suggestions found for this {activeItem.mediaType}.</p>
                  )}
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
      {toast && (
        <div role="status" aria-live="polite" className="fixed left-1/2 bottom-8 z-50 -translate-x-1/2 rounded-full bg-black/80 px-4 py-2 text-sm text-white shadow">
          {toast}
        </div>
      )}
    </Section>
  );
};

export default MediaLibrary;



