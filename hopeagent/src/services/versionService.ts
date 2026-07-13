export interface VersionInfo {
  version: string;
  buildTime: string;
  commit: string;
}

let cachedVersion: VersionInfo | null = null;

export async function fetchVersion(): Promise<VersionInfo> {
  const res = await fetch('/hopeai/pro/version.json', { cache: 'no-cache' });
  return res.json();
}

export async function checkForUpdate(): Promise<{ hasUpdate: boolean; newVersion?: VersionInfo }> {
  const newVersion = await fetchVersion();
  
  if (cachedVersion && cachedVersion.version !== newVersion.version) {
    return { hasUpdate: true, newVersion };
  }
  
  cachedVersion = newVersion;
  return { hasUpdate: false };
}

export function getCurrentVersion(): VersionInfo | null {
  return cachedVersion;
}

export async function initVersion(): Promise<VersionInfo> {
  cachedVersion = await fetchVersion();
  return cachedVersion;
}