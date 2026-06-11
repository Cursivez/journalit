interface ParsedReleaseVersion {
  major: number;
  minor: number;
  patch: number;
  prerelease: string | null;
  betaNum: number | null;
}

function parseReleaseVersion(version: string): ParsedReleaseVersion {
  const [main, prereleasePart] = version.split('-', 2);
  const [major = 0, minor = 0, patch = 0] = main.split('.').map(Number);

  const prerelease = prereleasePart ?? null;
  let betaNum: number | null = null;

  if (prerelease?.startsWith('beta.')) {
    const parsedBetaNum = Number.parseInt(prerelease.slice('beta.'.length), 10);
    betaNum = Number.isFinite(parsedBetaNum) ? parsedBetaNum : null;
  }

  return {
    major: Number.isFinite(major) ? major : 0,
    minor: Number.isFinite(minor) ? minor : 0,
    patch: Number.isFinite(patch) ? patch : 0,
    prerelease,
    betaNum,
  };
}

export function compareReleaseVersions(a: string, b: string): number {
  const vA = parseReleaseVersion(a);
  const vB = parseReleaseVersion(b);

  if (vB.major !== vA.major) return vB.major - vA.major;
  if (vB.minor !== vA.minor) return vB.minor - vA.minor;
  if (vB.patch !== vA.patch) return vB.patch - vA.patch;

  const aIsPrerelease = !!vA.prerelease;
  const bIsPrerelease = !!vB.prerelease;

  if (aIsPrerelease !== bIsPrerelease) {
    return aIsPrerelease ? 1 : -1;
  }

  if (vA.betaNum !== null && vB.betaNum !== null && vA.betaNum !== vB.betaNum) {
    return vB.betaNum - vA.betaNum;
  }

  if (vA.prerelease && vB.prerelease && vA.prerelease !== vB.prerelease) {
    return vB.prerelease.localeCompare(vA.prerelease);
  }

  return 0;
}
