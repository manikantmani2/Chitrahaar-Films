import React from 'react';
import { motion } from 'framer-motion';
import { fadeInVariants, hoverVariants, tapVariants } from '@/utils/animations';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'hover' | 'glass';
  delay?: number;
}

const Card: React.FC<CardProps> = ({ children, className = '', variant = 'default', delay = 0 }) => {
  const baseClasses = 'rounded-xl p-6 transition-all duration-300';

  const variantClasses = {
    default: 'bg-secondary border border-border hover:border-accent',
    hover: 'bg-secondary border border-border hover:border-accent hover:shadow-lg hover:shadow-accent/20 hover-lift',
    glass: 'glass-effect hover:border-accent border border-accent/20',
  } as Record<string, string>;

  return (
    <motion.div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeInVariants}
      custom={delay}
      whileHover={{ scale: 1.04, y: -6, transition: { duration: 0.28, ease: 'easeOut' } }}
      whileTap={{ scale: 0.96 }}
    >
      {children}
    </motion.div>
  );
};

export default Card;
