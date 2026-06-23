import React, { useLayoutEffect, useRef } from 'react';
import { setIcon } from 'obsidian';
import { cssVars } from '../../../styles/inlineStylePolicy';

const ICON_CLASS_NAME = 'journalit-obsidian-icon';

interface ObsidianIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: number | string;
  strokeWidth?: number | string;
  fill?: string;
  color?: string;
}

export type ObsidianIconComponent = React.FC<ObsidianIconProps>;

const ObsidianIcon: React.FC<ObsidianIconProps & { icon: string }> = ({
  icon,
  size,
  strokeWidth,
  fill,
  color,
  className,
  ...props
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const iconSize = size === undefined ? undefined : String(size);
  const iconSizeCss =
    typeof size === 'number'
      ? `${size}px`
      : size === undefined
        ? undefined
        : size;

  useLayoutEffect(() => {
    const iconElement = ref.current;
    if (!iconElement) return;

    setIcon(iconElement, icon);
    const svg = iconElement.querySelector('svg');
    if (!svg) return;

    if (iconSize !== undefined) {
      svg.setAttribute('width', iconSize);
      svg.setAttribute('height', iconSize);
    }

    if (strokeWidth !== undefined) {
      svg.setAttribute('stroke-width', String(strokeWidth));
    }

    if (fill !== undefined) {
      svg.setAttribute('fill', fill);
    }

    if (color !== undefined) {
      svg.setAttribute('color', color);
      svg.setAttribute('stroke', color);
    }
  }, [icon, iconSize, strokeWidth, fill, color]);

  return (
    <span
      ref={ref}
      className={
        className ? `${ICON_CLASS_NAME} ${className}` : ICON_CLASS_NAME
      }
      style={cssVars({ '--icon-size': iconSizeCss })}
      {...props}
    />
  );
};

function createIcon(icon: string): ObsidianIconComponent {
  const IconComponent: ObsidianIconComponent = (props) => (
    <ObsidianIcon icon={icon} {...props} />
  );
  IconComponent.displayName = `ObsidianIcon(${icon})`;
  return IconComponent;
}

export const AlertCircle: ObsidianIconComponent = createIcon('alert-circle');
export const AlertTriangle: ObsidianIconComponent =
  createIcon('alert-triangle');
export const ArrowDown: ObsidianIconComponent = createIcon('arrow-down');
export const ArrowDown10: ObsidianIconComponent = createIcon('arrow-down-10');
export const ArrowDownWideNarrow: ObsidianIconComponent = createIcon(
  'arrow-down-wide-narrow'
);
export const ArrowDownZA: ObsidianIconComponent = createIcon('arrow-down-za');
export const ArrowRight: ObsidianIconComponent = createIcon('arrow-right');
export const ArrowUp: ObsidianIconComponent = createIcon('arrow-up');
export const ArrowUp01: ObsidianIconComponent = createIcon('arrow-up-01');
export const ArrowUpAZ: ObsidianIconComponent = createIcon('arrow-up-az');
export const ArrowUpDown: ObsidianIconComponent = createIcon('arrow-up-down');
export const Download: ObsidianIconComponent = createIcon('download');
export const ArrowUpNarrowWide: ObsidianIconComponent = createIcon(
  'arrow-up-narrow-wide'
);
export const Award: ObsidianIconComponent = createIcon('award');
export const BadgeCheck: ObsidianIconComponent = createIcon('badge-check');
export const Ban: ObsidianIconComponent = createIcon('ban');
export const Blocks: ObsidianIconComponent = createIcon('lucide-blocks');
export const BookOpen: ObsidianIconComponent = createIcon('book-open');
export const Calculator: ObsidianIconComponent = createIcon('calculator');
export const Calendar: ObsidianIconComponent = createIcon('calendar');
export const CalendarCheck: ObsidianIconComponent =
  createIcon('calendar-check');
export const CalendarHeart: ObsidianIconComponent =
  createIcon('calendar-heart');
export const CalendarIcon: ObsidianIconComponent = createIcon('calendar');
export const CalendarRange: ObsidianIconComponent =
  createIcon('calendar-range');
export const CalendarSearch: ObsidianIconComponent =
  createIcon('calendar-search');
export const Check: ObsidianIconComponent = createIcon('check');
export const CheckCircle: ObsidianIconComponent = createIcon('check-circle');
export const CheckCircle2: ObsidianIconComponent = createIcon('check-circle-2');
export const CheckSquare: ObsidianIconComponent = createIcon('check-square');
export const ChevronDown: ObsidianIconComponent = createIcon('chevron-down');
export const ChevronRight: ObsidianIconComponent = createIcon('chevron-right');
export const Circle: ObsidianIconComponent = createIcon('circle');
export const CircleCheckBig: ObsidianIconComponent =
  createIcon('circle-check-big');
export const CircleDotDashed: ObsidianIconComponent =
  createIcon('circle-dot-dashed');
export const ClipboardCheck: ObsidianIconComponent =
  createIcon('clipboard-check');
export const ClipboardPaste: ObsidianIconComponent =
  createIcon('clipboard-paste');
export const Clock: ObsidianIconComponent = createIcon('clock');
export const ClockIcon: ObsidianIconComponent = createIcon('clock');
export const Copy: ObsidianIconComponent = createIcon('copy');
export const Edit: ObsidianIconComponent = createIcon('edit');
export const ExternalLink: ObsidianIconComponent = createIcon('external-link');
export const Eye: ObsidianIconComponent = createIcon('eye');
export const EyeOff: ObsidianIconComponent = createIcon('eye-off');
export const File: ObsidianIconComponent = createIcon('file');
export const FileText: ObsidianIconComponent = createIcon('file-text');
export const Flame: ObsidianIconComponent = createIcon('flame');
export const FlaskConical: ObsidianIconComponent = createIcon('flask-conical');
export const FolderOpen: ObsidianIconComponent = createIcon('folder-open');
export const FolderTree: ObsidianIconComponent = createIcon('folder-tree');
export const Funnel: ObsidianIconComponent = createIcon('funnel');
export const Ghost: ObsidianIconComponent = createIcon('ghost');
export const Network: ObsidianIconComponent = createIcon('network');
export const Grid2x2Plus: ObsidianIconComponent = createIcon('grid-2x-2plus');
export const Grip: ObsidianIconComponent = createIcon('grip');
export const GripVertical: ObsidianIconComponent = createIcon('grip-vertical');
export const Import: ObsidianIconComponent = createIcon('import');
export const Info: ObsidianIconComponent = createIcon('info');
export const Lightbulb: ObsidianIconComponent = createIcon('lightbulb');
export const Lock: ObsidianIconComponent = createIcon('lock');
export const MessagesSquare: ObsidianIconComponent =
  createIcon('messages-square');
export const Minus: ObsidianIconComponent = createIcon('minus');
export const Monitor: ObsidianIconComponent = createIcon('monitor');
export const MoreHorizontal: ObsidianIconComponent =
  createIcon('more-horizontal');
export const Plug: ObsidianIconComponent = createIcon('plug');
export const Plus: ObsidianIconComponent = createIcon('plus');
export const PlusCircle: ObsidianIconComponent = createIcon('plus-circle');
export const RefreshCw: ObsidianIconComponent = createIcon('refresh-cw');
export const RotateCcw: ObsidianIconComponent = createIcon('rotate-ccw');
export const Save: ObsidianIconComponent = createIcon('save');
export const Search: ObsidianIconComponent = createIcon('search');
export const ScanSearch: ObsidianIconComponent = createIcon('scan-search');
export const Server: ObsidianIconComponent = createIcon('server');
export const Settings: ObsidianIconComponent = createIcon('settings');
export const Settings2: ObsidianIconComponent = createIcon('settings-2');
export const Shield: ObsidianIconComponent = createIcon('shield');
export const SlidersHorizontal: ObsidianIconComponent =
  createIcon('sliders-horizontal');
export const Snowflake: ObsidianIconComponent = createIcon('snowflake');
export const Sparkles: ObsidianIconComponent = createIcon('sparkles');
export const Square: ObsidianIconComponent = createIcon('square');
export const SquareCheckBig: ObsidianIconComponent =
  createIcon('square-check-big');
export const SquarePen: ObsidianIconComponent = createIcon('square-pen');
export const Star: ObsidianIconComponent = createIcon('star');
export const Sun: ObsidianIconComponent = createIcon('sun');
export const Tag: ObsidianIconComponent = createIcon('tag');
export const Trash: ObsidianIconComponent = createIcon('trash');
export const Trash2: ObsidianIconComponent = createIcon('trash-2');
export const TrendingDown: ObsidianIconComponent = createIcon('trending-down');
export const TrendingUp: ObsidianIconComponent = createIcon('trending-up');
export const Upload: ObsidianIconComponent = createIcon('upload');
export const User: ObsidianIconComponent = createIcon('user');
export const Users: ObsidianIconComponent = createIcon('users');
export const Wrench: ObsidianIconComponent = createIcon('wrench');
export const X: ObsidianIconComponent = createIcon('x');
export const Zap: ObsidianIconComponent = createIcon('zap');
export const Image: ObsidianIconComponent = createIcon('lucide-image');
export const Repeat2: ObsidianIconComponent = createIcon('repeat-2');
