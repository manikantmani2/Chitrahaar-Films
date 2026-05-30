import React from 'react';
import { motion } from 'framer-motion';
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaArrowUp } from 'react-icons/fa';
import Logo from './Logo';
import { CONTACT_INFO } from '@/constants';
import { scrollToSection } from '@/utils/helpers';
import { fadeInVariants, containerVariants, itemVariants } from '@/utils/animations';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: FaFacebook, href: '#', label: 'Facebook' },
    { icon: FaInstagram, href: '#', label: 'Instagram' },
    { icon: FaLinkedin, href: '#', label: 'LinkedIn' },
    { icon: FaTwitter, href: '#', label: 'Twitter' },
  ];

  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Services', href: '#services' },
    { name: 'Gallery', href: '#works-gallery' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-secondary border-t border-border">
      <div className="container-custom py-20">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          {/* Brand */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-3 mb-6">
              <Logo size={40} />
            </div>
            <p className="text-text-secondary text-sm leading-relaxed">
              Premium production house creating cinematic experiences that inspire and engage audiences worldwide.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h4 className="text-lg font-bold mb-6 gradient-text">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-text-secondary hover:text-accent transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div variants={itemVariants}>
            <h4 className="text-lg font-bold mb-6 gradient-text">Services</h4>
            <ul className="space-y-3">
              {['Corporate Videos', 'Documentary', 'Photography', 'Animation', 'Event Coverage'].map((service) => (
                <li key={service}>
                  <a href="#services" className="text-text-secondary hover:text-accent transition-colors duration-300 text-sm">
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants}>
            <h4 className="text-lg font-bold mb-6 gradient-text">Contact</h4>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-text-secondary mb-1">Email:</p>
                <a href={`mailto:${CONTACT_INFO.email}`} className="text-accent hover:text-accent-light transition-colors duration-300">
                  {CONTACT_INFO.email}
                </a>
              </div>
              <div>
                <p className="text-text-secondary mb-1">Phone:</p>
                <a href={`tel:${CONTACT_INFO.phone}`} className="text-accent hover:text-accent-light transition-colors duration-300">
                  {CONTACT_INFO.phone}
                </a>
              </div>
              <div>
                <p className="text-text-secondary mb-1">Hours:</p>
                <p className="text-text-primary">{CONTACT_INFO.hours}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent my-12"></div>

        {/* Bottom Section */}
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          {/* Copyright */}
          <motion.p className="text-text-secondary text-sm" variants={itemVariants}>
            &copy; {currentYear} Chitrahaar Films. All rights reserved. | Privacy Policy | Terms of Service
          </motion.p>

          {/* Social Links */}
          <motion.div className="flex items-center gap-6 mt-6 md:mt-0" variants={itemVariants}>
            {socialLinks.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                className="text-text-secondary hover:text-[rgba(212,175,55,0.95)] transition-colors duration-300 p-2 rounded-full hover:glow-effect"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                <social.icon size={20} />
              </motion.a>
            ))}
          </motion.div>

          {/* Scroll to Top */}
          <motion.button
            onClick={scrollToTop}
            className="mt-6 md:mt-0 p-3 rounded-full border border-border hover:border-accent text-text-secondary hover:text-accent transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaArrowUp />
          </motion.button>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;

