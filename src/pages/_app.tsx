import React from 'react';
import type { AppProps } from 'next/app';
import { AnimatePresence } from 'framer-motion';
import '@/styles/globals.css';
import { CONTACT_INFO } from '@/constants';

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <AnimatePresence mode="wait">
        <Component {...pageProps} />
      </AnimatePresence>

      <a
        href={`https://wa.me/${CONTACT_INFO.phone.replace(/[^0-9]/g, '')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-fab"
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20.52 3.48C18.14 1.1 15 0 12 0 5.37 0 0 5.37 0 12c0 2.12.56 4.18 1.62 6.02L0 24l6.3-1.6c1.69.91 3.6 1.38 5.5 1.38 6.63 0 12-5.37 12-12 0-3-1.1-6.14-3.28-8.4z" fill="#000" opacity="0.05"/>
          <path d="M12 2.4c2.34 0 4.47.9 6.06 2.52 1.59 1.62 2.46 3.78 2.46 6.06 0 1.62-.45 3.18-1.32 4.56l-.06.12-1.44 3.06-3.12-.78c-1.26.6-2.64.9-4.02.9-6.06 0-11-4.94-11-11S5.94 2.4 12 2.4z" fill="#000" opacity="0.05"/>
          <path d="M17.16 14.88c-.36-.18-2.16-1.08-2.5-1.2-.36-.12-.62-.18-.88.18-.24.36-.86 1.2-1.06 1.44-.18.24-.36.27-.72.09-.36-.18-1.5-.56-2.86-1.76-1.06-.94-1.78-2.1-1.98-2.46-.18-.36-.02-.56.16-.74.16-.16.36-.42.54-.63.18-.21.24-.36.36-.6.12-.24.06-.45-.03-.63-.06-.18-.88-2.12-1.2-2.9-.32-.78-.64-.66-.88-.66l-.74.01c-.24 0-.63.09-.96.45-.33.36-1.26 1.24-1.26 3.02 0 1.78 1.29 3.5 1.47 3.74.18.24 2.54 3.88 6.16 5.44 3.62 1.58 3.62.96 4.28.9.66-.06 2.16-.88 2.46-1.72.3-.84.3-1.56.21-1.72-.09-.18-.33-.27-.72-.45z" fill="#000" opacity="0.12"/>
        </svg>
      </a>
    </>
  );
}

export default App;
