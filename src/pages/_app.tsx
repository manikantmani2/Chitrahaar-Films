import React from 'react';
import type { AppProps } from 'next/app';
import { AnimatePresence } from 'framer-motion';
import '@/styles/globals.css';

function App({ Component, pageProps }: AppProps) {
  return (
    <AnimatePresence mode="wait">
      <Component {...pageProps} />
    </AnimatePresence>
  );
}

export default App;
