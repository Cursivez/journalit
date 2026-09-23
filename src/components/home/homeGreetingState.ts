export interface HomeGreetingResult {
  prefix: string;
  suffix: string;
  displayName: string;
  originalString: string;
}

export function updateGreetingDisplayName(
  greeting: HomeGreetingResult,
  displayName: string,
  emptyNameGreeting: string
): HomeGreetingResult {
  if (!displayName) {
    return {
      prefix: `${emptyNameGreeting}, `,
      suffix: '',
      displayName: '',
      originalString: `${emptyNameGreeting}, `,
    };
  }

  return {
    ...greeting,
    displayName,
    originalString: `${greeting.prefix}${displayName}${greeting.suffix}`,
  };
}
