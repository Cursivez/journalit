

interface ParsedPluginVersion {
  major: number;
  minor: number;
  patch: number;
}


function parsePluginVersion(version: string): ParsedPluginVersion | undefined {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)/);
  if (!match) return undefined;

  const major = Number(match[1]);
  const minor = Number(match[2]);
  const patch = Number(match[3]);
  if (
    !Number.isFinite(major) ||
    !Number.isFinite(minor) ||
    !Number.isFinite(patch)
  ) {
    return undefined;
  }

  return { major, minor, patch };
}


function comparePluginVersions(a: string, b: string): number | undefined {
  const left = parsePluginVersion(a);
  const right = parsePluginVersion(b);
  if (!left || !right) return undefined;

  if (left.major !== right.major) return left.major < right.major ? -1 : 1;
  if (left.minor !== right.minor) return left.minor < right.minor ? -1 : 1;
  if (left.patch !== right.patch) return left.patch < right.patch ? -1 : 1;
  return 0;
}


export function isOlderPluginVersion(
  version: string,
  threshold: string
): boolean {
  return comparePluginVersions(version, threshold) === -1;
}
