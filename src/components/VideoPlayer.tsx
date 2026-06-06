import React from 'react';

interface VideoPlayerProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
  poster?: string;
}

const YOUTUBE_REGEX = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/i;

export default function VideoPlayer({ src, poster, className, ...rest }: VideoPlayerProps) {
  const match = src ? src.match(YOUTUBE_REGEX) : null;

  if (match && match[1]) {
    const id = match[1];
    const params = new URLSearchParams();
    // prefer mute/autoplay when requested via props
    if ((rest as any).autoPlay) params.set('autoplay', '1');
    if ((rest as any).muted) params.set('mute', '1');
    params.set('playsinline', '1');
    params.set('rel', '0');
    const embed = `https://www.youtube.com/embed/${id}?${params.toString()}`;

    return (
      <iframe
        src={embed}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className={className}
        frameBorder="0"
      />
    );
  }

  return (
    <video src={src} poster={poster} className={className} {...rest}>
      <source src={src} />
      Your browser does not support the video tag.
    </video>
  );
}
