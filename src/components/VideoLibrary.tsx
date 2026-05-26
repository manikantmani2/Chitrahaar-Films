import React from 'react';
import Section from './Section';
import Card from './Card';
import { MEDIA_LIBRARY } from '@/constants';
import { motion } from 'framer-motion';
import { imageHover } from '@/utils/animations';

const VideoLibrary: React.FC = () => {
  const videos = MEDIA_LIBRARY.filter((m) => m.type === 'video');
  const fallback = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';

  return (
    <Section id="video-library" title="Video Library" subtitle="Selected video highlights">
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
          </Card>
        ))}
      </div>
    </Section>
  );
};

export default VideoLibrary;
