
import React from 'react';
import { mergeClassNames } from '../../utils/classNames';

const STARS = [1, 2, 3, 4, 5] as const;

type StarRatingSize = 'sm' | 'md' | 'lg';

interface StarRatingProps {
  value: number | null | undefined;
  
  label: string;
  onChange?: (value: number | null) => void;
  
  clearable?: boolean;
  
  disabled?: boolean;
  size?: StarRatingSize;
  
  showScore?: boolean;
  
  hint?: string;
  className?: string;
}

type StarFill = 'full' | 'half' | 'empty';

const getStarFill = (star: number, value: number): StarFill =>
  value >= star ? 'full' : value >= star - 0.5 ? 'half' : 'empty';

const StarGlyph: React.FC<{ fill: StarFill }> = ({ fill }) =>
  fill === 'half' ? (
    <span className="journalit-star-rating__half" aria-hidden="true">
      <span className="journalit-star-rating__half-base">★</span>
      <span className="journalit-star-rating__half-fill">★</span>
    </span>
  ) : (
    <span aria-hidden="true">★</span>
  );

export const StarRating: React.FC<StarRatingProps> = ({
  value,
  label,
  onChange,
  clearable = false,
  disabled = false,
  size = 'md',
  showScore = false,
  hint,
  className,
}) => {
  const [hoveredStar, setHoveredStar] = React.useState<number | null>(null);
  const starRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const currentValue = value ?? 0;
  const interactive = onChange !== undefined || disabled;

  
  const getClickValue = (star: number): number | null => {
    if (currentValue === star) return star - 0.5;
    if (currentValue === star - 0.5) return clearable ? null : star;
    return star;
  };

  
  const shownValue =
    hoveredStar === null ? currentValue : (getClickValue(hoveredStar) ?? 0);

  const rootClassName = mergeClassNames(
    'journalit-star-rating',
    `journalit-star-rating--${size}`,
    onChange && !disabled && 'journalit-star-rating--interactive',
    disabled && 'journalit-star-rating--disabled',
    hoveredStar !== null && 'journalit-star-rating--previewing',
    className
  );

  const score = showScore ? (
    <span className="journalit-star-rating__score">{currentValue}/5</span>
  ) : null;

  if (!interactive) {
    return (
      <span
        className={rootClassName}
        role="img"
        aria-label={`${label}: ${currentValue}/5`}
      >
        {STARS.map((star) => {
          const fill = getStarFill(star, currentValue);
          return (
            <span
              key={star}
              className={`journalit-star-rating__star journalit-star-rating__star--${fill}`}
            >
              <StarGlyph fill={fill} />
            </span>
          );
        })}
        {score}
      </span>
    );
  }

  const commit = (next: number | null) => {
    if (!onChange || disabled) return;
    setHoveredStar(null);
    onChange(next);
  };

  const step = (delta: number) => {
    const next = Math.min(5, Math.max(0, currentValue + delta));
    if (next === currentValue || (next === 0 && !clearable)) return;
    commit(next > 0 ? next : null);
    
    starRefs.current[Math.max(Math.ceil(next), 1) - 1]?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        step(0.5);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        step(-0.5);
        break;
      case 'Home':
        step(0.5 - currentValue);
        break;
      case 'End':
        step(5 - currentValue);
        break;
      default:
        return;
    }
    event.preventDefault();
  };

  
  
  const checkedStar = Math.ceil(currentValue);
  const focusStar = checkedStar > 0 ? checkedStar : 1;
  const groupLabel = `${label}: ${currentValue}/5`;

  return (
    <span
      className={rootClassName}
      role="radiogroup"
      aria-label={hint ? `${groupLabel}. ${hint}` : groupLabel}
      aria-disabled={disabled || undefined}
      onPointerLeave={() => setHoveredStar(null)}
      onKeyDown={handleKeyDown}
    >
      {STARS.map((star) => {
        const fill = getStarFill(star, shownValue);
        return (
          <button
            key={star}
            ref={(element) => {
              starRefs.current[star - 1] = element;
            }}
            type="button"
            role="radio"
            disabled={disabled}
            tabIndex={star === focusStar ? 0 : -1}
            aria-label={`${label}: ${star}/5`}
            aria-checked={star === checkedStar}
            className={`journalit-star-rating__star journalit-star-rating__star--${fill}`}
            onPointerEnter={(event) => {
              
              
              if (!disabled && event.pointerType === 'mouse') {
                setHoveredStar(star);
              }
            }}
            onClick={() => commit(getClickValue(star))}
            onContextMenu={(event) => {
              event.preventDefault();
              commit(star - 0.5);
            }}
          >
            <StarGlyph fill={fill} />
          </button>
        );
      })}
      {score}
    </span>
  );
};
