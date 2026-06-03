import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaInstagram, FaYoutube, FaHeart, FaShareAlt } from 'react-icons/fa';
import { containerVariants, itemVariants } from '@/utils/animations';
import { getGalleryPosterWebp } from '@/utils/imagePaths';
import { normalizeGalleryGroup, ALLOWED_GALLERY_GROUPS } from '@/utils/gallerySuggestions';
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

const getOrCreateClientId = () => {
  if (typeof window === 'undefined') return '';

  const storageKey = 'chitrahaar-client-id';
  const existing = localStorage.getItem(storageKey);
  if (existing) return existing;

  const generated = `anon-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  localStorage.setItem(storageKey, generated);
  return generated;
};


const INSTAGRAM_URL = 'https://instagram.com/chitrahaarfilms';
const YOUTUBE_URL = 'https://youtube.com/@chitrahaarfilms';

const WORK_ITEMS: WorkItem[] = [
  // Artist
  { id: 1, title: 'cf', eventType: 'Artist', mediaType: 'photo', thumb: '/Our Works Gallery/Artist/cf.jpg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 2, title: 'RAJ04410', eventType: 'Artist', mediaType: 'photo', thumb: '/Our Works Gallery/Artist/RAJ04410.JPG', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 3, title: 'Worldclass-354', eventType: 'Artist', mediaType: 'photo', thumb: '/Our Works Gallery/Artist/Worldclass-354.jpg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 4, title: 'Worldclass-355', eventType: 'Artist', mediaType: 'photo', thumb: '/Our Works Gallery/Artist/Worldclass-355.jpg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 5, title: 'Worldclass-357', eventType: 'Artist', mediaType: 'photo', thumb: '/Our Works Gallery/Artist/Worldclass-357.jpg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 6, title: 'Worldclass-358', eventType: 'Artist', mediaType: 'photo', thumb: '/Our Works Gallery/Artist/Worldclass-358.jpg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 7, title: 'Worldclass-374', eventType: 'Artist', mediaType: 'photo', thumb: '/Our Works Gallery/Artist/Worldclass-374.jpg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 8, title: 'Worldclass-379', eventType: 'Artist', mediaType: 'photo', thumb: '/Our Works Gallery/Artist/Worldclass-379.jpg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },

  // Corporate & Events
  { id: 9, title: 'CF-27', eventType: 'Corporate & Events', mediaType: 'photo', thumb: '/Our Works Gallery/Corporate & Events/CF-27.jpg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 10, title: 'CF-40', eventType: 'Corporate & Events', mediaType: 'photo', thumb: '/Our Works Gallery/Corporate & Events/CF-40.jpg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 11, title: 'CF-42', eventType: 'Corporate & Events', mediaType: 'photo', thumb: '/Our Works Gallery/Corporate & Events/CF-42.jpg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 12, title: 'CF-53', eventType: 'Corporate & Events', mediaType: 'photo', thumb: '/Our Works Gallery/Corporate & Events/CF-53.jpg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 13, title: 'CF-54', eventType: 'Corporate & Events', mediaType: 'photo', thumb: '/Our Works Gallery/Corporate & Events/CF-54.jpg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 14, title: 'CF-61', eventType: 'Corporate & Events', mediaType: 'photo', thumb: '/Our Works Gallery/Corporate & Events/CF-61.jpg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 15, title: 'CF-68', eventType: 'Corporate & Events', mediaType: 'photo', thumb: '/Our Works Gallery/Corporate & Events/CF-68.jpg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 16, title: 'CF-7', eventType: 'Corporate & Events', mediaType: 'photo', thumb: '/Our Works Gallery/Corporate & Events/CF-7.jpg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 17, title: 'CF008231', eventType: 'Corporate & Events', mediaType: 'photo', thumb: '/Our Works Gallery/Corporate & Events/CF008231.jpg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 18, title: 'CF008434', eventType: 'Corporate & Events', mediaType: 'photo', thumb: '/Our Works Gallery/Corporate & Events/CF008434.jpg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 19, title: 'CF008595', eventType: 'Corporate & Events', mediaType: 'photo', thumb: '/Our Works Gallery/Corporate & Events/CF008595.jpg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 20, title: 'CF008742', eventType: 'Corporate & Events', mediaType: 'photo', thumb: '/Our Works Gallery/Corporate & Events/CF008742.jpg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 21, title: 'CF008744', eventType: 'Corporate & Events', mediaType: 'photo', thumb: '/Our Works Gallery/Corporate & Events/CF008744.jpg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 22, title: 'CF008954', eventType: 'Corporate & Events', mediaType: 'photo', thumb: '/Our Works Gallery/Corporate & Events/CF008954.jpg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 23, title: 'CF009007', eventType: 'Corporate & Events', mediaType: 'photo', thumb: '/Our Works Gallery/Corporate & Events/CF009007.jpg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 24, title: 'Worldclass-174', eventType: 'Corporate & Events', mediaType: 'photo', thumb: '/Our Works Gallery/Corporate & Events/Worldclass-174.jpg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 25, title: 'Worldclass-177', eventType: 'Corporate & Events', mediaType: 'photo', thumb: '/Our Works Gallery/Corporate & Events/Worldclass-177.jpg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 26, title: 'Worldclass-179', eventType: 'Corporate & Events', mediaType: 'photo', thumb: '/Our Works Gallery/Corporate & Events/Worldclass-179.jpg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 27, title: 'Worldclass-183', eventType: 'Corporate & Events', mediaType: 'photo', thumb: '/Our Works Gallery/Corporate & Events/Worldclass-183.jpg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 28, title: 'Worldclass-185', eventType: 'Corporate & Events', mediaType: 'photo', thumb: '/Our Works Gallery/Corporate & Events/Worldclass-185.jpg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 29, title: 'Worldclass-342', eventType: 'Corporate & Events', mediaType: 'photo', thumb: '/Our Works Gallery/Corporate & Events/Worldclass-342.jpg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 30, title: 'Worldclass-349', eventType: 'Corporate & Events', mediaType: 'photo', thumb: '/Our Works Gallery/Corporate & Events/Worldclass-349.jpg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 31, title: 'Worldclass-52', eventType: 'Corporate & Events', mediaType: 'photo', thumb: '/Our Works Gallery/Corporate & Events/Worldclass-52.jpg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 32, title: 'Worldclass-56', eventType: 'Corporate & Events', mediaType: 'photo', thumb: '/Our Works Gallery/Corporate & Events/Worldclass-56.jpg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 33, title: 'CORPRATE', eventType: 'Corporate & Events', mediaType: 'video', thumb: '/Our Works Gallery/Corporate & Events/CORPRATE.mp4', description: '', videoUrl: '/Our Works Gallery/Corporate & Events/CORPRATE.mp4', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 34, title: 'EVENTS', eventType: 'Corporate & Events', mediaType: 'video', thumb: '/Our Works Gallery/Corporate & Events/EVENTS.m4v', description: '', videoUrl: '/Our Works Gallery/Corporate & Events/EVENTS.m4v', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 35, title: 'PRODUCT VIDEO', eventType: 'Corporate & Events', mediaType: 'video', thumb: '/Our Works Gallery/Corporate & Events/PRODUCT VIDEO.mp4', description: '', videoUrl: '/Our Works Gallery/Corporate & Events/PRODUCT VIDEO.mp4', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },

  // Fashion
  { id: 36, title: 'cf-2', eventType: 'Fashion', mediaType: 'photo', thumb: '/Our Works Gallery/Fashion/cf-2.jpg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 37, title: 'cf-3', eventType: 'Fashion', mediaType: 'photo', thumb: '/Our Works Gallery/Fashion/cf-3.jpg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 38, title: 'cf-4', eventType: 'Fashion', mediaType: 'photo', thumb: '/Our Works Gallery/Fashion/cf-4.jpg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 39, title: 'cf-5', eventType: 'Fashion', mediaType: 'photo', thumb: '/Our Works Gallery/Fashion/cf-5.jpg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 40, title: 'cf-6', eventType: 'Fashion', mediaType: 'photo', thumb: '/Our Works Gallery/Fashion/cf-6.jpg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 41, title: 'fashion video', eventType: 'Fashion', mediaType: 'video', thumb: '/Our Works Gallery/Fashion/fashion video.mp4', description: '', videoUrl: '/Our Works Gallery/Fashion/fashion video.mp4', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },

  // Food & Beverages
  { id: 42, title: 'F&B', eventType: 'Food & Beverages', mediaType: 'video', thumb: '/Our Works Gallery/Food & Beverages/F&B.mp4', description: '', videoUrl: '/Our Works Gallery/Food & Beverages/F&B.mp4', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 43, title: '2', eventType: 'Food & Beverages', mediaType: 'photo', thumb: '/Our Works Gallery/Food & Beverages/2.jpeg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 44, title: '3', eventType: 'Food & Beverages', mediaType: 'photo', thumb: '/Our Works Gallery/Food & Beverages/3.jpeg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 45, title: '4', eventType: 'Food & Beverages', mediaType: 'photo', thumb: '/Our Works Gallery/Food & Beverages/4.jpeg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 46, title: '5', eventType: 'Food & Beverages', mediaType: 'photo', thumb: '/Our Works Gallery/Food & Beverages/5.jpeg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 47, title: '6', eventType: 'Food & Beverages', mediaType: 'photo', thumb: '/Our Works Gallery/Food & Beverages/6.jpeg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 48, title: '7', eventType: 'Food & Beverages', mediaType: 'photo', thumb: '/Our Works Gallery/Food & Beverages/7.jpeg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 49, title: '8', eventType: 'Food & Beverages', mediaType: 'photo', thumb: '/Our Works Gallery/Food & Beverages/8.jpeg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 50, title: '9', eventType: 'Food & Beverages', mediaType: 'photo', thumb: '/Our Works Gallery/Food & Beverages/9.jpeg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 51, title: '10', eventType: 'Food & Beverages', mediaType: 'photo', thumb: '/Our Works Gallery/Food & Beverages/10.jpeg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 52, title: '11', eventType: 'Food & Beverages', mediaType: 'photo', thumb: '/Our Works Gallery/Food & Beverages/11.jpeg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 53, title: '12', eventType: 'Food & Beverages', mediaType: 'photo', thumb: '/Our Works Gallery/Food & Beverages/12.jpeg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 54, title: '13', eventType: 'Food & Beverages', mediaType: 'photo', thumb: '/Our Works Gallery/Food & Beverages/13.jpeg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 55, title: '14', eventType: 'Food & Beverages', mediaType: 'photo', thumb: '/Our Works Gallery/Food & Beverages/14.jpeg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 56, title: '15', eventType: 'Food & Beverages', mediaType: 'photo', thumb: '/Our Works Gallery/Food & Beverages/15.jpeg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 57, title: '16', eventType: 'Food & Beverages', mediaType: 'photo', thumb: '/Our Works Gallery/Food & Beverages/16.jpeg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  // Map missing/newer filenames to available images in the folder
  { id: 58, title: '20', eventType: 'Food & Beverages', mediaType: 'photo', thumb: '/Our Works Gallery/Food & Beverages/10.jpeg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 59, title: '21', eventType: 'Food & Beverages', mediaType: 'photo', thumb: '/Our Works Gallery/Food & Beverages/11.jpeg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 60, title: '27', eventType: 'Food & Beverages', mediaType: 'photo', thumb: '/Our Works Gallery/Food & Beverages/12.jpeg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 61, title: '28', eventType: 'Food & Beverages', mediaType: 'photo', thumb: '/Our Works Gallery/Food & Beverages/13.jpeg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 62, title: '29', eventType: 'Food & Beverages', mediaType: 'photo', thumb: '/Our Works Gallery/Food & Beverages/14.jpeg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 63, title: '30', eventType: 'Food & Beverages', mediaType: 'photo', thumb: '/Our Works Gallery/Food & Beverages/15.jpeg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 64, title: '32', eventType: 'Food & Beverages', mediaType: 'photo', thumb: '/Our Works Gallery/Food & Beverages/16.jpeg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },

  // Wedding
  { id: 65, title: '0U8A4373', eventType: 'Wedding', mediaType: 'photo', thumb: '/Our Works Gallery/Wedding/0U8A4373.jpg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 66, title: '0U8A4857', eventType: 'Wedding', mediaType: 'photo', thumb: '/Our Works Gallery/Wedding/0U8A4857.jpg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 67, title: '0U8A5138', eventType: 'Wedding', mediaType: 'photo', thumb: '/Our Works Gallery/Wedding/0U8A5138.jpg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 68, title: '0U8A5532', eventType: 'Wedding', mediaType: 'photo', thumb: '/Our Works Gallery/Wedding/0U8A5532.jpg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 69, title: 'DSC04511', eventType: 'Wedding', mediaType: 'photo', thumb: '/Our Works Gallery/Wedding/DSC04511.jpg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 70, title: 'DSC04586', eventType: 'Wedding', mediaType: 'photo', thumb: '/Our Works Gallery/Wedding/DSC04586.jpg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 71, title: 'cf-2-wed', eventType: 'Wedding', mediaType: 'photo', thumb: '/Our Works Gallery/Wedding/cf-2.jpg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 72, title: 'cf-3-wed', eventType: 'Wedding', mediaType: 'photo', thumb: '/Our Works Gallery/Wedding/cf-3.jpg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 73, title: 'cf-4-wed', eventType: 'Wedding', mediaType: 'photo', thumb: '/Our Works Gallery/Wedding/cf-4.jpg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 74, title: 'cf-wed', eventType: 'Wedding', mediaType: 'photo', thumb: '/Our Works Gallery/Wedding/cf.jpg', description: '', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 75, title: 'Tejas & Taniya Preweding', eventType: 'Wedding', mediaType: 'video', thumb: '/Our Works Gallery/Wedding/._Tejas & Taniya.mov Preweding.mov', description: '', videoUrl: '/Our Works Gallery/Wedding/._Tejas & Taniya.mov Preweding.mov', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
  { id: 76, title: 'WEDDING', eventType: 'Wedding', mediaType: 'video', thumb: '/Our Works Gallery/Wedding/._WEDDING.mp4', description: '', videoUrl: '/Our Works Gallery/Wedding/._WEDDING.mp4', instagramUrl: INSTAGRAM_URL, youtubeUrl: YOUTUBE_URL },
];

const eventTypes: EventFilter[] = ['All', ...ALLOWED_GALLERY_GROUPS];

// Define section order for interleaving
const SECTION_ORDER: EventFilter[] = ['Food & Beverages', 'Corporate & Events', 'Fashion', 'Artist', 'Short Films', 'Wedding'];

// Helper: interleave items by position across all sections
const interleaveItemsBySections = (items: WorkItem[], sections: EventFilter[]): WorkItem[] => {
  const bySectionMap: Record<string, WorkItem[]> = {};
  
  sections.forEach(section => {
    bySectionMap[section] = items.filter(item => item.eventType === section);
  });

  const result: WorkItem[] = [];
  let maxLength = Math.max(...sections.map(s => (bySectionMap[s] || []).length));
  
  for (let position = 0; position < maxLength; position++) {
    for (const section of sections) {
      const sectionItems = bySectionMap[section] || [];
      if (position < sectionItems.length) {
        result.push(sectionItems[position]);
      }
    }
  }

  return result;
};

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
  const carouselRef = useRef<HTMLDivElement | null>(null);
  
  const autoScrollTimerRef = useRef<number | null>(null);
  const autoScrollIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const autoScrollCarouselRef = useRef<number | null>(null);
  const modalAdvanceTimerRef = useRef<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const parseDurationSeconds = (duration?: string) => {
    if (!duration) return null;

    const parts = duration.split(':').map(Number).reverse();
    let seconds = 0;
    if (parts.length >= 1) seconds += parts[0];
    if (parts.length >= 2) seconds += parts[1] * 60;
    if (parts.length >= 3) seconds += parts[2] * 3600;
    return seconds;
  };

  // Detect mobile and avoid auto-play on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const filteredItems = useMemo(() => {
    const baseFiltered = WORK_ITEMS.filter((item) => {
      const eventOk = eventType === 'All' || item.eventType === eventType;
      const mediaOk = mediaType === 'all' || item.mediaType === mediaType;
      return eventOk && mediaOk;
    });

    // If showing all events, interleave by section order; otherwise return as-is
    if (eventType === 'All') {
      return interleaveItemsBySections(baseFiltered, SECTION_ORDER);
    }
    return baseFiltered;
  }, [eventType, mediaType]);

  const getFrameClass = (item: WorkItem, isActive = false) => {
    return isActive ? 'shrink-0 w-72' : 'shrink-0 w-56';
  };

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
    const currentIndex = filteredItems.findIndex((candidate) => candidate.id === item.id);
    setActiveIndex(currentIndex >= 0 ? currentIndex : 0);
  };

  useEffect(() => {
    if (modalAdvanceTimerRef.current) {
      window.clearTimeout(modalAdvanceTimerRef.current);
      modalAdvanceTimerRef.current = null;
    }

    if (!activeItem) {
      return;
    }

    const dwellSeconds = parseDurationSeconds(activeItem.duration) ?? (activeItem.mediaType === 'video' ? 8 : 5);
    const dwell = Math.min(Math.max(dwellSeconds, 4), 20) * 1000;

    modalAdvanceTimerRef.current = window.setTimeout(() => {
      const currentIndex = WORK_ITEMS.findIndex((item) => item.id === activeItem.id);
      if (currentIndex === -1) return;

      const nextRelated = WORK_ITEMS.slice(currentIndex + 1).find((item) => item.eventType === activeItem.eventType && item.mediaType === activeItem.mediaType && item.id !== activeItem.id)
        || WORK_ITEMS.find((item) => item.eventType === activeItem.eventType && item.mediaType === activeItem.mediaType && item.id !== activeItem.id);

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
  }, [activeItem]);

  // Carousel auto-scroll: 3 seconds per item
  useEffect(() => {
    if (filteredItems.length === 0) return;

    if (autoScrollCarouselRef.current) {
      window.clearInterval(autoScrollCarouselRef.current);
    }

    autoScrollCarouselRef.current = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % filteredItems.length);
    }, 3000);

    return () => {
      if (autoScrollCarouselRef.current) {
        window.clearInterval(autoScrollCarouselRef.current);
      }
    };
  }, [filteredItems]);

  const handleModalNext = useCallback(() => {
    if (!activeItem || filteredItems.length === 0) return;
    const currentIndex = filteredItems.findIndex((item) => item.id === activeItem.id);
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % filteredItems.length;
    setActiveIndex(nextIndex);
    setActiveItem(filteredItems[nextIndex]);
  }, [activeItem, filteredItems]);

  const handleModalPrev = useCallback(() => {
    if (!activeItem || filteredItems.length === 0) return;
    const currentIndex = filteredItems.findIndex((item) => item.id === activeItem.id);
    const prevIndex = currentIndex === -1 ? 0 : (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    setActiveIndex(prevIndex);
    setActiveItem(filteredItems[prevIndex]);
  }, [activeItem, filteredItems]);

  useEffect(() => {
    if (!activeItem) return;

    const handler = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        handleModalPrev();
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        handleModalNext();
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        setActiveItem(null);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeItem, handleModalNext, handleModalPrev]);

  useEffect(() => {
    if (filteredItems.length === 0) return;

    if (activeIndex >= filteredItems.length) {
      setActiveIndex(0);
      return;
    }

    if (carouselRef.current) {
      const itemWidth = 256 + 8; // w-64 + gap
      const containerWidth = carouselRef.current.clientWidth;
      const centerOffset = containerWidth / 2 - itemWidth / 2;
      const scrollPosition = activeIndex * itemWidth - centerOffset;
      carouselRef.current.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    }
  }, [activeIndex, filteredItems]);

  // Auto-play video in the visible/active card for up to 5 seconds (desktop only)
  useEffect(() => {
    // Skip auto-play on mobile
    if (isMobile || !carouselRef.current || filteredItems.length === 0) return;

    // Pause all videos first
    const allVideos: HTMLVideoElement[] = Array.from(carouselRef.current.querySelectorAll('video')) as HTMLVideoElement[];
    allVideos.forEach((v) => {
      try { v.pause(); } catch (e) {}
    });

    if (activeIndex < 0 || activeIndex >= carouselRef.current.children.length) return;

    const activeChild = carouselRef.current.children[activeIndex] as HTMLElement | undefined;
    if (!activeChild) return;

    const videoEl = activeChild.querySelector('video') as HTMLVideoElement | null;
    if (!videoEl) return;

    let cancelled = false;
    const playPromise = (async () => {
      try {
        // Ensure muted to allow autoplay in browsers
        videoEl.muted = true;
        videoEl.playsInline = true;
        await videoEl.play();
      } catch (e) {
        // ignore play errors
      }

      if (cancelled) return;

      const maxMs = 5000; // 5 seconds cap
      // If video is shorter than 5s, let it end naturally; otherwise pause after 5s
      const effectiveMs = Math.min(maxMs, (videoEl.duration && Number.isFinite(videoEl.duration) ? videoEl.duration * 1000 : maxMs));

      const timeoutId = window.setTimeout(() => {
        try { videoEl.pause(); } catch (e) {}
      }, effectiveMs);

      const onEnded = () => {
        window.clearTimeout(timeoutId);
      };

      videoEl.addEventListener('ended', onEnded);

      return () => {
        cancelled = true;
        window.clearTimeout(timeoutId);
        try { videoEl.removeEventListener('ended', onEnded); videoEl.pause(); } catch (e) {}
      };
    })();

    return () => {
      // cancel play handler
      try { if (typeof playPromise === 'function') (playPromise as any)(); } catch (e) {}
    };
  }, [activeIndex, filteredItems, isMobile]);

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
    const url = typeof window !== 'undefined'
      ? window.location.href.split('#')[0] + `#works-gallery-item-${item.id}`
      : '';
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

  // Deep-link: when the active item changes update the URL hash so it can be shared
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      if (activeItem) {
        history.replaceState(null, '', `#works-gallery-item-${activeItem.id}`);
      } else {
        history.replaceState(null, '', '#works-gallery');
      }
    } catch (e) {
      // ignore replaceState errors
    }
  }, [activeItem]);

  // On mount, check the URL hash for a deep-link and open the matching item in the modal
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash || '';
    const m = hash.match(/#works-gallery-item-(\d+)/);
    if (m) {
      const id = Number(m[1]);
      const found = WORK_ITEMS.find((it) => it.id === id);
      if (found) {
        // defer to next tick to avoid interfering with initial render
        setTimeout(() => setActiveItem(found), 0);
      }
    }
  }, []);

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
      <div ref={filterStripRef} className="flex w-full gap-1 md:gap-2 overflow-x-auto whitespace-nowrap rounded-2xl border border-[rgba(255,255,255,0.03)] bg-[rgba(255,255,255,0.02)] px-2 md:px-3 py-2 scrollbar-hide mb-5">
        <span className="shrink-0 rounded-full border border-[rgba(212,175,55,0.08)] bg-[rgba(212,175,55,0.03)] px-2 md:px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[rgba(212,175,55,0.9)]">Filters</span>
        {eventTypes.map((et) => (
          <button
            key={et}
            onClick={() => handleFilterClick(et, 'event')}
            className={`shrink-0 px-2 md:px-4 py-2 rounded-full text-xs md:text-sm font-semibold border transition-all duration-300 ${eventType === et ? 'bg-[rgba(212,175,55,0.12)] text-[var(--color-text)] border-[rgba(212,175,55,0.12)]' : 'border-[rgba(255,255,255,0.03)] text-[var(--color-muted)] hover:border-[rgba(212,175,55,0.08)]'}`}
          >
            {et}
          </button>
        ))}

        <span className="shrink-0 rounded-full border border-[rgba(212,175,55,0.08)] bg-[rgba(212,175,55,0.03)] px-2 md:px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[rgba(212,175,55,0.9)] ml-2 md:ml-4">Media</span>
        {(['all', 'photo', 'video'] as MediaType[]).map((mt) => (
          <button
            key={mt}
            onClick={() => handleFilterClick(mt, 'media')}
            className={`shrink-0 px-2 md:px-4 py-2 rounded-lg text-xs md:text-sm font-semibold border transition-all duration-300 ${mediaType === mt ? 'bg-[rgba(212,175,55,0.12)] text-[var(--color-text)] border-[rgba(212,175,55,0.12)]' : 'border-[rgba(255,255,255,0.03)] text-[var(--color-muted)] hover:border-[rgba(212,175,55,0.08)]'}`}
          >
            {mt === 'all' ? 'All' : mt === 'photo' ? 'Photos' : 'Videos'}
          </button>
        ))}
      </div>

      {eventType === 'All' ? (
        <div className="mb-3">
          <h4 className="mb-2 text-sm md:text-base font-semibold">All Media - Mixed Sections</h4>
          <div className="relative">
            <div ref={carouselRef} className="flex gap-1 md:gap-2 overflow-x-auto scrollbar-hide py-2">
              {filteredItems.map((item, idx) => {
                const isActive = idx === activeIndex;
                const frameClass = isMobile 
                  ? 'w-40 md:w-56' 
                  : isActive ? 'w-72' : 'w-56';
                return (
                  <div
                    key={item.id}
                    className={`${frameClass} transition-all duration-300 flex-shrink-0 ${isActive ? 'scale-[1.18] z-20 opacity-100 shadow-[0_20px_60px_rgba(0,0,0,0.25)]' : 'scale-[0.92] opacity-60'}`}
                  >
                    <Card variant="hover" className="overflow-hidden rounded-lg hover-lift transition-all duration-500">
                      {item.mediaType === 'photo' ? (
                        <div className="relative w-full aspect-[9/16] cursor-pointer" onClick={() => openItem(item)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openItem(item); } }} role="button" tabIndex={0}>
                          <Image src={encodeURI(item.thumb).replace(/&/g, '%26')} alt={item.title} fill className="object-cover" priority={idx < 2} />
                          <div className="absolute top-1 right-1 flex gap-1">
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleLike(item.id); }}
                              aria-pressed={!!likes[item.id]}
                              className={`rounded-full p-1 text-white/90 text-sm ${likes[item.id] ? 'bg-accent text-primary scale-110' : 'bg-black/50'}`}
                            ><FaHeart /></button>
                            <button
                              onClick={(e) => { e.stopPropagation(); doShare(item); }}
                              className="rounded-full bg-black/50 p-1 text-white/90 text-sm"
                            ><FaShareAlt /></button>
                          </div>
                        </div>
                      ) : (
                        <div className="relative w-full aspect-[9/16] bg-black cursor-pointer" onClick={() => openItem(item)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openItem(item); } }} role="button" tabIndex={0}>
                          <video
                            src={encodeURI(item.videoUrl || '').replace(/&/g, '%26')}
                            muted
                            playsInline
                            preload="metadata"
                            className="h-full w-full object-cover"
                            aria-label={item.title}
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="rounded-full bg-black/60 p-2 text-white/90 text-sm">▶</div>
                          </div>
                          <div className="absolute top-1 right-1 flex gap-1">
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleLike(item.id); }}
                              aria-pressed={!!likes[item.id]}
                              className={`rounded-full p-1 text-white/90 text-sm ${likes[item.id] ? 'bg-accent text-primary scale-110' : 'bg-black/50'} transform transition`}
                            ><FaHeart /></button>
                            <button
                              onClick={(e) => { e.stopPropagation(); doShare(item); }}
                              className="rounded-full bg-black/50 p-1 text-white/90 text-sm"
                            ><FaShareAlt /></button>
                          </div>
                        </div>
                      )}
                      <div className="p-2">
                        <h5 className="text-xs font-semibold truncate">{item.title}</h5>
                        <p className="text-xs text-text-secondary truncate">{item.eventType}</p>
                      </div>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-3">
          <h4 className="mb-2 text-sm md:text-base font-semibold">{eventType}</h4>
          <div className="relative">
            <div ref={carouselRef} className="flex gap-1 md:gap-2 overflow-x-auto scrollbar-hide py-2">
              {filteredItems.map((item, idx) => {
                const isActive = idx === activeIndex;
                const frameClass = isMobile 
                  ? 'w-40 md:w-56' 
                  : isActive ? 'w-72' : 'w-56';
                return (
                  <div
                    key={item.id}
                    className={`${frameClass} transition-all duration-300 flex-shrink-0 ${isActive ? 'scale-[1.18] z-20 opacity-100 shadow-[0_20px_60px_rgba(0,0,0,0.25)]' : 'scale-[0.92] opacity-60'}`}
                  >
                    <Card variant="hover" className="overflow-hidden rounded-lg hover-lift transition-all duration-500">
                      {item.mediaType === 'photo' ? (
                        <div className="relative w-full aspect-[9/16] cursor-pointer" onClick={() => openItem(item)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openItem(item); } }} role="button" tabIndex={0}>
                          <Image src={encodeURI(item.thumb).replace(/&/g, '%26')} alt={item.title} fill className="object-cover" priority={idx < 2} />
                          <div className="absolute top-1 right-1 flex gap-1">
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleLike(item.id); }}
                              aria-pressed={!!likes[item.id]}
                              className={`rounded-full p-1 text-white/90 text-sm ${likes[item.id] ? 'bg-accent text-primary scale-110' : 'bg-black/50'}`}
                            ><FaHeart /></button>
                            <button
                              onClick={(e) => { e.stopPropagation(); doShare(item); }}
                              className="rounded-full bg-black/50 p-1 text-white/90 text-sm"
                            ><FaShareAlt /></button>
                          </div>
                        </div>
                      ) : (
                        <div className="relative w-full aspect-[9/16] bg-black cursor-pointer" onClick={() => openItem(item)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openItem(item); } }} role="button" tabIndex={0}>
                          <video
                            src={encodeURI(item.videoUrl || '').replace(/&/g, '%26')}
                            muted
                            playsInline
                            preload="metadata"
                            className="h-full w-full object-cover"
                            aria-label={item.title}
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="rounded-full bg-black/60 p-2 text-white/90 text-sm">▶</div>
                          </div>
                          <div className="absolute top-1 right-1 flex gap-1">
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleLike(item.id); }}
                              aria-pressed={!!likes[item.id]}
                              className={`rounded-full p-1 text-white/90 text-sm ${likes[item.id] ? 'bg-accent text-primary scale-110' : 'bg-black/50'} transform transition`}
                            ><FaHeart /></button>
                            <button
                              onClick={(e) => { e.stopPropagation(); doShare(item); }}
                              className="rounded-full bg-black/50 p-1 text-white/90 text-sm"
                            ><FaShareAlt /></button>
                          </div>
                        </div>
                      )}
                      <div className="p-2">
                        <h5 className="text-xs font-semibold truncate">{item.title}</h5>
                        <p className="text-xs text-text-secondary truncate">{item.mediaType === 'photo' ? item.eventType : item.duration || 'Video'}</p>
                      </div>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6">
          <div className="absolute inset-0 bg-black/80" onClick={() => setActiveItem(null)} />
          <div className="relative w-full max-w-6xl overflow-hidden rounded-xl sm:rounded-2xl md:rounded-[2rem] border border-white/10 bg-[#020405] shadow-2xl max-h-[90vh] flex flex-col">
            {/* Close Button */}
            <button
              onClick={() => setActiveItem(null)}
              aria-label="Close modal"
              className="absolute top-3 right-3 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black/90 md:top-4 md:right-4"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Navigation Buttons */}
            <div className="absolute inset-y-0 left-0 z-20 hidden sm:flex w-16 items-center justify-center bg-black/20 p-3">
              <button
                onClick={handleModalPrev}
                aria-label="Previous media"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/70 text-white transition hover:bg-black/90"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
            <div className="absolute inset-y-0 right-0 z-20 hidden sm:flex w-16 items-center justify-center bg-black/20 p-3">
              <button
                onClick={handleModalNext}
                aria-label="Next media"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/70 text-white transition hover:bg-black/90"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Media Display */}
            <div className="relative flex-1 min-h-0 bg-black md:aspect-[16/10]">
              {activeItem.mediaType === 'photo' ? (
                <Image src={encodeURI(activeItem.thumb).replace(/&/g, '%26')} alt="Media preview" fill sizes="100vw" className="object-contain" priority />
              ) : (
                <video controls autoPlay playsInline className="h-full w-full object-contain" preload="metadata">
                  <source src={encodeURI(activeItem.videoUrl || '').replace(/&/g, '%26')} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>

            {/* Footer Controls */}
            <div className="border-t border-white/10 bg-[#090d14] px-3 py-2 sm:px-5 sm:py-4 md:px-6 md:py-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <button onClick={() => toggleLike(activeItem.id)} className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs sm:px-4 sm:py-3 sm:text-sm font-semibold text-white transition ${likes[activeItem.id] ? 'bg-accent text-primary' : 'bg-white/10 hover:bg-white/15'}`}>
                    <FaHeart /> <span className="hidden sm:inline">Like</span> <span className="text-xs">{likesCount[activeItem.id] || 0}</span>
                  </button>
                  <button onClick={() => doShare(activeItem)} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs sm:px-4 sm:py-3 sm:text-sm font-semibold text-white transition hover:bg-white/15">
                    <FaShareAlt /> <span className="hidden sm:inline">Share</span>
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  {activeItem.instagramUrl && (
                    <a href={activeItem.instagramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-3 py-2 text-xs sm:px-4 sm:py-3 sm:text-sm font-semibold text-primary transition hover:opacity-95">
                      <FaInstagram /> <span className="hidden sm:inline">Instagram</span>
                    </a>
                  )}
                  {activeItem.mediaType === 'video' && activeItem.youtubeUrl && (
                    <a href={activeItem.youtubeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs sm:px-4 sm:py-3 sm:text-sm font-semibold text-white transition hover:bg-white/15">
                      <FaYoutube /> <span className="hidden sm:inline">YouTube</span>
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
