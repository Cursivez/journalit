

import {
  AlertTriangle,
  ArrowUpDown,
  CalendarCheck,
  CalendarRange,
  Check,
  CircleDollarSign,
  CircleDotDashed,
  ClipboardCheck,
  FlaskConical,
  Image,
  Layers,
  ListFilter,
  Tag,
  TrendingUp,
  UsersRound,
} from '../../icons/ObsidianIcon';

export const FILTER_MENU_ICONS = {
  period: CalendarRange,
  accounts: UsersRound,
  tickers: CircleDollarSign,
  setups: FlaskConical,
  tags: Tag,
  mistakes: AlertTriangle,
  sessionLogTags: CalendarCheck,
  tradeType: Layers,
  status: TrendingUp,
  direction: ArrowUpDown,
  reviewStatus: ClipboardCheck,
  customFields: ListFilter,
  gallery: Image,
  annotationStatus: Check,
  mediaTags: CircleDotDashed,
} as const;
