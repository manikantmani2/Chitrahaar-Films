import React from 'react';
import Head from 'next/head';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import { scrollToSection } from '@/utils/helpers';
import MediaLibrary from '@/components/MediaLibrary';
import FeaturedFilms from '@/components/FeaturedFilms';
import Testimonials from '@/components/Testimonials';
import Stats from '@/components/Stats';
import About from '@/components/About';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Head>
        <title>Chitrahaar Films - Premium Production House</title>
        <meta
          name="description"
          content="Premium production house creating cinematic videos, documentaries, photography, and motion graphics for brands worldwide."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content="production, video, documentary, photography, animation, Mumbai" />
        <meta property="og:title" content="Chitrahaar Films - Premium Production House" />
        <meta property="og:description" content="Cinematic production services for brands and creators" />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
        {/* Preload key above-the-fold images to improve LCP */}
        <link rel="preload" as="image" href="/gallery/featured1.jpg" />
        <link rel="preload" as="image" href="/gallery/featured2.jpg" />
        <link rel="preload" as="image" href="/gallery/featured3.jpg" />
      </Head>

      <Header />

      <main>
        <Hero
          title="Cinematic Excellence"
          subtitle="Welcome to Chitrahaar Films"
          description="We create compelling visual stories that captivate audiences and drive results. From concept to final frame, we bring your vision to life with uncompromising quality."
          cta1={{ text: 'Start Your Project' }}
          cta2={{ text: 'Watch Our Work', onClick: () => scrollToSection('portfolio') }}
          hasVideo={true}
        />

      <FeaturedFilms />

      <MediaLibrary />
        {/* Services (inline) */}
        <section id="services" className="section-padding bg-primary">
          <div className="container-custom">
            <div className="mb-16 text-center">
              <h2 className="text-display-medium md:text-display-large font-display gradient-text mb-4"><span className="running-bg rounded-lg inline-block px-4 py-1">Services</span></h2>
              <p className="text-text-secondary text-body-large max-w-2xl mx-auto">What we craft for our clients</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 glass-effect hover-lift rounded-lg">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-[rgba(212,175,55,0.08)] text-gold text-2xl">🎬</div>
                  <div>
                    <h4 className="text-lg font-semibold text-text-primary">Premium Production</h4>
                    <p className="text-text-secondary mt-2">Full-service production from script to screen — cinema-grade equipment and seasoned crew.</p>
                  </div>
                </div>
              </div>

              <div className="p-6 glass-effect hover-lift rounded-lg">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-[rgba(212,175,55,0.08)] text-gold text-2xl">💍</div>
                  <div>
                    <h4 className="text-lg font-semibold text-text-primary">Wedding Films</h4>
                    <p className="text-text-secondary mt-2">Cinematic wedding films with editorial storytelling and emotional pacing.</p>
                  </div>
                </div>
              </div>

              <div className="p-6 glass-effect hover-lift rounded-lg">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-[rgba(212,175,55,0.08)] text-gold text-2xl">📹</div>
                  <div>
                    <h4 className="text-lg font-semibold text-text-primary">Branded Content</h4>
                    <p className="text-text-secondary mt-2">Short films, ads, and social content optimized for storytelling and conversions.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      <Stats />

      <Testimonials />

      <About />

      <Contact />
      </main>

      <Footer />
    </>
  );
}

