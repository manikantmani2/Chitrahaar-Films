import React from 'react';
import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '@/utils/animations';

interface SectionProps {
  id?: string;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  background?: 'default' | 'gradient' | 'dark';
}

const Section: React.FC<SectionProps> = ({
  id,
  title,
  subtitle,
  children,
  className = '',
  background = 'default',
}) => {
  const bgClasses = {
    default: 'bg-primary',
    gradient: 'bg-gradient-to-b from-primary via-secondary to-primary',
    dark: 'bg-secondary',
  };

  return (
    <section id={id} className={`${bgClasses[background]} section-padding ${className}`}>
      <div className="container-custom">
        {(title || subtitle) && (
          <motion.div
            className="mb-16 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {title && (
              <motion.h2 className="text-display-medium md:text-display-large font-display gradient-text mb-4" variants={itemVariants}>
                <span className="running-bg rounded-lg inline-block px-4 py-1">{title}</span>
              </motion.h2>
            )}
            {subtitle && (
              <motion.p className="text-text-secondary text-body-large max-w-2xl mx-auto" variants={itemVariants}>
                {subtitle}
              </motion.p>
            )}
          </motion.div>
        )}
        {children}
      </div>
    </section>
  );
};

export default Section;
