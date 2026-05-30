import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaPlay } from 'react-icons/fa';
import { slideUpVariants, slideLeftVariants, slideRightVariants } from '@/utils/animations';
import { getGalleryThumbAvif, getGalleryThumbWebp } from '@/utils/imagePaths';
import Button from './Button';
import BackgroundShowcase from './BackgroundShowcase';

interface HeroProps {
  title: string;
  subtitle: string;
  description: string;
  cta1?: { text: string; onClick?: () => void };
  cta2?: { text: string; onClick?: () => void };
  backgroundImage?: string;
  hasVideo?: boolean;
  hideForegroundContent?: boolean;
}

const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  description,
  cta1,
  cta2,
  backgroundImage,
  hasVideo = false,
  hideForegroundContent = false,
}) => {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const introTimer = window.setTimeout(() => {
      setShowIntro(false);
    }, 5000);

    try {
      const raw = localStorage.getItem('bg-audio-muted');
      const mutedPref = raw ? JSON.parse(raw) : true;
      const btn = document.getElementById('bg-audio-toggle');
      if (btn) btn.textContent = mutedPref ? '\u{1F507}' : '\u{1F50A}';
      const vids = Array.from(document.querySelectorAll('video.bg-showcase-video')) as HTMLVideoElement[];
      vids.forEach((v) => (v.muted = mutedPref));
    } catch (e) {
      // ignore
    }

    return () => {
      window.clearTimeout(introTimer);
    };
  }, []);

  return (
    <section
      className="relative min-h-[80vh] md:min-h-screen flex items-center justify-center overflow-hidden pt-[var(--site-header-height)]"
      id="home"
      style={{ transition: 'padding-top 220ms ease' }}
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div
          data-hero-intro
          className={`absolute inset-0 transition-opacity duration-1000 ${showIntro ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          <div className="relative h-full w-full">
            <picture className="relative block h-full w-full">
              <source srcSet={backgroundImage ? getGalleryThumbAvif(backgroundImage, 'large') : getGalleryThumbAvif('/our-works-gallery/Artist/Worldclass-379.jpg', 'large')} type="image/avif" />
              <source srcSet={backgroundImage ? getGalleryThumbWebp(backgroundImage, 'large') : getGalleryThumbWebp('/our-works-gallery/Artist/Worldclass-379.jpg', 'large')} type="image/webp" />
              <Image
                src={backgroundImage || '/our-works-gallery/Artist/Worldclass-379.jpg'}
                alt="Hero Background"
                fill
                sizes="100vw"
                className="object-cover opacity-90"
                priority
              />
            </picture>
          </div>
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div
          data-hero-showcase
          className={`absolute inset-0 transition-opacity duration-1000 ${showIntro ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
          <BackgroundShowcase items={undefined} />
        </div>

        <div className="absolute inset-0 hero-overlay"></div>
        {backgroundImage && (
          <Image
            src={backgroundImage}
            alt="Hero Background"
            fill
            priority
            sizes="100vw"
            className="w-full h-full object-cover opacity-30"
          />
        )}

        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      {/* Content */}
      {!hideForegroundContent && (
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.2 },
              },
            }}
          >
            {subtitle && (
              <motion.div
                className="mb-6 inline-block"
                variants={slideUpVariants}
                custom={0}
              >
                <span className="text-[rgba(212,175,55,0.95)] font-medium text-sm tracking-widest uppercase">
                  {subtitle}
                </span>
              </motion.div>
            )}

            <motion.h1
              className="text-display-large md:text-6xl font-display mb-6 leading-tight tracking-wide"
              variants={slideUpVariants}
              custom={0.1}
            >
              <span style={{ fontFamily: 'Playfair Display, serif' }}>{title}</span>
            </motion.h1>

            <motion.p
              className="text-text-secondary text-body-large mb-8 max-w-lg leading-relaxed opacity-90"
              variants={slideUpVariants}
              custom={0.2}
            >
              {description}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-wrap gap-4"
              variants={slideUpVariants}
              custom={0.3}
            >
              {cta1 && (
                <Button variant="primary" size="lg" className="btn-primary" onClick={cta1.onClick}>
                  {cta1.text}
                </Button>
              )}
              {cta2 && (
                <Button variant="secondary" size="lg" className="btn-secondary" onClick={cta2.onClick}>
                  {cta2.text}
                </Button>
              )}
            </motion.div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            className="relative hidden md:block"
            initial="hidden"
            animate="visible"
            variants={slideRightVariants}
            custom={0.4}
          >
            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border glass-effect group glow-effect-lg">
              {hasVideo && !showIntro ? (
                <>
                  <video
                    src="https://videos.pexels.com/video-files/4476151/4476151-sd_640_360_30fps.mp4"
                    autoPlay
                    muted
                    loop
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-center justify-center group-hover:from-black/60 transition-all duration-300">
                    <motion.button
                      className="w-16 h-16 rounded-full bg-accent flex items-center justify-center text-primary text-2xl group-hover:scale-110 transition-transform duration-300"
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaPlay className="ml-1" />
                    </motion.button>
                  </div>
                </>
              ) : (
                <picture className="relative block h-full w-full">
                  <source srcSet="/our-works-gallery/thumbs/Corporate_and_Events_Worldclass-174.avif" type="image/avif" />
                  <source srcSet="/our-works-gallery/thumbs/Corporate_and_Events_Worldclass-174.webp" type="image/webp" />
                  <Image
                    src="/our-works-gallery/Corporate & Events/Worldclass-174.jpg"
                    alt="Hero Visual"
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="w-full h-full object-cover"
                  />
                </picture>
              )}
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 border border-accent rounded-full opacity-20"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 border border-gold rounded-full opacity-10"></div>
          </motion.div>
        </div>
      </div>
      )}

      {/* Sound toggle for background videos */}
      <div className="absolute top-6 right-6 z-30">
        <button
          aria-label="Toggle background audio"
          id="bg-audio-toggle"
          className="w-10 h-10 rounded-full bg-secondary/70 backdrop-blur-sm flex items-center justify-center text-text-primary border border-border"
          onClick={() => {
            try {
              const raw = localStorage.getItem('bg-audio-muted');
              const currentlyMuted = raw ? JSON.parse(raw) : true;
              const newMuted = !currentlyMuted;
              localStorage.setItem('bg-audio-muted', JSON.stringify(newMuted));
              const vids = Array.from(document.querySelectorAll('video.bg-showcase-video')) as HTMLVideoElement[];
              vids.forEach((v) => (v.muted = newMuted));
              const btn = document.getElementById('bg-audio-toggle');
              if (btn) btn.textContent = newMuted ? '\u{1F507}' : '\u{1F50A}';
            } catch (e) {
              // ignore
            }
          }}
        >
          🔇
        </button>
      </div>

      

      {/* Scroll indicator */}
      {!hideForegroundContent && (
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="flex flex-col items-center gap-2 text-accent">
            <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </motion.div>
      )}
    </section>
  );
};

export default Hero;

