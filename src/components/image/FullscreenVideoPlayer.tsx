import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'obsidian';
import { t } from '../../lang/helpers';
import { cssVars } from '../../styles/inlineStylePolicy';
import { Pause, Play, Volume2, VolumeX } from '../shared/icons/ObsidianIcon';

interface FullscreenVideoPlayerProps {
  src: string;
}

interface FullscreenVideoState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
}

interface KeyboardTargetWithClosest extends EventTarget {
  ownerDocument?: Document;
  closest?: (selector: string) => Element | null;
}

export function isInteractiveKeyboardTarget(
  target: EventTarget | null
): boolean {
  if (!target) return false;

  const candidate = target as KeyboardTargetWithClosest;
  const targetWindow = candidate.ownerDocument?.defaultView;
  const isElement = targetWindow?.Element
    ? target instanceof targetWindow.Element
    : typeof candidate.closest === 'function';

  return (
    isElement &&
    typeof candidate.closest === 'function' &&
    Boolean(
      candidate.closest(
        'button, input, textarea, select, a[href], [contenteditable="true"], [role="button"], [role="slider"]'
      )
    )
  );
}

function formatVideoTime(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) return '0:00';
  const rounded = Math.floor(totalSeconds);
  const minutes = Math.floor(rounded / 60);
  const seconds = rounded % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function useFullscreenVideoPlayer(src: string) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const feedbackTimeoutRef = useRef<number | null>(null);
  const lastAudibleVolumeRef = useRef(1);
  const [videoState, setVideoState] = useState<FullscreenVideoState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isMuted: false,
  });
  const [clickFeedback, setClickFeedback] = useState<'play' | 'pause' | null>(
    null
  );

  const showClickFeedback = useCallback((status: 'play' | 'pause') => {
    if (feedbackTimeoutRef.current !== null) {
      window.clearTimeout(feedbackTimeoutRef.current);
    }

    setClickFeedback(status);
    feedbackTimeoutRef.current = window.setTimeout(() => {
      setClickFeedback(null);
      feedbackTimeoutRef.current = null;
    }, 650);
  }, []);

  const togglePlayback = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      if (
        video.ended ||
        (Number.isFinite(video.duration) && video.currentTime >= video.duration)
      ) {
        video.currentTime = 0;
      }
      void video.play();
      showClickFeedback('play');
    } else {
      video.pause();
      showClickFeedback('pause');
    }
  }, [showClickFeedback]);

  const seekBy = useCallback((deltaSeconds: number) => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration)) return;
    const shouldResume = !video.paused && !video.ended;

    video.currentTime = Math.min(
      video.duration,
      Math.max(0, video.currentTime + deltaSeconds)
    );
    if (shouldResume && video.paused) void video.play();
  }, []);

  const seekTo = useCallback((timeSeconds: number) => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration)) return;
    const shouldResume = !video.paused && !video.ended;

    video.currentTime = Math.min(video.duration, Math.max(0, timeSeconds));
    if (shouldResume && video.paused) void video.play();
  }, []);

  const setVolume = useCallback((volume: number) => {
    const video = videoRef.current;
    if (!video) return;

    const nextVolume = Math.min(1, Math.max(0, volume));
    video.volume = nextVolume;
    if (nextVolume > 0) {
      lastAudibleVolumeRef.current = nextVolume;
      video.muted = false;
    }
    setVideoState((current) => ({
      ...current,
      volume: video.volume,
      isMuted: video.muted,
    }));
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.muted || video.volume === 0) {
      if (video.volume === 0) {
        video.volume = lastAudibleVolumeRef.current;
      }
      video.muted = false;
    } else {
      video.muted = true;
    }
    setVideoState((current) => ({
      ...current,
      volume: video.volume,
      isMuted: video.muted,
    }));
  }, []);

  useEffect(() => {
    setVideoState((current) => ({
      ...current,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
    }));
    setClickFeedback(null);
    if (feedbackTimeoutRef.current !== null) {
      window.clearTimeout(feedbackTimeoutRef.current);
      feedbackTimeoutRef.current = null;
    }
  }, [src]);

  useEffect(
    () => () => {
      if (feedbackTimeoutRef.current !== null) {
        window.clearTimeout(feedbackTimeoutRef.current);
      }
    },
    []
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isInteractiveKeyboardTarget(event.target)) return;

      if (event.key === ' ') {
        event.preventDefault();
        event.stopPropagation();
        togglePlayback();
      } else if (event.key === 'j' || event.key === 'ArrowLeft') {
        event.preventDefault();
        event.stopPropagation();
        seekBy(-5);
      } else if (event.key === 'l' || event.key === 'ArrowRight') {
        event.preventDefault();
        event.stopPropagation();
        seekBy(5);
      } else if (event.key.toLowerCase() === 'm' && !event.repeat) {
        event.preventDefault();
        event.stopPropagation();
        toggleMute();
      }
    };

    const activeDocument = window.activeDocument;
    activeDocument.addEventListener('keydown', handleKeyDown);
    return () => activeDocument.removeEventListener('keydown', handleKeyDown);
  }, [seekBy, toggleMute, togglePlayback]);

  return {
    videoRef,
    videoState,
    clickFeedback,
    setVideoState,
    togglePlayback,
    seekBy,
    seekTo,
    setVolume,
    toggleMute,
  };
}

function FullscreenVideoControls({
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  onTogglePlayback,
  onSeekBy,
  onSeekTo,
  onVolumeChange,
  onToggleMute,
  showVolumeSlider,
}: {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  onTogglePlayback: () => void;
  onSeekBy: (deltaSeconds: number) => void;
  onSeekTo: (timeSeconds: number) => void;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  showVolumeSlider: boolean;
}) {
  const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 0;
  const safeCurrentTime = Math.min(
    safeDuration || currentTime,
    Math.max(0, currentTime)
  );

  return (
    <div
      className="journalit-fullscreen-video-controls"
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
      role="group"
      aria-label={t('media.viewer.video-controls')}
    >
      <button
        type="button"
        className="journalit-fullscreen-video-control-btn"
        onClick={onTogglePlayback}
        aria-label={
          isPlaying
            ? t('media.viewer.pause-video')
            : t('media.viewer.play-video')
        }
      >
        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
      </button>
      <button
        type="button"
        className="journalit-fullscreen-video-control-btn journalit-fullscreen-video-skip-btn"
        onClick={() => onSeekBy(-5)}
        aria-label={t('media.viewer.back-5')}
      >
        -5s
      </button>
      <div
        className="journalit-fullscreen-video-timeline-hit-area"
        style={cssVars({
          '--journalit-video-progress': `${
            safeDuration > 0 ? (safeCurrentTime / safeDuration) * 100 : 0
          }%`,
        })}
        onClick={(event) => {
          if (safeDuration <= 0) return;
          const rect = event.currentTarget.getBoundingClientRect();
          const ratio = Math.min(
            1,
            Math.max(0, (event.clientX - rect.left) / rect.width)
          );
          onSeekTo(ratio * safeDuration);
        }}
        onKeyDown={(event) => event.stopPropagation()}
        role="presentation"
      >
        <span className="journalit-fullscreen-video-timeline-rail" />
        <span className="journalit-fullscreen-video-timeline-thumb" />
        <input
          className="journalit-fullscreen-video-timeline"
          type="range"
          min="0"
          max={String(safeDuration || 0)}
          step="0.1"
          value={String(safeCurrentTime)}
          onClick={(event) => event.stopPropagation()}
          onInput={(event) => onSeekTo(Number(event.currentTarget.value))}
          onChange={(event) => onSeekTo(Number(event.currentTarget.value))}
          aria-label={t('media.viewer.timeline')}
        />
      </div>
      <button
        type="button"
        className="journalit-fullscreen-video-control-btn journalit-fullscreen-video-skip-btn"
        onClick={() => onSeekBy(5)}
        aria-label={t('media.viewer.forward-5')}
      >
        +5s
      </button>
      <span className="journalit-fullscreen-video-time">
        {formatVideoTime(safeCurrentTime)} / {formatVideoTime(safeDuration)}
      </span>
      <div
        className={
          showVolumeSlider
            ? 'journalit-fullscreen-video-volume-controls'
            : 'journalit-fullscreen-video-volume-controls journalit-fullscreen-video-volume-controls--compact'
        }
      >
        <button
          type="button"
          className="journalit-fullscreen-video-control-btn journalit-fullscreen-video-volume-btn"
          onClick={onToggleMute}
          aria-label={
            isMuted || volume === 0
              ? t('media.viewer.unmute-video')
              : t('media.viewer.mute-video')
          }
        >
          {isMuted || volume === 0 ? (
            <VolumeX size={18} />
          ) : (
            <Volume2 size={18} />
          )}
        </button>
        {showVolumeSlider ? (
          <input
            className="journalit-fullscreen-video-volume"
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={String(isMuted ? 0 : volume)}
            onInput={(event) =>
              onVolumeChange(Number(event.currentTarget.value))
            }
            onChange={(event) =>
              onVolumeChange(Number(event.currentTarget.value))
            }
            aria-label={t('media.viewer.volume')}
          />
        ) : null}
      </div>
    </div>
  );
}

export function FullscreenVideoPlayer({ src }: FullscreenVideoPlayerProps) {
  const {
    videoRef,
    videoState,
    clickFeedback,
    setVideoState,
    togglePlayback,
    seekBy,
    seekTo,
    setVolume,
    toggleMute,
  } = useFullscreenVideoPlayer(src);

  return (
    <div className="journalit-fullscreen-video-wrapper">
      <video
        ref={videoRef}
        src={src}
        className="journalit-fullscreen-video"
        controls={false}
        playsInline
        preload="metadata"
        onClick={(event) => {
          event.stopPropagation();
          togglePlayback();
        }}
        onPlay={() =>
          setVideoState((current) => ({ ...current, isPlaying: true }))
        }
        onPause={() =>
          setVideoState((current) => ({ ...current, isPlaying: false }))
        }
        onLoadedMetadata={(event) => {
          const video = event.currentTarget;
          setVideoState((current) => ({
            ...current,
            duration: Number.isFinite(video.duration) ? video.duration : 0,
            currentTime: video.currentTime,
          }));
        }}
        onTimeUpdate={(event) => {
          const video = event.currentTarget;
          setVideoState((current) => ({
            ...current,
            currentTime: video.currentTime,
            duration: Number.isFinite(video.duration)
              ? video.duration
              : current.duration,
          }));
        }}
        onVolumeChange={(event) => {
          const video = event.currentTarget;
          setVideoState((current) => ({
            ...current,
            volume: video.volume,
            isMuted: video.muted,
          }));
        }}
      />
      <FullscreenVideoControls
        isPlaying={videoState.isPlaying}
        currentTime={videoState.currentTime}
        duration={videoState.duration}
        volume={videoState.volume}
        isMuted={videoState.isMuted}
        onTogglePlayback={togglePlayback}
        onSeekBy={seekBy}
        onSeekTo={seekTo}
        onVolumeChange={setVolume}
        onToggleMute={toggleMute}
        showVolumeSlider={!Platform.isIosApp}
      />
      {clickFeedback && (
        <div className="journalit-fullscreen-video-feedback" aria-hidden="true">
          {clickFeedback === 'pause' ? <Pause size={42} /> : <Play size={42} />}
        </div>
      )}
    </div>
  );
}
