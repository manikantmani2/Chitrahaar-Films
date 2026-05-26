import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import type { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { signIn, signOut } from 'next-auth/react';
import { HiOutlineChartBar, HiOutlineShieldCheck, HiOutlineInboxArrowDown } from 'react-icons/hi2';
import { FiSearch, FiDownload, FiTrash2, FiLogOut, FiRefreshCw } from 'react-icons/fi';
import { authOptions } from '@/lib/nextAuth';
import { isAdminSessionValidFromCookieHeader } from '@/lib/adminAuth';

type FeedbackItem = {
  id: string;
  name: string;
  email: string;
  rating?: number | null;
  eventType?: string | null;
  message: string;
  createdAt: string;
};

type FeedbackMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  averageRating: number;
  recentCount: number;
  latestSubmission: string | null;
  recentItems: FeedbackItem[];
};

type ToastState = {
  type: 'success' | 'error' | 'info';
  message: string;
} | null;

type AdminFeedbackProps = {
  initialAuthenticated: boolean;
};

export const getServerSideProps: GetServerSideProps<AdminFeedbackProps> = async ({ req, res }) => {
  const session = await getServerSession(req, res, authOptions);
  return {
    props: {
      initialAuthenticated: Boolean(session?.user?.email) || isAdminSessionValidFromCookieHeader(req.headers.cookie),
    },
  };
};

export default function AdminFeedback({ initialAuthenticated }: AdminFeedbackProps) {
  const [authenticated, setAuthenticated] = useState(initialAuthenticated);
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [meta, setMeta] = useState<FeedbackMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>(null);

  const showToast = useCallback((type: NonNullable<ToastState>['type'], message: string) => {
    setToast({ type, message });
    window.setTimeout(() => setToast(null), 2600);
  }, []);

  const loadFeedback = useCallback(async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams({ page: String(page), limit: '5' });
      if (query.trim()) {
        params.set('query', query.trim());
      }

      const response = await fetch(`/api/feedback?${params.toString()}`);
      if (response.status === 401) {
        setAuthenticated(false);
        setItems([]);
        setMeta(null);
        return;
      }

      const data = await response.json();
      if (data.success && Array.isArray(data.items)) {
        setItems(data.items as FeedbackItem[]);
        setMeta((data.meta as FeedbackMeta) || null);
        setAuthenticated(true);
      }
    } finally {
      setLoading(false);
    }
  }, [page, query]);

  useEffect(() => {
    if (!authenticated) {
      return;
    }

    const timeout = window.setTimeout(() => {
      void loadFeedback();
    }, 150);

    return () => window.clearTimeout(timeout);
  }, [authenticated, loadFeedback]);

  const summaryCards = useMemo(() => {
    return [
      {
        label: 'Total feedback',
        value: meta?.total ?? 0,
        icon: HiOutlineInboxArrowDown,
        tone: 'from-orange-500/20 to-amber-500/10',
      },
      {
        label: 'Average rating',
        value: meta ? meta.averageRating.toFixed(1) : '0.0',
        icon: HiOutlineChartBar,
        tone: 'from-emerald-500/20 to-teal-500/10',
      },
      {
        label: 'This week',
        value: meta?.recentCount ?? 0,
        icon: HiOutlineShieldCheck,
        tone: 'from-sky-500/20 to-cyan-500/10',
      },
      {
        label: 'Latest submission',
        value: meta?.latestSubmission ? new Date(meta.latestSubmission).toLocaleDateString() : 'None yet',
        icon: HiOutlineInboxArrowDown,
        tone: 'from-white/10 to-white/5',
      },
    ];
  }, [meta]);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Delete this feedback entry?');
    if (!confirmed) return;

    setDeletingId(id);
    try {
      const response = await fetch(`/api/feedback?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Delete failed');
      }

      showToast('success', 'Feedback deleted');
      await loadFeedback();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete feedback';
      showToast('error', message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleExport = async () => {
    try {
      const params = new URLSearchParams({ export: 'csv' });
      if (query.trim()) {
        params.set('query', query.trim());
      }

      const response = await fetch(`/api/feedback?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'feedback.csv';
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(url);
      showToast('success', 'CSV export started');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to export feedback';
      showToast('error', message);
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    await fetch('/api/admin/logout', { method: 'POST' });
    setAuthenticated(false);
    setItems([]);
    setMeta(null);
    showToast('info', 'Admin session locked');
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#070b12] text-white">
        <Head>
          <title>Admin — Feedback</title>
        </Head>

        <div className="min-h-screen grid lg:grid-cols-[1.1fr_0.9fr]">
          <aside className="relative overflow-hidden border-b lg:border-b-0 lg:border-r border-white/10 px-6 py-10 lg:px-12 lg:py-16 bg-gradient-to-br from-black via-[#111827] to-[#1f130f]">
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.35),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.18),transparent_28%)]" />
            <div className="relative max-w-xl space-y-8">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur">
                <span className="h-2.5 w-2.5 rounded-full bg-accent" />
                Chitrahaar Films Admin
              </div>
              <div>
                <h1 className="text-4xl md:text-6xl font-semibold leading-tight">Feedback Command Center</h1>
                <p className="mt-4 max-w-xl text-base md:text-lg text-white/70">
                  Use Google OAuth to unlock the feedback dashboard. You can still keep the legacy password session as a fallback while OAuth is configured.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  ['Secure login', 'Google OAuth + allowlisted admin email'],
                  ['Faster review', 'Paginated feedback with live search'],
                  ['Cleaner ops', 'Export and delete from one place'],
                ].map(([title, text]) => (
                  <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                    <p className="font-medium">{title}</p>
                    <p className="mt-2 text-sm text-white/65">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <main className="flex items-center justify-center px-6 py-10 lg:px-12">
            <div className="w-full max-w-lg space-y-6">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-7 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-2xl bg-accent/15 border border-accent/20 flex items-center justify-center text-accent">
                    <HiOutlineShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold">Sign in</h2>
                    <p className="text-sm text-white/60">Authenticate to access feedback controls.</p>
                  </div>
                </div>

                <button
                  onClick={() => void signIn('google', { callbackUrl: '/admin/feedback' })}
                  className="w-full rounded-2xl bg-white text-black font-semibold py-3.5 hover:opacity-95 transition flex items-center justify-center gap-3"
                >
                  Continue with Google OAuth
                </button>

                <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-white/35">
                  <span className="h-px flex-1 bg-white/10" />
                  or
                  <span className="h-px flex-1 bg-white/10" />
                </div>

                <LegacyPasswordLogin onAuthed={() => setAuthenticated(true)} />
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b12] text-white">
      <Head>
        <title>Admin — Feedback</title>
      </Head>

      <div className="mx-auto max-w-[1600px] px-4 py-4 md:px-6 md:py-6">
        <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
          <aside className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-2xl xl:sticky xl:top-6 xl:h-[calc(100vh-3rem)]">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-accent to-orange-500 flex items-center justify-center font-semibold text-black">
                CF
              </div>
              <div>
                <p className="text-lg font-semibold leading-none">Chitrahaar</p>
                <p className="text-sm text-white/55">Feedback Admin</p>
              </div>
            </div>

            <nav className="mt-8 space-y-3">
              {[
                ['Overview', 'Dashboard summary and latest trends'],
                ['Submissions', 'Search, page, and manage feedback'],
                ['Export', 'Download CSV for reporting'],
              ].map(([title, text]) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  <p className="font-medium">{title}</p>
                  <p className="mt-1 text-sm text-white/60">{text}</p>
                </div>
              ))}
            </nav>

            <div className="mt-8 space-y-3">
              <button onClick={handleExport} className="w-full rounded-2xl bg-accent text-black font-semibold py-3 flex items-center justify-center gap-2 hover:opacity-90 transition">
                <FiDownload /> Export CSV
              </button>
              <button onClick={handleLogout} className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 font-semibold flex items-center justify-center gap-2 hover:bg-white/10 transition">
                <FiLogOut /> Lock session
              </button>
            </div>
          </aside>

          <main className="space-y-6">
            <header className="rounded-3xl border border-white/10 bg-white/5 p-5 md:p-6 backdrop-blur-xl shadow-2xl">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-white/40">Feedback dashboard</p>
                  <h1 className="mt-2 text-3xl md:text-4xl font-semibold">All submissions in one place</h1>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/70">
                  <FiRefreshCw className="shrink-0" />
                  Auto-refreshes on page or search changes
                </div>
              </div>
            </header>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {summaryCards.map((card) => {
                const Icon = card.icon;
                return (
                  <article
                    key={card.label}
                    className={`rounded-3xl border border-white/10 bg-gradient-to-br ${card.tone} p-5 shadow-xl backdrop-blur-xl`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm text-white/60">{card.label}</p>
                        <p className="mt-2 text-3xl font-semibold">{card.value}</p>
                      </div>
                      <div className="h-11 w-11 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center text-white/80">
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/5 p-5 md:p-6 backdrop-blur-xl shadow-2xl">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Submissions</h2>
                  <p className="text-sm text-white/55">Server-side search and pagination.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                  <label className="relative flex-1 min-w-[280px]">
                    <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/35" />
                    <input
                      value={query}
                      onChange={(event) => {
                        setPage(1);
                        setQuery(event.target.value);
                      }}
                      placeholder="Search name, email, event type, or message"
                      className="w-full rounded-2xl border border-white/10 bg-black/25 py-3 pl-11 pr-4 outline-none placeholder:text-white/30 focus:border-accent"
                    />
                  </label>
                  <button onClick={() => void loadFeedback()} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-medium hover:bg-white/10 transition">
                    Refresh
                  </button>
                </div>
              </div>

              {loading && <p className="mt-4 text-sm text-white/45">Loading…</p>}

              <div className="mt-5 grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
                <div className="space-y-4">
                  {!loading && items.length === 0 && (
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-white/45">No feedback found.</div>
                  )}

                  {items.map((item) => (
                    <article key={item.id} className="rounded-2xl border border-white/10 bg-black/20 p-5">
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">
                            {item.name} <span className="text-sm text-white/45">({item.email})</span>
                          </h3>
                          <p className="mt-1 text-sm text-white/45">
                            {item.eventType || 'General'} {item.rating ? `• ${item.rating}★` : '• No rating'}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-white/40">
                          <span>{new Date(item.createdAt).toLocaleString()}</span>
                          <button
                            onClick={() => void handleDelete(item.id)}
                            disabled={deletingId === item.id}
                            className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-red-200 hover:bg-red-500/20 transition disabled:opacity-50"
                          >
                            <FiTrash2 /> {deletingId === item.id ? 'Deleting…' : 'Delete'}
                          </button>
                        </div>
                      </div>

                      <p className="mt-4 whitespace-pre-wrap leading-relaxed text-white/80">{item.message}</p>
                    </article>
                  ))}

                  <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                    <p className="text-sm text-white/55">
                      Page {meta?.page ?? page} of {meta?.totalPages ?? 1}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPage((current) => Math.max(1, current - 1))}
                        disabled={(meta?.page ?? page) <= 1}
                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 transition disabled:opacity-40"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setPage((current) => Math.min(meta?.totalPages ?? current + 1, current + 1))}
                        disabled={(meta?.page ?? page) >= (meta?.totalPages ?? 1)}
                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 transition disabled:opacity-40"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>

                <aside className="rounded-3xl border border-white/10 bg-black/20 p-5">
                  <h3 className="text-lg font-semibold">Recent submissions</h3>
                  <div className="mt-4 space-y-3">
                    {(meta?.recentItems ?? []).map((item) => (
                      <div key={item.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-xs text-white/45">{item.eventType || 'General'}</p>
                          </div>
                          <span className="text-xs text-white/35">{new Date(item.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="mt-3 text-sm text-white/70 line-clamp-4">{item.message}</p>
                      </div>
                    ))}

                    {(meta?.recentItems?.length ?? 0) === 0 && <p className="text-sm text-white/45">No recent submissions yet.</p>}
                  </div>
                </aside>
              </div>
            </section>
          </main>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 px-4">
          <div
            className={`rounded-full px-4 py-3 shadow-xl border text-sm backdrop-blur ${
              toast.type === 'success'
                ? 'bg-emerald-500/15 border-emerald-400/30 text-emerald-200'
                : toast.type === 'error'
                  ? 'bg-red-500/15 border-red-400/30 text-red-200'
                  : 'bg-white/10 border-white/20 text-white'
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}

function LegacyPasswordLogin({ onAuthed }: { onAuthed: () => void }) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLegacyLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Login failed');
      }

      onAuthed();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLegacyLogin} className="space-y-4 rounded-2xl border border-white/10 bg-black/20 p-5">
      <div>
        <p className="font-medium">Legacy password fallback</p>
        <p className="text-sm text-white/50">Use this only if OAuth is not configured yet.</p>
      </div>
      <input
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Admin password"
        className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 outline-none placeholder:text-white/30 focus:border-accent"
      />
      {error && <p className="text-sm text-red-300">{error}</p>}
      <button type="submit" className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 font-medium hover:bg-white/15 transition">
        {loading ? 'Unlocking…' : 'Unlock legacy session'}
      </button>
    </form>
  );
}
