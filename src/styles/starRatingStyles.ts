

export const STAR_RATING_STYLES = `
  .journalit-star-rating {
    --journalit-star-rating-size: 1.75em;
    --journalit-star-rating-filled: var(--color-yellow);
    --journalit-star-rating-empty: var(--text-faint);
    display: inline-flex;
    align-items: center;
    gap: 0.15em;
    line-height: 1;
    white-space: nowrap;
  }

  .journalit-star-rating--sm {
    --journalit-star-rating-size: 0.95em;
    gap: 0.05em;
  }

  .journalit-star-rating--md {
    --journalit-star-rating-size: 1.35em;
  }

  .journalit-star-rating__star {
    appearance: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 0;
    background: transparent;
    box-shadow: none;
    padding: 0;
    min-height: 0;
    height: auto;
    font-size: var(--journalit-star-rating-size);
    line-height: 1;
    color: var(--journalit-star-rating-empty);
    user-select: none;
    transition: transform 0.1s ease, color 0.1s ease;
  }

  button.journalit-star-rating__star,
  button.journalit-star-rating__star:hover,
  button.journalit-star-rating__star:focus,
  button.journalit-star-rating__star:active,
  button.journalit-star-rating__star:disabled {
    background: transparent;
    border: 0;
    box-shadow: none;
    padding: 0;
    min-height: 0;
    height: auto;
  }

  .journalit-star-rating--interactive .journalit-star-rating__star {
    cursor: pointer;
  }

  @media (hover: hover) {
    .journalit-star-rating--interactive .journalit-star-rating__star:hover {
      transform: scale(1.18);
    }
  }

  
  .is-mobile .journalit-star-rating--interactive {
    gap: 0;
  }

  .is-mobile .journalit-star-rating--interactive .journalit-star-rating__star {
    min-width: 32px;
    min-height: 32px;
    font-size: calc(var(--journalit-star-rating-size) * 1.25);
  }

  .journalit-star-rating__star:focus-visible {
    outline: 2px solid var(--interactive-accent);
    outline-offset: 2px;
    border-radius: var(--radius-s);
  }

  .journalit-star-rating--disabled .journalit-star-rating__star {
    cursor: default;
    opacity: 0.7;
  }

  .journalit-star-rating__star--full {
    color: var(--journalit-star-rating-filled);
  }

  .journalit-star-rating--previewing .journalit-star-rating__star--full {
    opacity: 0.75;
  }

  .journalit-star-rating__half {
    position: relative;
    display: inline-block;
    color: var(--journalit-star-rating-empty);
  }

  .journalit-star-rating__half-fill {
    position: absolute;
    left: 0;
    top: 0;
    overflow: hidden;
    width: 50%;
    color: var(--journalit-star-rating-filled);
  }

  .journalit-star-rating__score {
    margin-left: 0.5em;
    font-size: var(--font-ui-small);
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    color: var(--text-muted);
  }
`;
