import React from 'react';
import Image from 'next/image';
import Card from './Card';
import { PORTFOLIO_PROJECTS } from '@/constants';
import { motion } from 'framer-motion';
import { imageHover } from '@/utils/animations';
import { FaInstagram } from 'react-icons/fa';

const PhotoLibrary: React.FC = () => {
  const photos = PORTFOLIO_PROJECTS.filter((p) => p.image && p.category !== 'Short Films');
  const instagramUrl = 'https://instagram.com/chitrahaarfilms';

  return (
    <div id="photo-library" className="py-16 px-4 md:px-8">
      <div className="grid-auto">
        {photos.map((p) => (
          <Card key={p.id} variant="hover" className="h-full">
              <motion.div className="relative w-full h-48 rounded-lg overflow-hidden mb-4 bg-secondary border border-border" whileHover="hover" initial="rest" variants={imageHover}>
                <Image
                  src={p.image || '/company-image.jpg'}
                  alt={p.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMB/0rXyQAAAABJRU5ErkJggg=="
                />
              </motion.div>
            <h3 className="text-heading-2 font-bold mb-2">{p.title}</h3>
            <p className="text-text-secondary text-sm mb-4">{p.description}</p>
            <div className="flex items-center gap-2">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-primary transition-colors"
                title="Follow on Instagram"
              >
                <FaInstagram size={20} />
              </a>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PhotoLibrary;

