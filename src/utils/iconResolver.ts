

import {
  PlusCircle,
  FolderTree,
  Grip,
  Users,
  User,
  Calendar,
  CalendarCheck,
  CalendarRange,
  CalendarSearch,
  CalendarHeart,
  Import,
  Blocks,
  CircleDotDashed,
  File,
  FileText,
  FlaskConical,
  Calculator,
  Upload,
  Zap,
  Radio,
  ObsidianIconComponent,
} from '../components/shared/icons/ObsidianIcon';


const iconMap: Record<string, ObsidianIconComponent> = {
  'plus-circle': PlusCircle,
  'folder-tree': FolderTree,
  grip: Grip,
  users: Users,
  user: User,
  calendar: Calendar,
  'calendar-check': CalendarCheck,
  'calendar-range': CalendarRange,
  import: Import,
  blocks: Blocks,
  'lucide-blocks': Blocks,
  'circle-dot-dashed': CircleDotDashed,
  file: File,
  'file-text': FileText,
  'flask-conical': FlaskConical,
  'calendar-search': CalendarSearch,
  'calendar-heart': CalendarHeart,
  calculator: Calculator,
  upload: Upload,
  zap: Zap,
  radio: Radio,
};


export function resolveIcon(
  iconName: string,
  fallback: ObsidianIconComponent = PlusCircle
): ObsidianIconComponent {
  return iconMap[iconName] || fallback;
}
