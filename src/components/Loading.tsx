import React from 'react';
import { motion } from 'framer-motion';
import Head from 'next/head';

const Loading: React.FC = () => {
  return (
    <>
      <Head>
        <title>Loading...</title>
      </Head>
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <motion.div
          className="flex flex-col items-center gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Animated logo */}
          <motion.div
            className="w-16 h-16 bg-gradient-to-r from-accent to-gold rounded-lg"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Loading bar */}
          <div className="w-48 h-1 bg-border rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-accent to-gold"
              animate={{
                x: [-192, 192],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>

          <p className="text-text-secondary text-sm">Loading amazing content...</p>
        </motion.div>
      </div>
    </>
  );
};

export default Loading;
