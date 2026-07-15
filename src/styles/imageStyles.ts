



export const IMAGE_STYLES = `
  
  .journalit-image-upload-wrapper {
    margin-bottom: 12px;
    position: relative;
  }

  .journalit-image-upload-layout {
    display: flex;
    gap: 8px;
    min-height: 80px;
    width: 100%;
  }

  
  .journalit-image-upload-paste-area {
    flex: 0 0 calc(33.333% - 4px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: var(--interactive-accent);
    color: var(--text-on-accent, white);
    border: 2px solid var(--interactive-accent);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    padding: 12px 8px;
    min-height: 80px;
    font-size: 13px;
    font-weight: 500;
    gap: 6px;
  }

  .journalit-image-upload-paste-area:hover {
    background-color: var(--interactive-accent-hover);
    border-color: var(--interactive-accent-hover);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(var(--interactive-accent-rgb, 83, 141, 226), 0.2);
  }

  .journalit-image-upload-paste-area:disabled {
    background-color: var(--background-modifier-border);
    border-color: var(--background-modifier-border);
    color: var(--text-muted);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  .journalit-image-upload-paste-area.pasting {
    background-color: var(--background-modifier-border);
    border-color: var(--background-modifier-border);
    color: var(--text-muted);
    cursor: wait;
  }

  .journalit-image-upload-paste-area .paste-icon {
    flex-shrink: 0;
    line-height: 1;
  }

  .journalit-image-upload-paste-area .paste-text {
    font-size: 12px;
    text-align: center;
    line-height: 1.2;
  }

  
  .journalit-image-upload-file-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 80px;
    border: 2px dashed var(--background-modifier-border);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
    background-color: var(--background-secondary);
    padding: 12px;
  }

  .journalit-image-upload-file-area.full-width {
    flex: 1;
    min-width: 100%;
  }

  .journalit-image-upload-file-area:hover {
    border-color: var(--interactive-accent);
    background-color: rgba(var(--interactive-accent-rgb, 83, 141, 226), 0.05);
  }

  .journalit-image-upload-file-area:focus {
    outline: 2px solid var(--interactive-accent);
    outline-offset: 2px;
    border-color: var(--interactive-accent);
    background-color: rgba(var(--interactive-accent-rgb, 83, 141, 226), 0.08);
  }

  .journalit-image-upload-file-area.dragging-over {
    border-color: var(--interactive-accent);
    background-color: rgba(var(--interactive-accent-rgb, 83, 141, 226), 0.1);
    transform: scale(1.02);
    box-shadow: 0 0 12px rgba(var(--interactive-accent-rgb, 83, 141, 226), 0.3);
  }

  .journalit-image-upload-label {
    font-size: 14px;
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: center;
    line-height: 1.3;
  }

  .journalit-image-upload-file-area:hover .journalit-image-upload-label {
    color: var(--interactive-accent);
  }

  .journalit-image-upload-input {
    display: none;
  }

  
  .journalit-image-upload-file-area::after {
    content: "Drop image here";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 16px;
    font-weight: 600;
    color: var(--interactive-accent);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease;
  }

  .journalit-image-upload-file-area.dragging-over::after {
    opacity: 1;
  }

  .journalit-image-upload-file-area.dragging-over .journalit-image-upload-label {
    opacity: 0;
  }

  
  .journalit-spinner {
    width: 12px;
    height: 12px;
    border: 2px solid var(--background-modifier-border);
    border-top: 2px solid var(--interactive-accent);
    border-radius: 50%;
    animation: journalit-spinner-rotate 1s linear infinite;
  }

  @keyframes journalit-spinner-rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  
  @media (max-width: 768px) {
    .journalit-image-upload-layout {
      flex-direction: column;
      gap: 6px;
    }

    .journalit-image-upload-paste-area {
      flex: 0 0 auto;
      min-height: 60px;
      flex-direction: row;
      gap: 8px;
      padding: 12px 16px;
    }

    .journalit-image-upload-file-area {
      flex: 1;
      min-height: 70px;
    }

    .journalit-image-upload-paste-area .paste-text {
      font-size: 13px;
    }
  }

  @media (max-width: 480px) {
    .journalit-image-upload-layout {
      gap: 4px;
    }

    .journalit-image-upload-paste-area {
      min-height: 50px;
      padding: 10px 12px;
      font-size: 12px;
    }

    .journalit-image-upload-file-area {
      min-height: 60px;
      padding: 8px;
    }

    .journalit-image-upload-label {
      font-size: 13px;
    }

    .journalit-image-upload-paste-area .paste-text {
      font-size: 11px;
    }
  }

  
  .journalit-image-viewer {
    position: relative;
    margin-bottom: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    border: 1px solid var(--background-modifier-border);
    border-radius: 6px;
    padding: 8px;
    background-color: var(--background-primary);
  }

  .journalit-image-container {
    position: relative;
    width: 100%;
  }

  .journalit-image {
    width: 100%;
    border-radius: var(--radius-m);
    cursor: pointer;
  }

  .journalit-image-delete-button {
    position: absolute;
    top: 8px;
    right: 8px;
    background-color: rgba(229, 57, 53, 0.1);
    color: var(--color-error, #e53935);
    border: none;
    border-radius: 4px;
    padding: 6px 12px;
    font-size: 12px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    z-index: 10;
  }

  .journalit-image-delete-button:hover {
    background-color: rgba(229, 57, 53, 0.2);
  }

  .journalit-image-error {
    color: var(--text-error, var(--color-red, #e53935));
    font-size: 12px;
    text-align: center;
    margin-top: 4px;
    margin-bottom: 8px;
    padding: 6px 10px;
    background-color: rgba(229, 57, 53, 0.1);
    border-radius: 4px;
    width: 100%;
  }

  
  .journalit-fullscreen-portal-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 0;
    height: 0;
    z-index: 4000;
    pointer-events: none;
  }

  .journalit-fullscreen-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.9);
    z-index: 10000; 
    display: flex;
    align-items: center;
    justify-content: center;
    animation: journalit-fade-in 0.3s ease-in-out;
    cursor: pointer; 
    pointer-events: auto; 
    
    contain: layout style paint;
  }

  
  .journalit-fullscreen-overlay-ui {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none; 
    z-index: 10001; 
    
    contain: layout style paint;
  }

  .journalit-fullscreen-title {
    position: absolute;
    top: 20px;
    left: 20px;
    color: var(--text-on-accent);
    font-size: 16px;
    font-weight: 500;
    background-color: rgba(0, 0, 0, 0.8);
    padding: 8px 12px;
    border-radius: 6px;
    pointer-events: auto; 
  }

  .journalit-fullscreen-close-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    background-color: rgba(0, 0, 0, 0.8);
    color: var(--text-on-accent);
    border: none;
    border-radius: 50%;
    font-size: 24px;
    font-weight: 300;
    line-height: 1;
    padding: 0 0 2px 0; 
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    pointer-events: auto; 
  }

  .journalit-fullscreen-close-btn:hover {
    background-color: rgba(0, 0, 0, 1.0);
    transform: scale(1.1);
  }

  .journalit-fullscreen-content-wrapper {
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    pointer-events: none; 
    
    contain: layout style paint;
    isolation: isolate;
  }

  .journalit-fullscreen-content {
    pointer-events: auto; 
  }

  
  .journalit-image-carousel {
    width: 100%;
    margin-bottom: 16px;
    background-color: var(--background-secondary);
    border-radius: 6px;
    padding: 12px;
  }

  .journalit-carousel-main {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 8px;
    position: relative;
    width: 100%;
  }

  .journalit-carousel-image-container {
    flex: 1;
    width: 100%;
    position: relative;
  }

  .journalit-carousel-empty {
    text-align: center;
    padding: 20px;
    color: var(--text-muted);
  }

  .journalit-carousel-image {
    width: 100%;
    max-width: 100% !important;
    height: auto;
    display: block;
    border-radius: var(--radius-m);
    cursor: default;
  }

  .journalit-carousel-image.is-clickable {
    cursor: pointer;
  }

  .journalit-carousel-video {
    background: var(--background-primary);
  }

  .journalit-media-preview-video {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: inherit;
    background: var(--background-primary);
  }

  .journalit-media-preview-video video {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
    pointer-events: none;
  }

  .journalit-media-preview-youtube img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
  }

  .journalit-media-preview-video__badge {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background: rgba(var(--mono-rgb-0), 0.64);
    color: var(--text-on-accent);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.26);
    backdrop-filter: blur(8px);
    pointer-events: none;
  }

  .journalit-carousel-excalidraw {
    width: 100%;
  }

  .journalit-carousel-excalidraw.is-clickable {
    cursor: pointer;
  }

  .journalit-excalidraw-media {
    position: relative;
    width: 100%;
    min-height: 180px;
    border: 1px solid var(--background-modifier-border);
    border-radius: var(--radius-m);
    overflow: hidden;
    background: var(--background-primary);
  }

  .journalit-excalidraw-media--fullscreen {
    width: auto;
    min-height: 0;
    max-width: min(92vw, 1200px);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 0;
    background: transparent;
  }

  .journalit-excalidraw-media--fullscreen .journalit-excalidraw-media__embed {
    width: auto;
    min-height: 0;
    padding: 0;
  }

  .journalit-excalidraw-media__embed {
    width: 100%;
    min-height: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px;
  }

  .journalit-excalidraw-media__embed .internal-embed,
  .journalit-excalidraw-media__embed .media-embed,
  .journalit-excalidraw-media__embed .image-embed,
  .journalit-excalidraw-media__embed img,
  .journalit-excalidraw-media__embed svg {
    width: min(100%, 1000px) !important;
    height: auto !important;
    max-width: 100%;
    max-height: min(70vh, 720px);
  }

  .journalit-excalidraw-media--fullscreen .journalit-excalidraw-media__embed svg {
    width: min(88vw, 1000px) !important;
  }

  .journalit-excalidraw-media__embed .excalidraw-svg,
  .journalit-excalidraw-media__embed .excalidraw-embedded-img {
    width: min(100%, 1000px) !important;
    max-width: 100% !important;
    margin: 0 auto;
  }

  .journalit-excalidraw-media--fullscreen .journalit-excalidraw-media__embed p {
    width: auto;
    display: flex;
    justify-content: center;
    margin: 0;
  }

  .journalit-excalidraw-media--fullscreen .journalit-excalidraw-media__embed .excalidraw-svg,
  .journalit-excalidraw-media--fullscreen .journalit-excalidraw-media__embed .excalidraw-embedded-img {
    width: min(88vw, 1000px) !important;
    max-width: 100% !important;
  }

  .journalit-excalidraw-media--fullscreen .journalit-excalidraw-media__embed .excalidraw-svg svg,
  .journalit-excalidraw-media--fullscreen .journalit-excalidraw-media__embed .excalidraw-embedded-img svg {
    width: 100% !important;
    height: auto !important;
  }


  .journalit-carousel-delete {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: rgba(0, 0, 0, 0.6);
    color: white;
    border: none;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    line-height: 1;
    z-index: 10;
  }

  .journalit-carousel-delete:hover {
    background: rgba(0, 0, 0, 0.75);
  }

  .journalit-carousel-image-container button.journalit-carousel-overlay-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.35);
    background-color: rgba(0, 0, 0, 0.35);
    color: white;
    border: none;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    min-width: 32px;
    min-height: 32px;
    padding: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    box-shadow: none;
    appearance: none;
    z-index: 10;
  }

  .journalit-carousel-image-container button.journalit-carousel-overlay-button .journalit-obsidian-icon,
  .journalit-carousel-image-container button.journalit-carousel-overlay-button .journalit-obsidian-icon svg {
    display: block;
  }

  .journalit-carousel-image-container button.journalit-carousel-overlay-button .journalit-obsidian-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 18px;
    height: 18px;
    margin: 0;
    transform: translate(-50%, -50%);
  }

  .journalit-carousel-image-container button.journalit-carousel-overlay-button .journalit-obsidian-icon svg {
    width: 18px;
    height: 18px;
  }

  .journalit-carousel-overlay-button--prev {
    left: 0.5rem;
  }

  .journalit-carousel-overlay-button--next {
    right: 0.5rem;
  }

  .journalit-carousel-image-container button.journalit-carousel-overlay-button:hover,
  .journalit-carousel-image-container button.journalit-carousel-overlay-button:focus-visible {
    background: rgba(0, 0, 0, 0.55);
    background-color: rgba(0, 0, 0, 0.55);
    transform: translateY(-50%) scale(1.05);
    box-shadow: none;
  }

  .journalit-carousel-button {
    width: 36px;
    height: 36px;
    min-width: 36px;
    background-color: var(--background-primary);
    color: var(--text-normal);
    border: 1px solid var(--background-modifier-border);
    border-radius: 50%;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    z-index: 20;
  }

  .journalit-carousel-button:hover {
    background-color: var(--background-modifier-hover);
    transform: translateY(-1px);
  }

  .journalit-carousel-counter {
    text-align: center;
    font-size: 12px;
    color: var(--text-muted);
    margin: 4px 0;
  }

  .journalit-carousel-thumbnails {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 4px;
    justify-content: center;
  }

  .journalit-carousel-thumbnail {
    width: 60px;
    height: 60px;
    border: 2px solid var(--background-modifier-border);
    border-radius: 4px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .journalit-carousel-thumbnail:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  .journalit-carousel-thumbnail.active {
    border-color: var(--interactive-accent);
    box-shadow: 0 0 0 2px var(--interactive-accent);
  }

  .journalit-carousel-thumbnail img,
  .journalit-carousel-thumbnail video,
  .journalit-carousel-thumbnail-media {
    display: block;
    width: 100%;
    max-width: 100% !important;
    height: 100%;
    max-height: 100% !important;
    object-fit: cover;
  }

  .journalit-carousel-thumbnail-excalidraw,
  .journalit-trade-preview-thumbnail-excalidraw {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
    background: var(--background-secondary);
    font-size: 11px;
    font-weight: 600;
  }

  .journalit-carousel-thumbnail-excalidraw {
    overflow: hidden;
  }

  .journalit-carousel-thumbnail-excalidraw .journalit-excalidraw-media {
    min-height: 100%;
    height: 100%;
    border: 0;
    border-radius: 0;
    background: transparent;
  }

  .journalit-carousel-thumbnail-excalidraw .journalit-excalidraw-media__embed {
    min-height: 100%;
    height: 100%;
    padding: 0;
  }

  .journalit-carousel-thumbnail-excalidraw .internal-embed,
  .journalit-carousel-thumbnail-excalidraw .media-embed,
  .journalit-carousel-thumbnail-excalidraw .image-embed,
  .journalit-carousel-thumbnail-excalidraw .excalidraw-svg,
  .journalit-carousel-thumbnail-excalidraw .excalidraw-embedded-img,
  .journalit-carousel-thumbnail-excalidraw img,
  .journalit-carousel-thumbnail-excalidraw svg {
    width: 100% !important;
    height: 100% !important;
    max-width: 100% !important;
    max-height: 100% !important;
    object-fit: cover;
  }
  .journalit-media-carousel-surface.journalit-media-carousel-surface {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    width: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
    background: transparent;
    border: 0;
    border-radius: 0;
  }

  .journalit-media-carousel-surface.journalit-media-carousel-surface .journalit-image-carousel {
    position: relative;
    width: 100%;
    margin: 0;
    padding: 0;
    background: transparent;
    border: 0;
    border-radius: 0;
    box-shadow: none;
  }

  .journalit-media-carousel-surface.journalit-media-carousel-surface .journalit-carousel-main {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0;
    width: 100%;
    margin: 0;
  }

  .journalit-media-carousel-surface.journalit-media-carousel-surface .journalit-carousel-image-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    aspect-ratio: 1594 / 1003;
    max-height: min(64vh, 560px);
    overflow: hidden;
    background: transparent;
    border: 0;
    border-radius: var(--radius-m, 8px);
  }

  .journalit-media-carousel-surface.journalit-media-carousel-surface .journalit-carousel-image {
    display: block;
    width: 100%;
    height: 100%;
    max-width: 100% !important;
    max-height: min(64vh, 560px);
    margin: 0 auto;
    object-fit: contain;
    border: 0;
    border-radius: var(--radius-m, 8px);
  }

  .journalit-media-carousel-surface.journalit-media-carousel-surface .journalit-carousel-excalidraw {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  .journalit-media-carousel-surface.journalit-media-carousel-surface .journalit-excalidraw-media {
    max-width: 100%;
    max-height: 100%;
    background: transparent;
    border: 0;
  }

  .journalit-media-carousel-surface.journalit-media-carousel-surface .journalit-carousel-counter {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    z-index: 2;
    margin: 0;
    padding: 0.25rem 0.55rem;
    border: 1px solid rgba(var(--mono-rgb-100), 0.14);
    border-radius: var(--radius-s, 6px);
    background: rgba(var(--mono-rgb-0), 0.52);
    color: var(--text-normal);
    font-size: 0.75rem;
    font-weight: 600;
    line-height: 1;
    backdrop-filter: blur(8px);
  }

  .journalit-media-carousel-surface.journalit-media-carousel-surface .journalit-image-carousel--delete-enabled .journalit-carousel-counter {
    right: auto;
    left: 0.75rem;
  }

  .journalit-media-carousel-surface.journalit-media-carousel-surface .journalit-carousel-thumbnails {
    display: flex;
    flex-wrap: nowrap;
    justify-content: safe center;
    gap: 0.5rem;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 0.65rem 0.25rem 0.3rem;
    margin: 0;
    border-top: 0;
    background: transparent;
    scrollbar-color: var(--scrollbar-thumb-bg, var(--background-modifier-border-hover)) transparent;
    scrollbar-width: thin;
  }

  .journalit-media-carousel-surface.journalit-media-carousel-surface .journalit-carousel-thumbnails::-webkit-scrollbar {
    height: 4px;
  }

  .journalit-media-carousel-surface.journalit-media-carousel-surface .journalit-carousel-thumbnails::-webkit-scrollbar-button {
    display: none;
    width: 0;
    height: 0;
  }

  .journalit-media-carousel-surface.journalit-media-carousel-surface .journalit-carousel-thumbnails::-webkit-scrollbar-track {
    background: transparent;
  }

  .journalit-media-carousel-surface.journalit-media-carousel-surface .journalit-carousel-thumbnails::-webkit-scrollbar-thumb {
    background-color: var(--scrollbar-thumb-bg, rgba(var(--mono-rgb-100), 0.22));
    border-radius: 999px;
  }

  .journalit-media-carousel-surface.journalit-media-carousel-surface .journalit-carousel-thumbnails::-webkit-scrollbar-thumb:hover {
    background-color: var(--scrollbar-active-thumb-bg, rgba(var(--mono-rgb-100), 0.34));
  }

  .journalit-media-carousel-surface.journalit-media-carousel-surface .journalit-carousel-thumbnail {
    width: 4.5rem;
    height: 3rem;
    flex: 0 0 auto;
    border-radius: var(--radius-s, 6px);
    background: transparent;
    scroll-snap-align: center;
  }

  .journalit-trade-preview-thumbnail-excalidraw {
    overflow: hidden;
  }

  .journalit-trade-preview-thumbnail-excalidraw .journalit-excalidraw-media {
    min-height: 100%;
    height: 100%;
    border: 0;
    border-radius: 0;
    background: transparent;
  }

  .journalit-trade-preview-thumbnail-excalidraw .journalit-excalidraw-media__embed {
    min-height: 100%;
    height: 100%;
    padding: 0;
  }

  .journalit-trade-preview-thumbnail-excalidraw .excalidraw-svg,
  .journalit-trade-preview-thumbnail-excalidraw .excalidraw-embedded-img,
  .journalit-trade-preview-thumbnail-excalidraw svg {
    width: 100% !important;
    height: 100% !important;
    max-width: 100% !important;
    max-height: 100% !important;
  }

  
  @keyframes journalit-fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes journalit-zoom-in {
    from { transform: scale(0.9); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }

  
  .journalit-image-zoom-indicator {
    position: absolute;
    bottom: 8px;
    right: 8px;
    background-color: rgba(0, 0, 0, 0.6);
    color: var(--text-on-accent);
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 10px;
    opacity: 0;
    transition: opacity 0.2s ease;
    pointer-events: none;
  }

  .journalit-image-container:hover .journalit-image-zoom-indicator {
    opacity: 1;
  }

  
  .journalit-fullscreen-viewer {
    position: relative;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    
    contain: layout style paint;
    isolation: isolate;
  }

  .journalit-fullscreen-copy-menu {
    position: fixed;
    left: var(--journalit-image-copy-menu-x);
    top: var(--journalit-image-copy-menu-y);
    z-index: 100;
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 132px;
    padding: 9px 12px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 8px;
    background: var(--background-secondary);
    color: var(--text-normal);
    font-size: 14px;
    line-height: 1.2;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
    cursor: pointer;
    pointer-events: auto;
  }

  .journalit-fullscreen-copy-menu__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
    flex: 0 0 auto;
  }

  .journalit-fullscreen-copy-menu__icon--success {
    color: var(--text-success);
  }

  .journalit-fullscreen-copy-menu:hover,
  .journalit-fullscreen-copy-menu:focus-visible {
    background: var(--background-secondary);
    border-color: var(--background-modifier-border-hover);
    outline: none;
  }

  .journalit-fullscreen-image-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    
    contain: layout style paint;
  }

  .journalit-fullscreen-video-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    padding: 4.5rem 2rem 6.5rem;
    overflow: hidden;
    contain: layout style paint;
  }

  .journalit-fullscreen-video {
    width: min(92vw, 1280px);
    max-width: 92vw;
    max-height: calc(100vh - 11rem);
    border-radius: var(--radius-l, 12px);
    background: black;
    box-shadow: 0 18px 48px rgba(0, 0, 0, 0.42);
    cursor: pointer;
  }

  .journalit-fullscreen-youtube-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    padding: 4.5rem 2rem 5rem;
    overflow: hidden;
    contain: layout style paint;
  }

  .journalit-fullscreen-youtube-embed {
    width: min(92vw, 1280px);
    aspect-ratio: 16 / 9;
    max-width: 92vw;
    max-height: calc(100vh - 9.5rem);
    border: 0;
    border-radius: var(--radius-l, 12px);
    background: black;
    box-shadow: 0 18px 48px rgba(0, 0, 0, 0.42);
  }

  .journalit-fullscreen-video-controls {
    position: absolute;
    left: 50%;
    bottom: 4rem;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 0.65rem;
    width: min(900px, calc(100vw - 2rem));
    max-width: calc(100vw - 2rem);
    padding: 0.65rem 0.8rem;
    border: 1px solid rgba(var(--mono-rgb-100), 0.14);
    border-radius: 18px;
    background: rgba(var(--mono-rgb-0), 0.74);
    color: var(--text-on-accent);
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.34);
    backdrop-filter: blur(12px);
    z-index: 12;
  }

  .journalit-fullscreen-video-control-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 2.15rem;
    height: 2.15rem;
    padding: 0 0.65rem;
    border: 1px solid rgba(var(--mono-rgb-100), 0.16);
    border-radius: 12px;
    background: rgba(var(--mono-rgb-100), 0.08);
    color: var(--text-on-accent);
    font-size: 0.75rem;
    font-weight: 700;
    cursor: pointer;
  }

  .journalit-fullscreen-video-control-btn:hover,
  .journalit-fullscreen-video-control-btn:focus-visible {
    background: rgba(var(--mono-rgb-100), 0.18);
    outline: none;
  }

  .journalit-fullscreen-video-timeline-hit-area {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    inline-size: 100%;
    height: 2rem;
    min-width: 0;
    flex: 1 1 28rem;
    cursor: pointer;
  }

  .journalit-fullscreen-video-timeline-rail {
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    height: 4px;
    transform: translateY(-50%);
    border-radius: 999px;
    background: linear-gradient(
      to right,
      var(--text-on-accent) 0%,
      var(--text-on-accent) var(--journalit-video-progress, 0%),
      rgba(var(--mono-rgb-100), 0.28) var(--journalit-video-progress, 0%),
      rgba(var(--mono-rgb-100), 0.28) 100%
    );
    pointer-events: none;
  }

  .journalit-fullscreen-video-timeline-thumb {
    position: absolute;
    left: var(--journalit-video-progress, 0%);
    top: 50%;
    z-index: 2;
    width: 14px;
    height: 14px;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background: var(--text-on-accent);
    box-shadow: 0 0 0 3px rgba(var(--mono-rgb-100), 0.12);
    pointer-events: none;
  }

  .journalit-fullscreen-video-timeline {
    position: absolute;
    inset: 0;
    z-index: 3;
    display: block;
    width: 100%;
    inline-size: 100%;
    min-width: 0;
    flex: 1 1 auto;
    accent-color: var(--interactive-accent);
    cursor: pointer;
    appearance: none;
    height: 100%;
    opacity: 0;
    background: transparent;
  }

  .journalit-fullscreen-video-timeline::-webkit-slider-runnable-track {
    height: 4px;
    border-radius: 999px;
    background: transparent;
  }

  .journalit-fullscreen-video-timeline::-webkit-slider-thumb {
    appearance: none;
    width: 14px;
    height: 14px;
    margin-top: 0;
    border: 0;
    border-radius: 50%;
    background: var(--text-on-accent);
    box-shadow: 0 0 0 3px rgba(var(--mono-rgb-100), 0.12);
  }

  .journalit-fullscreen-video-timeline::-moz-range-track {
    height: 4px;
    border-radius: 999px;
    background: rgba(var(--mono-rgb-100), 0.28);
  }

  .journalit-fullscreen-video-timeline::-moz-range-progress {
    height: 4px;
    border-radius: 999px;
    background: var(--text-on-accent);
  }

  .journalit-fullscreen-video-timeline::-moz-range-thumb {
    width: 14px;
    height: 14px;
    border: 0;
    border-radius: 50%;
    background: var(--text-on-accent);
    box-shadow: 0 0 0 3px rgba(var(--mono-rgb-100), 0.12);
  }

  .journalit-fullscreen-video-feedback {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 5.5rem;
    height: 5.5rem;
    border-radius: 50%;
    background: rgba(var(--mono-rgb-0), 0.62);
    color: var(--text-on-accent);
    box-shadow: 0 18px 48px rgba(0, 0, 0, 0.34);
    backdrop-filter: blur(10px);
    pointer-events: none;
    animation: journalit-video-feedback-fade 650ms ease-out forwards;
    z-index: 13;
  }

  @keyframes journalit-video-feedback-fade {
    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.85); }
    18% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    100% { opacity: 0; transform: translate(-50%, -50%) scale(1.08); }
  }

  .journalit-fullscreen-video-time {
    color: var(--text-on-accent);
    font-size: 0.75rem;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  .journalit-fullscreen-video-volume-controls {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    flex: 0 0 8rem;
  }

  .journalit-fullscreen-video-volume-controls--compact {
    flex-basis: auto;
  }

  .journalit-fullscreen-video-volume-btn {
    flex: 0 0 auto;
    padding: 0;
  }

  .journalit-fullscreen-video-volume {
    width: 100%;
    min-width: 0;
    height: 2rem;
    margin: 0;
    padding: 0;
    accent-color: var(--text-on-accent);
    cursor: pointer;
  }

  @media (max-width: 768px) {
    .journalit-fullscreen-video-wrapper {
      padding: 4.5rem 1rem 10rem;
    }

    .journalit-fullscreen-video {
      max-height: calc(100vh - 14.5rem);
    }

    .journalit-fullscreen-video-controls {
      bottom: 2rem;
      flex-wrap: wrap;
      gap: 0.45rem;
    }

    .journalit-fullscreen-video-timeline-hit-area {
      order: 10;
      flex-basis: 100%;
    }

    .journalit-fullscreen-video-volume-controls {
      flex-basis: 7rem;
    }

    .journalit-fullscreen-video-volume-controls--compact {
      flex-basis: auto;
    }
  }

  @media (max-width: 480px) {
    .journalit-fullscreen-video-skip-btn {
      display: none;
    }
  }

  .journalit-fullscreen-zoomable-image {
    max-width: 90vw;
    max-height: 90vh;
    object-fit: contain;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    transform-origin: center;
    transform: none;
    cursor: zoom-in;
    transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    will-change: auto;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    
    touch-action: none;
    -webkit-touch-callout: none;
  }

  .journalit-fullscreen-zoomable-media {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    max-width: 90vw;
    max-height: 90vh;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    transform-origin: center;
    transform: none;
    cursor: zoom-in;
    transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    will-change: auto;
    touch-action: none;
    -webkit-touch-callout: none;
  }

  .journalit-fullscreen-zoomable-image--zoomed,
  .journalit-fullscreen-zoomable-media--zoomed {
    cursor: grab;
  }

  .journalit-fullscreen-zoomable-image--panning,
  .journalit-fullscreen-zoomable-media--panning {
    cursor: grabbing;
  }

  .journalit-fullscreen-zoomable-image--transform-active,
  .journalit-fullscreen-zoomable-media--transform-active {
    will-change: transform;
  }

  
  .journalit-fullscreen-viewer button.journalit-fullscreen-nav-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 45px;
    height: 45px;
    min-width: 45px;
    min-height: 45px;
    padding: 0;
    background: rgba(0, 0, 0, 0.35);
    background-color: rgba(0, 0, 0, 0.35);
    color: var(--text-on-accent);
    border: none;
    border-radius: 50%;
    cursor: pointer;
    z-index: 10;
    transition: background-color 0.3s ease, transform 0.3s ease, opacity 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    box-shadow: none;
    appearance: none;
    opacity: 0.8;
    pointer-events: auto; 
  }

  .journalit-fullscreen-viewer button.journalit-fullscreen-nav-btn .journalit-obsidian-icon,
  .journalit-fullscreen-viewer button.journalit-fullscreen-nav-btn .journalit-obsidian-icon svg {
    display: block;
  }

  .journalit-fullscreen-viewer button.journalit-fullscreen-nav-btn .journalit-obsidian-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    height: 20px;
    margin: 0;
    transform: translate(-50%, -50%);
  }

  .journalit-fullscreen-viewer button.journalit-fullscreen-nav-btn .journalit-obsidian-icon svg {
    width: 20px;
    height: 20px;
  }

  .journalit-fullscreen-viewer button.journalit-fullscreen-nav-btn:hover,
  .journalit-fullscreen-viewer button.journalit-fullscreen-nav-btn:focus-visible {
    background: rgba(0, 0, 0, 0.55);
    background-color: rgba(0, 0, 0, 0.55);
    transform: translateY(-50%) scale(1.1);
    box-shadow: none;
    opacity: 1;
  }

  .journalit-fullscreen-nav-prev {
    left: 20px;
  }

  .journalit-fullscreen-nav-next {
    right: 20px;
  }

  
  .journalit-fullscreen-nav-indicator {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(0, 0, 0, 0.8);
    color: var(--text-on-accent);
    padding: 8px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
    font-variant-numeric: tabular-nums;
    z-index: 10;
    pointer-events: none; 
  }

  
  .journalit-fullscreen-zoom-indicator {
    position: absolute;
    bottom: 20px;
    left: 20px;
    background-color: rgba(0, 0, 0, 0.8);
    color: var(--text-on-accent);
    padding: 8px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
    z-index: 10;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  .journalit-fullscreen-viewer:hover .journalit-fullscreen-zoom-indicator {
    opacity: 1;
  }

  
  .journalit-fullscreen-zoomable-image.zooming {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  
  @media (max-width: 768px) {
    .journalit-fullscreen-viewer button.journalit-fullscreen-nav-btn {
      width: 40px;
      height: 40px;
      min-width: 40px;
      min-height: 40px;
    }

    .journalit-fullscreen-nav-prev {
      left: 10px;
    }

    .journalit-fullscreen-nav-next {
      right: 10px;
    }

    .journalit-fullscreen-nav-indicator {
      bottom: 15px;
      font-size: 11px;
      padding: 6px 10px;
    }

    .journalit-fullscreen-zoom-indicator {
      top: 15px;
      right: 15px;
      font-size: 11px;
      padding: 6px 10px;
    }
  }

  

  .journalit-compact-uploader-wrapper {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .journalit-compact-uploader-container {
    max-width: 600px;
    width: 100%;
  }

  .journalit-compact-uploader {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    background: var(--background-primary);
    border: 1px solid var(--background-modifier-border);
    border-radius: var(--radius-m);
    transition: all 0.2s ease;
  }

  .journalit-compact-uploader.dragging {
    border-color: var(--interactive-accent);
    background-color: rgba(var(--interactive-accent-rgb, 83, 141, 226), 0.05);
  }

  .journalit-compact-uploader.processing {
    opacity: 0.7;
    pointer-events: none;
  }

  
  .journalit-compact-uploader-url-input {
    flex: 1;
    min-width: 0;
    padding: 0.5rem;
    font-size: 0.9em;
    background: var(--background-secondary);
    border: 1px solid var(--background-modifier-border);
    border-radius: var(--radius-s);
    color: var(--text-normal);
    transition: all 0.2s ease;
  }

  .journalit-compact-uploader-url-input::placeholder {
    color: var(--text-muted);
  }

  .journalit-compact-uploader-url-input:focus {
    outline: none;
    border-color: var(--interactive-accent);
  }

  .journalit-compact-uploader-url-input:disabled {
    background: var(--background-secondary);
    color: var(--text-muted);
    cursor: not-allowed;
  }

  
  .journalit-compact-uploader-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.4rem;
    background: transparent;
    border: none;
    border-radius: var(--radius-s);
    color: var(--text-muted);
    cursor: pointer;
    opacity: 0.6;
    transition: opacity 0.2s ease;
    flex-shrink: 0;
  }

  .journalit-compact-uploader-btn:hover:not(:disabled) {
    opacity: 1;
    color: var(--text-normal);
  }

  .journalit-compact-uploader-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  .journalit-compact-uploader-btn svg {
    width: 16px;
    height: 16px;
  }

  
  .journalit-compact-uploader-file-input {
    display: none;
  }

  
  @media (max-width: 480px) {
    .journalit-compact-uploader {
      padding: 0.4rem;
      gap: 0.4rem;
    }

    .journalit-compact-uploader-url-input {
      padding: 0.4rem;
      font-size: 0.85em;
    }

    .journalit-compact-uploader-btn svg {
      width: 14px;
      height: 14px;
    }
  }
`;
