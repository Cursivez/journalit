import React from 'react';
import { getYouTubeEmbedUrl } from '../../utils/imageMediaUtils';

interface FullscreenYouTubeEmbedProps {
  url: string;
  title: string;
}

export function FullscreenYouTubeEmbed({
  url,
  title,
}: FullscreenYouTubeEmbedProps) {
  return (
    <div className="journalit-fullscreen-youtube-wrapper">
      <iframe
        className="journalit-fullscreen-youtube-embed"
        src={getYouTubeEmbedUrl(url)}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}
