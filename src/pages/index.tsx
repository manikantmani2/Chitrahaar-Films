import { useState } from 'react';
import PageHead from 'next/head';
import Logo from '@/components/Logo';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const [videoFailed, setVideoFailed] = useState(false);

  return (
    <>
      <PageHead>
        <title>Chitrahaar Films</title>
        <meta
          name="description"
          content="Chitrahaar Films intro landing page with a local cinematic opener and premium branding."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Chitrahaar Films" />
        <meta property="og:description" content="Intro landing page for Chitrahaar Films" />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/chitrahaar-logo.png" type="image/svg+xml" />
        <link rel="icon" href="/favicon-32.png" sizes="32x32" />
        <link rel="icon" href="/favicon-16.png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/favicon-180.png" />
        <link rel="alternate icon" href="/favicon.png" />
      </PageHead>

      <main className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at top, rgba(var(--color-accent-rgb), 0.16), transparent 30%), radial-gradient(circle at bottom right, rgba(255,255,255,0.06), transparent 28%), linear-gradient(180deg, var(--color-primary) 0%, var(--color-secondary) 100%)' }} />
        <div className="absolute inset-0 opacity-30" style={{ background: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '84px 84px' }} />

        <section className="relative z-10 flex min-h-screen items-center justify-center px-6 py-16">
          <div className="grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="mb-8 flex items-center gap-4"
              >
                <div>
                  <Logo size={64} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.45em] text-[rgba(212,175,55,0.95)]">
                    Chitrahaar Films
                  </p>
                    <p className="mt-1 text-sm text-white/60">Har Nazariya Ek Kahaani</p>
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="font-display text-4xl leading-none tracking-tight text-white sm:text-5xl lg:text-6xl"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                Welcome to Chitrahaar Films
                  <span className="block mt-2 text-sm sm:text-base font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#24d0c2] via-[#1aa7ff] to-[#6b7bff]" style={{ fontFamily: 'Montserrat, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif' }}>Cinematic excellence, first frame to final cut.</span>
              </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="mt-6 max-w-xl text-sm sm:text-base leading-relaxed text-white/75"
                  style={{ fontFamily: 'Montserrat, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif' }}
                >
                  At Chitrahaar Films, we don’t just record moments — we turn emotions, celebrations, and stories into timeless cinematic experiences that live forever.
                </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="mt-10 flex flex-col gap-4 sm:flex-row"
              >
                <Link
                  href="/studio"
                  className="inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,#d4af37,#f1d36f)] px-8 py-4 text-base font-semibold text-[#111] shadow-[0_16px_40px_rgba(212,175,55,0.24)] transition-transform duration-300 hover:-translate-y-0.5"
                >
                  Enter Studio
                </Link>
                <a
                  href="#intro-video"
                  className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/5 px-8 py-4 text-base font-semibold text-white/90 backdrop-blur-sm transition-colors duration-300 hover:bg-white/10"
                >
                  Watch Intro
                </a>
              </motion.div>
            </div>

            <motion.div
              id="intro-video"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -inset-4 rounded-[2rem] bg-[radial-gradient(circle,rgba(212,175,55,0.2),transparent_70%)] blur-2xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/40 shadow-[0_30px_80px_rgba(0,0,0,0.55)] backdrop-blur-sm">
                <div className="aspect-[16/9] md:aspect-[16/9]">
                  {videoFailed ? (
                    <Image
                      src="/gallery/hero1.svg"
                      alt="Chitrahaar Films intro still"
                      fill
                      priority
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                    />
                  ) : (
                    <video
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      poster="/gallery/hero1.svg"
                      className="h-full w-full object-cover"
                      onError={() => setVideoFailed(true)}
                    >
                      <source src="/videos/intro.mp4" type="video/mp4" />
                    </video>
                  )}
                </div>
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.05),rgba(0,0,0,0.55))]" />
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <div className="flex items-end justify-between gap-6">
                    <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-[rgba(212,175,55,0.95)]">Local intro video</p>
                      <p className="mt-2 max-w-xs text-sm leading-6 text-white/75">
                          A self-hosted cinematic opener before the full experience loads.
                      </p>
                    </div>
                    <div className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-xs uppercase tracking-[0.35em] text-white/70 backdrop-blur-sm">
                      00:05
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}


