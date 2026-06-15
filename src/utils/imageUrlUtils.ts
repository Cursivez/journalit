


const IMAGE_EXTENSIONS = [
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.webp',
  '.bmp',
  '.svg',
];


const IMAGE_HOSTING_DOMAINS = [
  's3.tradingview.com',
  'i.imgur.com',
  'imgur.com',
  'pbs.twimg.com',
  'media.discordapp.net',
  'cdn.discordapp.com',
  'images.unsplash.com',
  'i.redd.it',
  'preview.redd.it',
];


export function isTradingViewUrl(url: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return (
      parsed.hostname === 'www.tradingview.com' ||
      parsed.hostname === 'tradingview.com' ||
      parsed.hostname === 's3.tradingview.com'
    );
  } catch {
    return false;
  }
}


export function convertTradingViewUrl(url: string): string | null {
  if (!url) return null;

  try {
    const parsed = new URL(url);

    
    if (parsed.hostname === 's3.tradingview.com') {
      return url;
    }

    
    const match = parsed.pathname.match(/^\/x\/([a-zA-Z0-9]+)\/?$/);
    if (!match) {
      return null;
    }

    const snapshotId = match[1];
    const firstLetter = snapshotId[0].toLowerCase();

    return `https://s3.tradingview.com/snapshots/${firstLetter}/${snapshotId}.png`;
  } catch {
    return null;
  }
}


export function isValidImageUrl(url: string): boolean {
  if (!url) return false;

  try {
    const parsed = new URL(url);

    if (parsed.protocol === 'data:') {
      return /^data:image\//i.test(url);
    }

    
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return false;
    }

    
    const pathname = parsed.pathname.toLowerCase();
    if (IMAGE_EXTENSIONS.some((ext) => pathname.endsWith(ext))) {
      return true;
    }

    
    const hostname = parsed.hostname.toLowerCase();
    if (
      IMAGE_HOSTING_DOMAINS.some(
        (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
      )
    ) {
      return true;
    }

    
    if (hostname === 's3.tradingview.com' && pathname.includes('/snapshots/')) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}
