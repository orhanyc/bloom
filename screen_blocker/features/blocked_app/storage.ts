export type BlockedSite = {
  domain: string;
  enabled: boolean;
};

export const DEFAULT_SITES: BlockedSite[] = [
  { domain: 'instagram.com', enabled: false },
  { domain: 'tiktok.com', enabled: false },
  { domain: 'reddit.com', enabled: false },
  { domain: 'youtube.com', enabled: false },
];

export function normalizeDomain(value: string) {
  const domain = value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .split('/')[0] ?? '';

  return domain.replace(/^www\./, '');
}

export function domainMatches(hostname: string, domain: string) {
  const host = normalizeDomain(hostname);
  const site = normalizeDomain(domain);
  return host === site || host.endsWith(`.${site}`);
}

// Shared storage keeps the popup and blocker on the same settings.
export async function getBlockedSites(): Promise<BlockedSite[]> {
  const result = await browser.storage.local.get('blockedSites');
  return (result.blockedSites as BlockedSite[] | undefined) ?? DEFAULT_SITES;
}

export function saveBlockedSites(sites: BlockedSite[]) {
  return browser.storage.local.set({ blockedSites: sites });
}
