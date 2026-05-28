import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Logo from './Logo';
import Button from './Button';
import { NAV_LINKS } from '@/constants';
import { useScrollPosition, useIsMobile } from '@/hooks';
import { FaBars, FaTimes } from 'react-icons/fa';

type ThemeMode = 'dark' | 'light';

const THEME_STORAGE_KEY = 'chitrahaar-theme';

const getInitialTheme = (): ThemeMode => {
  if (typeof window === 'undefined') {
    return 'dark';
  }

  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme === 'dark' || savedTheme === 'light') {
    return savedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
};

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const scrollPosition = useScrollPosition();
  const isMobile = useIsMobile();

  useEffect(() => {
    setIsScrolled(scrollPosition > 50);
  }, [scrollPosition]);

  useEffect(() => {
    setTheme(getInitialTheme());
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const headerClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    isScrolled ? 'bg-[rgba(11,11,11,0.75)] backdrop-blur-lg border-b border-transparent shadow-lg' : 'sticky-navbar'
  }`;

  const navVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5 },
    }),
  };  const themeText = theme === 'dark' ? 'Dark' : 'Light';
  const themeLabel = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <header className={headerClasses}>
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
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-accent to-gold group-hover:w-full transition-all duration-300"></span>
                </motion.a>
              ))}

              {/* Desktop CTA removed per user request */}
            </nav>
          )}

          {isMobile && (
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="ml-2 inline-flex h-11 w-11 items-center justify-center rounded-full border border-transparent bg-white/5 text-accent text-2xl"
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
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
          </motion.nav>
        )}
      </div>
    </header>
  );
};

export default Header;
