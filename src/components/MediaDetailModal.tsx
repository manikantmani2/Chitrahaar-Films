import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaThumbsUp, FaThumbsDown, FaTimes } from 'react-icons/fa';

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
  suggestions?: Array<{
    id: number;
    title: string;
    description: string;
    mediaType: MediaKind;
    thumb: string;
    duration?: string;
  }>;
  onSelectSuggestion?: (suggestionId: number) => void;
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
  storageKey,
  onClose,
}) => {
  const [reaction, setReaction] = useState<Reaction>(null);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<CommentItem[]>([]);
  const rightColRef = React.useRef<HTMLDivElement | null>(null);
  const [suggestionCardWidth, setSuggestionCardWidth] = useState<number | null>(null);

  const { photoSuggestions, videoSuggestions } = useMemo(() => {
    return suggestions.reduce(
      (result, suggestion) => {
        result[`${suggestion.mediaType}Suggestions`].push(suggestion);
        return result;
      },
      {
        photoSuggestions: [] as NonNullable<MediaDetailModalProps['suggestions']>,
        videoSuggestions: [] as NonNullable<MediaDetailModalProps['suggestions']>,
      },
    );
  }, [suggestions]);

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

  // compute suggestion card width so each suggestion fits a single frame
  useEffect(() => {
    const el = rightColRef.current;
    if (!el) return;

    const compute = () => {
      const w = el.clientWidth;
      let ratio = 0.9;
      if (w >= 1280) ratio = 0.42; // two-column layout, suggestion rail sits inside right column
      else if (w >= 1024) ratio = 0.48;
      else if (w >= 768) ratio = 0.72;
      else ratio = 0.9;
      setSuggestionCardWidth(Math.max(220, Math.floor(w * ratio)));
    };

    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, [open, suggestions.length]);

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

  const renderSuggestionRail = (
    items: NonNullable<MediaDetailModalProps['suggestions']>,
    railKind: MediaKind,
  ) => {
    if (items.length === 0) return null;

    return (
      <div className="rounded-3xl border border-[rgba(212,175,55,0.14)] bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-4 shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-[rgba(212,175,55,0.95)]">
              Recommended {railKind === 'video' ? 'videos' : 'photos'}
            </p>
            <p className="mt-2 text-sm text-white/65">
              Drag sideways to browse the full set of suggestions.
            </p>
          </div>
          <div className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-white/45">
            Drag
          </div>
        </div>

        <motion.div
          className="flex gap-4 overflow-x-auto pb-2 pr-2 scrollbar-hide snap-carousel cursor-grab active:cursor-grabbing"
          variants={suggestionRailVariants}
          initial="hidden"
          animate="visible"
          drag="x"
          dragConstraints={{ left: -20, right: 20 }}
          dragElastic={0.08}
          whileTap={{ cursor: 'grabbing' }}
        >
          {items.map((suggestion, index) => (
            <motion.button
              key={`${suggestion.id}-${index}`}
              type="button"
              onClick={() => onSelectSuggestion?.(suggestion.id)}
              className="group snap-item overflow-hidden rounded-2xl border border-white/10 bg-[#0c1119] text-left transition hover:-translate-y-1 hover:border-[rgba(212,175,55,0.28)] hover:shadow-[0_16px_45px_rgba(0,0,0,0.25)]"
              variants={suggestionCardVariants}
              whileHover={{ y: -4 }}
              style={suggestionCardWidth ? { width: suggestionCardWidth } : undefined}
            >
              <div className="relative w-full overflow-hidden bg-black" style={suggestionCardWidth ? { height: Math.floor(suggestionCardWidth * 9 / 16) } : undefined}>
                <Image
                  src={suggestion.thumb}
                  alt={suggestion.title}
                  fill
                  sizes="280px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
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
          ))}
        </motion.div>
      </div>
    );
  };

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

        <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="relative min-h-[320px] bg-black md:min-h-[520px]">
            {kind === 'photo' ? (
              <Image src={src} alt={title} fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-contain" priority />
            ) : (
              <video controls autoPlay playsInline poster={poster} className="h-full w-full bg-black object-contain">
                <source src={src} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>

          <div ref={rightColRef} className="space-y-4 overflow-y-auto p-5 md:p-6 lg:max-h-[78vh]">
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

            {suggestions.length > 0 && (
              <div className="space-y-4 rounded-2xl border border-[rgba(212,175,55,0.18)] bg-[rgba(212,175,55,0.06)] p-4 shadow-[0_10px_28px_rgba(0,0,0,0.14)]">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[rgba(212,175,55,0.95)]">
                    Recommendations
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/70">
                    Drag through the curated photo and video picks to explore more related work.
                  </p>
                </div>

                {renderSuggestionRail(photoSuggestions, 'photo')}
                {renderSuggestionRail(videoSuggestions, 'video')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaDetailModal;

