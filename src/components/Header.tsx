import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { NAV_LINKS } from '@/constants';
import { scrollToSection } from '@/utils/helpers';
import { useScrollPosition, useIsMobile } from '@/hooks';
import { FaBars, FaTimes } from 'react-icons/fa';
import Button from './Button';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const scrollPosition = useScrollPosition();
  const isMobile = useIsMobile();

  useEffect(() => {
    setIsScrolled(scrollPosition > 50);
  }, [scrollPosition]);

  const headerClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    isScrolled ? 'bg-[rgba(11,11,11,0.75)] backdrop-blur-lg border-b border-[rgba(255,255,255,0.04)] shadow-lg' : 'sticky-navbar'
  }`;

  const navVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5 },
    }),
  };

  return (
    <header className={headerClasses}>
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2 cursor-pointer group"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-10 h-10 bg-[linear-gradient(90deg,#D4AF37,#e6c66a)] rounded-lg flex items-center justify-center font-bold text-primary group-hover:shadow-lg transition-all duration-300">
              CF
            </div>
            <div>
              <p className="text-base font-bold text-text-primary">Chitrahaar</p>
              <p className="text-xs text-accent -mt-1">Films</p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="flex items-center gap-8">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    const id = link.href.replace('#', '');
                    scrollToSection(id);
                  }}
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
            </nav>
          )}

          {/* Desktop CTA */}
          {!isMobile && (
            <Button variant="primary" size="md" className="btn-primary">
              Get in Touch
            </Button>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-accent text-2xl"
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          )}
        </div>

        {/* Mobile Navigation */}
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
                onClick={(e) => {
                  e.preventDefault();
                  setIsMobileMenuOpen(false);
                  scrollToSection(link.href.replace('#', ''));
                }}
              >
                {link.name}
              </a>
            ))}
            <Button variant="primary" size="md" className="w-full mt-4">
              Get in Touch
            </Button>
          </motion.nav>
        )}
      </div>
    </header>
  );
};

export default Header;
