

import { hasTranslation, t } from '../lang/helpers';


export function formatAccountTypeLabel(type: string): string {
  const slug = type.trim();
  if (!slug) return '';

  const key = `account.type.${slug.toLowerCase()}`;
  if (hasTranslation(key)) return t(key);

  return slug
    .split(/[_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
