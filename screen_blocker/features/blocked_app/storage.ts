export type BlockedSite = {
  domain: string;
  enabled: boolean;
};

export const DEFAULT_SITES: BlockedSite[] = [
  
];

// Shared storage keeps the popup and blocker on the same settings.
export async function getBlockedSites(): Promise<BlockedSite[]> {
  const result = await browser.storage.local.get('blockedSites');
  return (result.blockedSites as BlockedSite[] | undefined) ?? DEFAULT_SITES;
}

export function saveBlockedSites(sites: BlockedSite[]) {
  return browser.storage.local.set({ blockedSites: sites });
}
