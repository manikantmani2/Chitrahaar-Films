import React from 'react';
import Card from './Card';
import { MEDIA_LIBRARY } from '@/constants';
import { motion } from 'framer-motion';
import { imageHover } from '@/utils/animations';
import { FaInstagram, FaYoutube } from 'react-icons/fa';

const VideoLibrary: React.FC = () => {
  const videos = MEDIA_LIBRARY.filter((m) => m.type === 'video');
  const fallback = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
  const instagramUrl = 'https://instagram.com/chitrahaarfilms';
  const youtubeUrl = 'https://youtube.com/@chitrahaarfilms';

  return (
    <div id="video-library" className="py-16 px-4 md:px-8">
      <div className="grid-auto">
        {videos.map((v) => (
          <Card key={v.id} variant="hover" className="h-full">
            <motion.div className="w-full aspect-video rounded-lg overflow-hidden mb-4 bg-secondary border border-border" whileHover="hover" initial="rest" variants={imageHover}>
              <video controls className="w-full h-full object-cover">
                <source src={fallback} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </motion.div>
            <h3 className="text-heading-2 font-bold mb-2">{v.title}</h3>
            <p className="text-text-secondary text-sm mb-4">{v.description}</p>
            <div className="flex items-center gap-3">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-primary transition-colors"
                title="Follow on Instagram"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-primary transition-colors"
                title="Subscribe on YouTube"
              >
                <FaYoutube size={20} />
              </a>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VideoLibrary;

