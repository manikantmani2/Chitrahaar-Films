import React, { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaThumbsUp, FaThumbsDown, FaTimes } from 'react-icons/fa';
import {
  getGalleryPosterWebp,
  getGalleryThumbAvif,
  getGalleryThumbWebp,
} from '@/utils/imagePaths';
import { getRelatedGallerySuggestions, type GallerySuggestionItem } from '@/utils/gallerySuggestions';

export type MediaKind = 'photo' | 'video';

export interface MediaDetailModalProps {
  open: boolean;
  title: string;
  description: string;
  kind: MediaKind;
  src: string;
  poster?: string;
  metaLabel?: string;
  metaValue?: string;
  sourceLinks?: Array<{
    label: string;
    href: string;
  }>;
  suggestions?: GallerySuggestionItem[];
  onSelectSuggestion?: (suggestionId: string | number) => void;
  activeSuggestionId?: string | number;
  activeSuggestionGroup?: string | null;
  storageKey: string;
  onClose: () => void;
}

type Reaction = 'like' | 'dislike' | null;
interface CommentItem {
  id: number;
  text: string;
  createdAt: string;
}

const suggestionRailVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const suggestionCardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

const parseDurationSeconds = (duration?: string) => {
  if (!duration) return null;

  const parts = duration.split(':').map(Number).reverse();
  let seconds = 0;
  if (parts.length >= 1) seconds += parts[0];
  if (parts.length >= 2) seconds += parts[1] * 60;
  if (parts.length >= 3) seconds += parts[2] * 3600;
  return seconds;
};

type SuggestionRailProps = {
  items: NonNullable<MediaDetailModalProps['suggestions']>;
  railKind: MediaKind;
  onSelectSuggestion?: (suggestionId: string | number) => void;
};

const SuggestionRail: React.FC<SuggestionRailProps> = ({ items, railKind, onSelectSuggestion }) => {
  const railRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);

  useEffect(() => {
    setActiveIndex(0);
    activeIndexRef.current = 0;
    const rail = railRef.current;

    if (!rail || items.length === 0) {
      return;
    }

    const scrollToIndex = (nextIndex: number, behavior: ScrollBehavior = 'smooth') => {
      const target = rail.querySelectorAll<HTMLElement>('[data-suggestion-card="true"]')[nextIndex];
      if (!target) return;

      const left = target.offsetLeft - (rail.clientWidth - target.clientWidth) / 2;
      rail.scrollTo({ left: Math.max(0, left), behavior });
      setActiveIndex(nextIndex);
      activeIndexRef.current = nextIndex;
    };

    scrollToIndex(0, 'auto');
  }, [items, onSelectSuggestion, railKind]);

  const scrollByCards = (direction: -1 | 1) => {
    const rail = railRef.current;
    if (!rail) return;

    const cards = Array.from(rail.querySelectorAll<HTMLElement>('[data-suggestion-card="true"]'));
    if (cards.length === 0) return;

    const nextIndex = Math.min(Math.max(activeIndexRef.current + direction, 0), cards.length - 1);
    const target = cards[nextIndex];
    if (!target) return;

    const left = target.offsetLeft - (rail.clientWidth - target.clientWidth) / 2;
    rail.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
    setActiveIndex(nextIndex);
    activeIndexRef.current = nextIndex;
  };

  const handleRailScroll = () => {
    const rail = railRef.current;
    if (!rail) return;

    const cards = Array.from(rail.querySelectorAll<HTMLElement>('[data-suggestion-card="true"]'));
    if (!cards.length) return;

    const center = rail.scrollLeft + rail.clientWidth / 2;
    let closest = 0;
    let minDistance = Infinity;

    cards.forEach((card, index) => {
      const cardCenter = card.offsetLeft + card.clientWidth / 2;
      const distance = Math.abs(center - cardCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closest = index;
      }
    });

    activeIndexRef.current = closest;
    setActiveIndex(closest);
  };

  if (items.length === 0) return null;

  return (
    <div className="rounded-3xl border border-[rgba(212,175,55,0.14)] bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-4 shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.35em] text-[rgba(212,175,55,0.95)]">
            Related picks
          </p>
          <p className="mt-2 text-sm text-white/65">
            Related photos and videos from the same gallery group. Scroll manually or use the arrows.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollByCards(-1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/25 text-white/80 transition hover:bg-white/10"
            aria-label="Scroll suggestions left"
          >
            <FaChevronLeft />
          </button>
          <button
            type="button"
            onClick={() => scrollByCards(1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/25 text-white/80 transition hover:bg-white/10"
            aria-label="Scroll suggestions right"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      <motion.div
        ref={railRef}
        className="flex gap-4 overflow-x-auto pb-2 pr-2 scrollbar-hide snap-x snap-mandatory cursor-grab active:cursor-grabbing scroll-smooth"
        variants={suggestionRailVariants}
        initial="hidden"
        animate="visible"
        drag="x"
        dragConstraints={{ left: -20, right: 20 }}
        dragElastic={0.08}
        whileTap={{ cursor: 'grabbing' }}
        onScroll={handleRailScroll}
      >
        {items.map((suggestion, index) => {
          const isActive = index === activeIndex;

          return (
            <motion.button
              key={`${suggestion.id}-${index}`}
              type="button"
              onClick={() => onSelectSuggestion?.(suggestion.id)}
              className={`group snap-center overflow-hidden rounded-2xl border text-left transition-[transform,opacity,border-color,box-shadow] duration-500 hover:-translate-y-1 hover:border-[rgba(212,175,55,0.28)] hover:shadow-[0_16px_45px_rgba(0,0,0,0.25)] ${isActive ? 'border-[rgba(212,175,55,0.45)] bg-[#111721] scale-[1.06] opacity-100 shadow-[0_22px_60px_rgba(0,0,0,0.34)]' : 'border-white/10 bg-[#0c1119] scale-[0.94] opacity-70'}`}
              variants={suggestionCardVariants}
              whileHover={{ y: -4 }}
              style={{ width: 340 }}
              data-suggestion-card="true"
            >
              <div className="relative w-full overflow-hidden bg-black" style={{ height: 198 }}>
                <picture className="relative block h-full w-full">
                  <source srcSet={getGalleryThumbAvif(suggestion.thumb, 'small')} type="image/avif" />
                  <source srcSet={getGalleryThumbWebp(suggestion.thumb, 'small')} type="image/webp" />
                  <Image
                    src={suggestion.thumb}
                    alt={suggestion.title}
                    fill
                    sizes="280px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </picture>
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.05),rgba(0,0,0,0.7))]" />
                <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/35 px-3 py-1 text-[10px] uppercase tracking-[0.35em] text-white/85 backdrop-blur-sm">
                  {suggestion.mediaType}
                </div>
                {suggestion.duration && (
                  <div className="absolute right-4 top-4 rounded-full border border-white/15 bg-black/35 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-white/85 backdrop-blur-sm">
                    {suggestion.duration}
                  </div>
                )}
              </div>

              <div className="space-y-2 p-4">
                <h4 className="line-clamp-1 text-base font-semibold text-white">{suggestion.title}</h4>
                <p className="line-clamp-2 text-sm leading-6 text-white/60">{suggestion.description}</p>
                <div className="flex items-center justify-between pt-1 text-[11px] uppercase tracking-[0.25em] text-[rgba(212,175,55,0.85)]">
                  <span>{suggestion.mediaType}</span>
                  <span>View</span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
};

const MediaDetailModal: React.FC<MediaDetailModalProps> = ({
  open,
  title,
  description,
  kind,
  src,
  poster,
  metaLabel,
  metaValue,
  sourceLinks = [],
  suggestions = [],
  onSelectSuggestion,
  activeSuggestionId,
  activeSuggestionGroup,
  storageKey,
  onClose,
}) => {
  const [reaction, setReaction] = useState<Reaction>(null);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<CommentItem[]>([]);
  const rightColRef = React.useRef<HTMLDivElement | null>(null);
  const filteredSuggestions = useMemo(
    () => getRelatedGallerySuggestions(suggestions, { activeId: activeSuggestionId, activeGroup: activeSuggestionGroup, activeMediaType: kind }, 8),
    [activeSuggestionId, activeSuggestionGroup, kind, suggestions],
  );

  useEffect(() => {
    if (!open) return;

    try {
      const savedReaction = localStorage.getItem(`${storageKey}:reaction`) as Reaction | null;
      const savedComments = localStorage.getItem(`${storageKey}:comments`);
      setReaction(savedReaction === 'like' || savedReaction === 'dislike' ? savedReaction : null);
      setComments(savedComments ? JSON.parse(savedComments) : []);
    } catch (error) {
      setReaction(null);
      setComments([]);
    }
    setCommentText('');
  }, [open, storageKey]);

  const reactionLabel = useMemo(() => {
    if (reaction === 'like') return 'Liked';
    if (reaction === 'dislike') return 'Disliked';
    return 'React to this piece';
  }, [reaction]);

  const saveReaction = (nextReaction: Reaction) => {
    setReaction(nextReaction);
    try {
      if (nextReaction) {
        localStorage.setItem(`${storageKey}:reaction`, nextReaction);
      } else {
        localStorage.removeItem(`${storageKey}:reaction`);
      }
    } catch (error) {
      // ignore
    }
  };

  const addComment = () => {
    const trimmed = commentText.trim();
    if (!trimmed) return;

    const nextComments: CommentItem[] = [
      {
        id: Date.now(),
        text: trimmed,
        createdAt: new Date().toLocaleString(),
      },
      ...comments,
    ];

    setComments(nextComments);
    setCommentText('');

    try {
      localStorage.setItem(`${storageKey}:comments`, JSON.stringify(nextComments));
    } catch (error) {
      // ignore
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-7xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#0c1119] shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4 md:px-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-[rgba(212,175,55,0.9)]">
              {kind === 'video' ? 'Video spotlight' : 'Photo spotlight'}
            </p>
            <h3 className="mt-2 text-xl font-semibold text-white md:text-2xl">{title}</h3>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-white/55">{description}</p>
            {(metaLabel || metaValue) && (
              <p className="mt-2 text-xs uppercase tracking-[0.3em] text-[rgba(212,175,55,0.9)]">
                {metaLabel}{metaLabel && metaValue ? ' • ' : ''}{metaValue}
              </p>
            )}
            {sourceLinks.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {sourceLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-[rgba(212,175,55,0.18)] bg-[rgba(212,175,55,0.08)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[rgba(212,175,55,0.95)] transition hover:bg-[rgba(212,175,55,0.14)]"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white/80 transition hover:bg-white/10"
            aria-label="Close media viewer"
          >
            <FaTimes />
          </button>
        </div>

        <div className="grid gap-0 lg:grid-cols-[1.12fr_0.88fr]">
          <div className="border-b border-white/10 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.08),transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] p-4 md:p-6 lg:border-b-0 lg:border-r lg:border-white/10">
            <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-black shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
              <div className="relative aspect-[16/10] w-full bg-black md:aspect-[16/9] xl:aspect-[17/10]">
                {kind === 'photo' ? (
                  <Image
                    src={src}
                    alt={title}
                    fill
                    sizes="(min-width: 1280px) 60vw, (min-width: 1024px) 62vw, 100vw"
                    className="object-contain p-3 md:p-5"
                    priority
                  />
                ) : (
                  <video
                    controls
                    autoPlay
                    playsInline
                    poster={poster || getGalleryPosterWebp(src, 'large')}
                    className="h-full w-full object-contain p-3 md:p-5"
                  >
                    <source src={src} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            </div>
          </div>

          <div ref={rightColRef} className="space-y-4 overflow-y-auto p-5 md:p-6 lg:max-h-[82vh]">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_10px_28px_rgba(0,0,0,0.14)]">
              <p className="text-xs uppercase tracking-[0.3em] text-white/40">Reaction</p>
              <p className="mt-2 text-lg font-medium text-white">{reactionLabel}</p>
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => saveReaction('like')}
                  className={`inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border px-4 py-3 font-semibold transition ${reaction === 'like' ? 'border-[rgba(212,175,55,0.35)] bg-[rgba(212,175,55,0.15)] text-[rgba(212,175,55,0.98)]' : 'border-white/10 bg-white/5 text-white/80 hover:bg-white/10'}`}
                >
                  <FaThumbsUp /> Like
                </button>
                <button
                  onClick={() => saveReaction('dislike')}
                  className={`inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border px-4 py-3 font-semibold transition ${reaction === 'dislike' ? 'border-[rgba(255,107,53,0.4)] bg-[rgba(255,107,53,0.14)] text-[#ff9b72]' : 'border-white/10 bg-white/5 text-white/80 hover:bg-white/10'}`}
                >
                  <FaThumbsDown /> Dislike
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_10px_28px_rgba(0,0,0,0.14)]">
              <p className="text-xs uppercase tracking-[0.3em] text-white/40">Comment</p>
              <textarea
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                rows={4}
                placeholder="Write a comment about this photo or video..."
                className="mt-3 w-full rounded-2xl border border-white/10 bg-[#090d14] px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-[rgba(212,175,55,0.35)]"
              />
              <button
                onClick={addComment}
                className="mt-3 inline-flex items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#d4af37,#f1d36f)] px-4 py-3 font-semibold text-[#111] transition hover:opacity-95"
              >
                Post Comment
              </button>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_10px_28px_rgba(0,0,0,0.14)]">
              <p className="text-xs uppercase tracking-[0.3em] text-white/40">Comments</p>
              <div className="mt-3 max-h-[260px] space-y-3 overflow-y-auto pr-1">
                {comments.length === 0 ? (
                  <p className="text-sm text-white/45">No comments yet. Be the first to leave one.</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="rounded-xl border border-white/10 bg-black/20 p-3">
                      <p className="text-sm text-white/85">{comment.text}</p>
                      <p className="mt-2 text-[11px] uppercase tracking-[0.25em] text-white/35">{comment.createdAt}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/65 shadow-[0_10px_28px_rgba(0,0,0,0.14)]">
              Fully view the media here, then leave feedback directly on the item.
            </div>

            {filteredSuggestions.length > 0 && (
              <div className="space-y-4 rounded-2xl border border-[rgba(212,175,55,0.18)] bg-[rgba(212,175,55,0.06)] p-4 shadow-[0_10px_28px_rgba(0,0,0,0.14)]">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[rgba(212,175,55,0.95)]">
                    {kind === 'video' ? 'Video recommendations' : 'Photo recommendations'}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/70">
                    Use the arrows or the scrollbar to browse more work from the same section.
                  </p>
                </div>

                <SuggestionRail items={filteredSuggestions} railKind={kind} onSelectSuggestion={onSelectSuggestion} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaDetailModal;

