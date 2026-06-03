import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Logo from './Logo';
import { NAV_LINKS } from '@/constants';
import { useIsMobile } from '@/hooks';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useTheme } from '@/hooks/useTheme';
import ThemeToggleButton from './ThemeToggleButton';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);
  const { theme, toggleTheme } = useTheme();
  const isMobile = useIsMobile();
  const prevScrolledRef = useRef(false);
  const isTickingRef = useRef(false);

  useEffect(() => {
    const threshold = 50;

    const updateScrollState = () => {
      const scrolled = window.scrollY > threshold;
      if (scrolled !== prevScrolledRef.current) {
        prevScrolledRef.current = scrolled;
        setIsScrolled(scrolled);
      }
      isTickingRef.current = false;
    };

    const handleScroll = () => {
      if (!isTickingRef.current) {
        isTickingRef.current = true;
        window.requestAnimationFrame(updateScrollState);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateScrollState();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keep CSS variable --site-header-height in sync with actual header height.
  useEffect(() => {
    const updateHeaderHeight = () => {
      const el = headerRef.current || document.querySelector('header');
      if (!el) return;
      const h = Math.ceil((el as HTMLElement).getBoundingClientRect().height);
      document.documentElement.style.setProperty('--site-header-height', `${h}px`);
    };

    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);

    return () => {
      window.removeEventListener('resize', updateHeaderHeight);
    };
  }, []);

  // Recalculate when mobile menu toggles (height may change)
  useEffect(() => {
    const el = headerRef.current || document.querySelector('header');
    if (!el) return;
    const h = Math.ceil((el as HTMLElement).getBoundingClientRect().height);
    document.documentElement.style.setProperty('--site-header-height', `${h}px`);
  }, [isMobileMenuOpen, isScrolled]);

  const headerClasses = `fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
    isScrolled ? 'bg-[rgba(11,11,11,0.85)] border-b border-transparent shadow-lg' : 'sticky-navbar'
  }`;

  const navVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, duration: 0.3 },
    }),
  };

  return (
    <header ref={headerRef} className={headerClasses}>
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          <motion.div
            className="flex items-center gap-2 cursor-pointer group"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="flex items-center gap-2">
              <Logo size={40} />
              <div className="hidden sm:block">
                <p className="text-base font-bold text-text-primary">Chitrahaar</p>
                <p className="text-xs text-accent -mt-1">Films</p>
              </div>
            </Link>
          </motion.div>

          {!isMobile && (
            <nav className="flex items-center gap-8">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  className="text-text-secondary hover:text-accent transition-colors duration-300 relative group text-sm font-medium"
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={navVariants}
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-accent to-gold origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
                </motion.a>
              ))}

              <ThemeToggleButton theme={theme} onToggle={toggleTheme} />

              {/* Desktop CTA removed per user request */}
            </nav>
          )}

          {isMobile && (
            <div className="ml-2 flex items-center gap-2">
              <ThemeToggleButton theme={theme} onToggle={toggleTheme} compact />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-transparent bg-white/5 text-accent text-2xl"
              >
                {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          )}
        </div>

        {isMobile && isMobileMenuOpen && (
          <motion.nav
            className="flex flex-col gap-4 mt-6 pt-6 border-t border-border"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-text-secondary hover:text-accent transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}

            <ThemeToggleButton theme={theme} onToggle={toggleTheme} className="w-full justify-center" />
          </motion.nav>
        )}
      </div>
    </header>
  );
};

export default React.memo(Header);
