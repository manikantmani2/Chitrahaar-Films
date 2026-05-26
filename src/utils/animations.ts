import { ReactNode } from 'react';

// Animation variants for Framer Motion
export const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    transition: {
      delay,
      duration: 0.72,
      ease: 'easeOut',
    },
  }),
};

export const slideUpVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay,
      duration: 0.72,
      ease: 'easeOut',
    },
  }),
};

export const slideDownVariants = {
  hidden: { opacity: 0, y: -60 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay,
      duration: 0.72,
      ease: 'easeOut',
    },
  }),
};

export const slideLeftVariants = {
  hidden: { opacity: 0, x: -60 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay,
      duration: 0.72,
      ease: 'easeOut',
    },
  }),
};

export const slideRightVariants = {
  hidden: { opacity: 0, x: 60 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay,
      duration: 0.72,
      ease: 'easeOut',
    },
  }),
};

export const scaleVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay,
      duration: 0.72,
      ease: 'easeOut',
    },
  }),
};

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: 'easeOut',
    },
  },
};

export const hoverVariants = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.04, y: -6, transition: { duration: 0.28, ease: 'easeOut' } },
};

export const tapVariants = {
  rest: { scale: 1 },
  tap: { scale: 0.96, transition: { duration: 0.12 } },
};

// small parallax effect for images
export const imageHover = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.06, y: -8, transition: { duration: 0.35, ease: 'easeOut' } },
};

// Scroll animation variants
export const scrollVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: 'easeOut',
    },
  },
};
