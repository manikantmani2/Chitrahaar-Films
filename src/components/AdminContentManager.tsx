import React, { useEffect, useState } from 'react';
import type { FeaturedContentItem, PortfolioContentItem, SiteContentData } from '@/types/content';

const createFeaturedItem = (): FeaturedContentItem => ({
  id: Date.now(),
  title: 'New Featured Film',
  thumb: '/gallery/featured1.jpg',
  duration: '00:00',
  video: '/videos/intro.mp4',
  visible: true,
});

const createPortfolioItem = (): PortfolioContentItem => ({
  id: Date.now(),
  title: 'New Portfolio Item',
  eventType: 'Wedding',
  mediaType: 'photo',
  thumb: '/gallery/wedding-photo.svg',
  description: 'Describe the project here.',
  duration: '',
  videoUrl: '/videos/intro.mp4',
  instagramUrl: 'https://instagram.com/chitrahaarfilms',
  youtubeUrl: 'https://youtube.com/@chitrahaarfilms',
  visible: true,
});

export default function AdminContentManager() {
  const [featured, setFeatured] = useState<FeaturedContentItem[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadContent = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/admin/content');
        if (response.status === 401) {
          setStatus('You need admin access to manage content.');
          return;
        }

        const data = (await response.json()) as SiteContentData;
        if (!cancelled) {
          setFeatured(Array.isArray(data?.featured) ? data.featured : []);
          setPortfolio(Array.isArray(data?.portfolio) ? data.portfolio : []);
        }
      } catch {
        if (!cancelled) {
          setStatus('Unable to load managed content right now.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadContent();
    return () => {
      cancelled = true;
    };
  }, []);

  const updateFeatured = (index: number, patch: Partial<FeaturedContentItem>) => {
    setFeatured((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
  };

  const updatePortfolio = (index: number, patch: Partial<PortfolioContentItem>) => {
    setPortfolio((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus(null);

    try {
      const response = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured, portfolio }),
      });

      if (!response.ok) {
        throw new Error('Failed to save content');
      }

      setStatus('Content saved and published to the live site.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-5 md:p-6 backdrop-blur-xl shadow-2xl space-y-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-white/40">Content studio</p>
          <h2 className="mt-2 text-2xl md:text-3xl font-semibold">Manage featured films and portfolio content</h2>
          <p className="mt-2 text-sm text-white/55">Change thumbnails, video URLs, project copy, and visibility from one place.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setFeatured((current) => [...current, createFeaturedItem()])}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium hover:bg-white/10 transition"
          >
            Add featured film
          </button>
          <button
            onClick={() => setPortfolio((current) => [...current, createPortfolioItem()])}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium hover:bg-white/10 transition"
          >
            Add portfolio item
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-white/45">Loading managed content…</p>
      ) : null}

      <div className="space-y-8">
        <div>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold">Featured films</h3>
            <p className="text-xs uppercase tracking-[0.3em] text-white/35">Shown on the studio hero strip</p>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            {featured.map((item, index) => (
              <article key={item.id} className="rounded-3xl border border-white/10 bg-black/20 p-5 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <strong>Featured #{index + 1}</strong>
                  <label className="flex items-center gap-2 text-sm text-white/65">
                    <input
                      type="checkbox"
                      checked={item.visible !== false}
                      onChange={(event) => updateFeatured(index, { visible: event.target.checked })}
                    />
                    Visible
                  </label>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <input value={item.title} onChange={(event) => updateFeatured(index, { title: event.target.value })} className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 outline-none" placeholder="Title" />
                  <input value={item.duration} onChange={(event) => updateFeatured(index, { duration: event.target.value })} className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 outline-none" placeholder="Duration" />
                  <input value={item.thumb} onChange={(event) => updateFeatured(index, { thumb: event.target.value })} className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 outline-none md:col-span-2" placeholder="Thumbnail path" />
                  <input value={item.video || ''} onChange={(event) => updateFeatured(index, { video: event.target.value })} className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 outline-none md:col-span-2" placeholder="Video path" />
                </div>
                <button
                  onClick={() => setFeatured((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                  className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200 hover:bg-red-500/20 transition"
                >
                  Remove featured item
                </button>
              </article>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold">Portfolio gallery</h3>
            <p className="text-xs uppercase tracking-[0.3em] text-white/35">Shown on the studio gallery strip</p>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            {portfolio.map((item, index) => (
              <article key={item.id} className="rounded-3xl border border-white/10 bg-black/20 p-5 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <strong>Portfolio #{index + 1}</strong>
                  <label className="flex items-center gap-2 text-sm text-white/65">
                    <input
                      type="checkbox"
                      checked={item.visible !== false}
                      onChange={(event) => updatePortfolio(index, { visible: event.target.checked })}
                    />
                    Visible
                  </label>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <input value={item.title} onChange={(event) => updatePortfolio(index, { title: event.target.value })} className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 outline-none md:col-span-2" placeholder="Title" />
                  <select value={item.eventType} onChange={(event) => updatePortfolio(index, { eventType: event.target.value as PortfolioContentItem['eventType'] })} className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 outline-none">
                    {['Wedding', 'Clubs', 'Events', 'Food & Beverages', 'Short Films'].map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <select value={item.mediaType} onChange={(event) => updatePortfolio(index, { mediaType: event.target.value as PortfolioContentItem['mediaType'] })} className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 outline-none">
                    <option value="photo">Photo</option>
                    <option value="video">Video</option>
                  </select>
                  <input value={item.duration || ''} onChange={(event) => updatePortfolio(index, { duration: event.target.value })} className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 outline-none" placeholder="Duration" />
                  <input value={item.thumb} onChange={(event) => updatePortfolio(index, { thumb: event.target.value })} className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 outline-none" placeholder="Thumbnail path" />
                  <input value={item.videoUrl || ''} onChange={(event) => updatePortfolio(index, { videoUrl: event.target.value })} className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 outline-none" placeholder="Video URL" />
                  <input value={item.instagramUrl} onChange={(event) => updatePortfolio(index, { instagramUrl: event.target.value })} className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 outline-none" placeholder="Instagram URL" />
                  <input value={item.youtubeUrl} onChange={(event) => updatePortfolio(index, { youtubeUrl: event.target.value })} className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 outline-none" placeholder="YouTube URL" />
                  <textarea value={item.description} onChange={(event) => updatePortfolio(index, { description: event.target.value })} className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 outline-none md:col-span-2 min-h-[110px]" placeholder="Description" />
                </div>

                <button
                  onClick={() => setPortfolio((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                  className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200 hover:bg-red-500/20 transition"
                >
                  Remove portfolio item
                </button>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between rounded-3xl border border-white/10 bg-black/20 p-5">
        <p className="text-sm text-white/55">Change visibility to publish or hold content on the live site.</p>
        <div className="flex items-center gap-3">
          {status && <span className="text-sm text-white/70">{status}</span>}
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-2xl bg-accent px-5 py-3 text-sm font-semibold text-black hover:opacity-90 transition disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save all changes'}
          </button>
        </div>
      </div>
    </section>
  );
}

