import React, { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaThumbsUp, FaThumbsDown, FaTimes } from 'react-icons/fa';
import {
  getGalleryPosterWebp,
  getGalleryThumbAvif,
  getGalleryThumbWebp,
} from '@/utils/imagePaths';
import VideoPlayer from './VideoPlayer';

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
  storageKey: string;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

type Reaction = 'like' | 'dislike' | null;
interface CommentItem {
  id: number;
  text: string;
  createdAt: string;
}

// Recommendation UI removed — rail/variants/components formerly used for
// rendering related picks have been deleted to disable recommendations site-wide.

const parseDurationSeconds = (duration?: string) => {
  if (!duration) return null;

  const parts = duration.split(':').map(Number).reverse();
  let seconds = 0;
  if (parts.length >= 1) seconds += parts[0];
  if (parts.length >= 2) seconds += parts[1] * 60;
  if (parts.length >= 3) seconds += parts[2] * 3600;
  return seconds;
};

// Suggestion rail removed

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
  storageKey,
  onClose,
  onPrev,
  onNext,
}) => {
  const [reaction, setReaction] = useState<Reaction>(null);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<CommentItem[]>([]);
  const rightColRef = React.useRef<HTMLDivElement | null>(null);
  const navEnabled = Boolean(onPrev || onNext);

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

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (!open) return;
      if (event.key === 'ArrowLeft' && onPrev) {
        event.preventDefault();
        onPrev();
      }
      if (event.key === 'ArrowRight' && onNext) {
        event.preventDefault();
        onNext();
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onPrev, onNext, onClose]);

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
                {navEnabled && onPrev && (
                  <div className="absolute inset-y-0 left-0 z-20 flex w-20 items-center justify-center bg-black/20 p-3">
                    <button
                      onClick={onPrev}
                      aria-label="Previous media"
                      className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/70 text-white transition hover:bg-black/90"
                    >
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                  </div>
                )}
                {navEnabled && onNext && (
                  <div className="absolute inset-y-0 right-0 z-20 flex w-20 items-center justify-center bg-black/20 p-3">
                    <button
                      onClick={onNext}
                      aria-label="Next media"
                      className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/70 text-white transition hover:bg-black/90"
                    >
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
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
                  <VideoPlayer
                    src={src}
                    poster={poster || getGalleryPosterWebp(src, 'large')}
                    controls
                    autoPlay
                    playsInline
                    className="h-full w-full object-contain p-3 md:p-5"
                  />
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

            {/* Recommendations removed */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaDetailModal;

