import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Button from '@/components/Button';

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404 - Page Not Found | Chitrahaar Films</title>
      </Head>

      <div className="min-h-screen bg-primary flex items-center justify-center p-4">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="text-display-large font-display gradient-text mb-4"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            404
          </motion.div>

          <h1 className="text-heading-1 font-bold mb-2">Page Not Found</h1>
          <p className="text-text-secondary mb-8 max-w-md">
            Sorry, the page you&apos;re looking for doesn&apos;t exist. Let&apos;s get you back on track.
          </p>

          <Link href="/">
            <Button variant="primary" size="lg">
              Back to Home
            </Button>
          </Link>
        </motion.div>
      </div>
    </>
  );
}
