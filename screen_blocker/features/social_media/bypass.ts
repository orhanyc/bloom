export const BYPASS_MINUTES = 5;

type Bypasses = Record<string, number>;

export async function getBypassExpiry(site: string): Promise<number> {
  const { bypasses = {} } = await browser.storage.local.get('bypasses');
  return (bypasses as Bypasses)[site] ?? 0;
}

export async function startBypass(site: string): Promise<number> {
  const { bypasses = {}, bypassCount = 0 } = await browser.storage.local.get([
    'bypasses',
    'bypassCount',
  ]);

  const expiresAt = Date.now() + BYPASS_MINUTES * 60 * 1000;

  await browser.storage.local.set({
    bypasses: { ...(bypasses as Bypasses), [site]: expiresAt },
    bypassCount: (bypassCount as number) + 1,
  });

  return expiresAt;
}
